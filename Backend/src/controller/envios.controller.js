"use strict";
import { createTransportOrder, getTrackingInfo, updateTrackingStatus } from "../services/chilexpress.service.js";
import Envios from "../entity/envio.entity.js";
import { AppDataSource } from "../config/configDB.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

/**
 * Procesa un envío creando la orden de transporte en Chilexpress
 */
export async function procesarEnvioController(req, res) {
    try {
        const { id_compra, serviceCode, destinationCoverage } = req.body;

        if (!id_compra || !serviceCode || !destinationCoverage) {
            return handleErrorClient(res, 400, "Datos de envío incompletos");
        }

        const shippingData = {
            serviceCode,
            destinationCoverage
        };

        const [result, error] = await createTransportOrder(id_compra, shippingData);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return handleSuccess(res, 200, "Orden de transporte creada exitosamente", {
            transportOrderNumber: result.detail[0].transportOrderNumber,
            certificateNumber: result.header.certificateNumber,
            reference: result.detail[0].reference,
            barcode: result.detail[0].barcode,
            labelData: result.detail[0].label?.labelData
        });

    } catch (error) {
        console.error("Error en procesarEnvioController:", error);
        return handleErrorServer(res, 500, "Error interno al procesar el envío");
    }
}

/**
 * Obtiene el tracking de un envío específico
 */
export async function getTrackingController(req, res) {
    try {
        const { id_compra } = req.params;

        const [envioActualizado, error] = await updateTrackingStatus(id_compra);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return handleSuccess(res, 200, "Información de tracking obtenida", envioActualizado);

    } catch (error) {
        console.error("Error en getTrackingController:", error);
        return handleErrorServer(res, 500, "Error interno al obtener el tracking");
    }
}

/**
 * Obtiene todos los envíos para el panel de administración
 */
export async function getAllEnviosController(req, res) {
    try {
        const envioRepository = AppDataSource.getRepository(Envios);
        const envios = await envioRepository.find({
            relations: ["Compras", "Compras.Usuario"],
            order: { createdAt: "DESC" }
        });

        const enviosConDetalles = envios.map(envio => ({
            ...envio,
            compra: {
                id_compra: envio.Compras.id_compra,
                payment_amount: envio.Compras.payment_amount,
                nombre: envio.Compras.nombre,
                apellido: envio.Compras.apellido,
                email: envio.Compras.email,
                telefono: envio.Compras.telefono,
                direccion: envio.Compras.direccion,
                ciudad: envio.Compras.ciudad,
                region: envio.Compras.region
            }
        }));

        return handleSuccess(res, 200, "Envíos obtenidos exitosamente", enviosConDetalles);

    } catch (error) {
        console.error("Error en getAllEnviosController:", error);
        return handleErrorServer(res, 500, "Error interno al obtener los envíos");
    }
}

/**
 * Reimprime una etiqueta de envío
 */
export async function reimprimirEtiquetaController(req, res) {
    try {
        const { transport_order_number } = req.body;

        if (!transport_order_number) {
            return handleErrorClient(res, 400, "Número de orden de transporte requerido");
        }

        const labelRequest = {
            transportOrderNumber: parseInt(transport_order_number),
            labelType: 2 // Imagen binaria + datos
        };

        const response = await fetch('https://testservices.wschilexpress.com/transport-orders/api/v1.0/transport-orders-labels', {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.CHILEXPRESS_ENVIOS_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(labelRequest)
        });

        const result = await response.json();

        if (result.statusCode !== 0) {
            return handleErrorClient(res, 400, result.statusDescription || "Error al reimprimir etiqueta");
        }

        // La estructura para reimprimir etiqueta es diferente: data.detail (objeto) y data.label
        const detail = result.data?.detail;
        const label = result.data?.label;
        
        if (!detail || !label) {
            return handleErrorClient(res, 400, "Respuesta inválida de Chilexpress");
        }

        return handleSuccess(res, 200, "Etiqueta reimpresa exitosamente", {
            labelData: label.labelData || null,
            labelType: label.labelType || null,
            barcode: detail.barcode || null,
            transportOrderNumber: detail.transportOrderNumber || null,
            reference: detail.reference || null,
            recipient: detail.recipient || null,
            address: detail.address || null
        });

    } catch (error) {
        console.error("Error en reimprimirEtiquetaController:", error);
        return handleErrorServer(res, 500, "Error interno al reimprimir etiqueta");
    }
}

/**
 * Obtiene el envío de una compra específica
 */
export async function getEnvioPorCompraController(req, res) {
    try {
        const { id_compra } = req.params;

        const envioRepository = AppDataSource.getRepository(Envios);
        const envio = await envioRepository.findOne({
            where: { id_compra: parseInt(id_compra) },
            relations: ["Compras"]
        });

        if (!envio) {
            return handleErrorClient(res, 404, "Envío no encontrado para esta compra");
        }

        return handleSuccess(res, 200, "Envío encontrado", envio);

    } catch (error) {
        console.error("Error en getEnvioPorCompraController:", error);
        return handleErrorServer(res, 500, "Error interno al obtener el envío");
    }
} 