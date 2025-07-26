import Envios from "../entity/envio.entity.js";
import Compras from "../entity/compra.entity.js";
import Compra_Producto from "../entity/compra_producto.entity.js";
import { AppDataSource } from "../config/configDB.js";

const CHILEXPRESS_ENVIOS_KEY = process.env.CHILEXPRESS_ENVIOS_API_KEY;
const BASE_URL = 'https://testservices.wschilexpress.com';

const COMPANY_CONFIG = {
    customerCardNumber: "18578680",
    originCoverageCode: "PUDA",
    sellerRut: "DEFAULT"
};

/**
 * Crea una orden de transporte en Chilexpress
 */
export async function createTransportOrder(id_compra, shippingData) {
    try {
        // Obtener datos de la compra
        const compraRepository = AppDataSource.getRepository(Compras);
        const compra = await compraRepository.findOne({
            where: { id_compra }
        });

        if (!compra) {
            return [null, "Compra no encontrada"];
        }

        // Obtener productos de la compra por separado
        const compraProductoRepository = AppDataSource.getRepository(Compra_Producto);
        const productosCompra = await compraProductoRepository.find({
            where: { id_compra },
            relations: ["Productos"]
        });

        if (!productosCompra || productosCompra.length === 0) {
            return [null, "No se encontraron productos para esta compra"];
        }

        // Verificar si ya existe un envío para esta compra
        const envioRepository = AppDataSource.getRepository(Envios);
        const envioExistente = await envioRepository.findOne({
            where: { id_compra }
        });

        if (envioExistente && envioExistente.transport_order_number) {
            return [null, "Ya existe una orden de transporte para esta compra"];
        }

        // Construir request para Chilexpress
        const transportOrderRequest = {
            header: {
                certificateNumber: 0,
                customerCardNumber: COMPANY_CONFIG.customerCardNumber,
                countyOfOriginCoverageCode: COMPANY_CONFIG.originCoverageCode,
                labelType: 2,
                sellerRut: COMPANY_CONFIG.sellerRut
            },
            details: [{
                addresses: [
                    {
                        addressId: 0,
                        countyCoverageCode: shippingData.destinationCoverage || "STGO",
                        streetName: compra.direccion ? compra.direccion.split(' ').slice(0, 2).join(' ') : "CALLE EJEMPLO",
                        streetNumber: extractStreetNumber(compra.direccion) || "123",
                        supplement: extractSupplement(compra.direccion) || "",
                        addressType: "DEST",
                        deliveryOnCommercialOffice: false,
                        observation: compra.instrucciones || "DEFAULT"
                    },
                    {
                        addressId: 0,
                        countyCoverageCode: "PLCA",
                        streetName: "SARMIENTO",
                        streetNumber: "120",
                        supplement: "DEFAULT",
                        addressType: "DEV",
                        deliveryOnCommercialOffice: false,
                        observation: "DEFAULT"
                    }
                ],
                contacts: [
                    {
                        name: "Nombre Remitente",
                        phoneNumber: "123456789",
                        mail: "nombreRemitente@email.cl",
                        contactType: "R"
                    },
                    {
                        name: `${compra.nombre || 'Nombre'} ${compra.apellido || 'Apellido'}`,
                        phoneNumber: compra.telefono || "123456789",
                        mail: compra.email || "nombreDestinatario@email.cl",
                        contactType: "D"
                    }
                ],
                packages: [{
                    weight: calculatePackageWeight(productosCompra),
                    height: "10",
                    width: "15",
                    length: "20",
                    serviceDeliveryCode: shippingData.serviceCode,
                    productCode: "3",
                    deliveryReference: `GPS-${compra.id_compra}`,
                    groupReference: `COMPRA-${compra.id_compra}`,
                    declaredValue: parseInt(compra.payment_amount),
                    declaredContent: "5",
                    receivableAmountInDelivery: 0
                }]
            }]
        };

        // Llamar a la API de Chilexpress
        const response = await fetch(`${BASE_URL}/transport-orders/api/v1.0/transport-orders`, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": CHILEXPRESS_ENVIOS_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transportOrderRequest)
        });

        const result = await response.json();
        console.log('Respuesta Chilexpress:', result); // <-- Log para depuración

        if (result.statusCode !== 0) {
            return [null, result.statusDescription || "Error al crear orden de transporte"];
        }

        const envioData = {
            id_compra,
            estado: "procesando",
            transport_order_number: result.data.detail[0].transportOrderNumber,
            certificate_number: result.data.header.certificateNumber,
            tracking_reference: result.data.detail[0].reference,
            service_code: shippingData.serviceCode,
            service_description: result.data.detail[0].serviceDescriptionFull,
            label_data: result.data.detail[0].label?.labelData,
            label_type: result.data.detail[0].label?.labelType,
            barcode: result.data.detail[0].barcode,
            current_status: "Orden creada",
            current_location: "Los Alamos - Origen"
        };

        if (envioExistente) {
            await envioRepository.update({ id_compra }, envioData);
        } else {
            const nuevoEnvio = envioRepository.create(envioData);
            await envioRepository.save(nuevoEnvio);
        }

        return [result.data, null];

    } catch (error) {
        console.error("Error al crear orden de transporte:", error);
        return [null, "Error interno al procesar el envío"];
    }
}

/**
 * Consulta el tracking de un envío
 */
export async function getTrackingInfo(transportOrderNumber) {
    try {
        const trackingRequest = {
            transportOrderNumber: parseInt(transportOrderNumber),
            reference: `GPS-${transportOrderNumber}`,
            rut: 77398220,
            showTrackingEvents: 1
        };

        const response = await fetch(`${BASE_URL}/transport-orders/api/v1.0/tracking`, {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": CHILEXPRESS_ENVIOS_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(trackingRequest)
        });

        const result = await response.json();

        if (result.statusCode !== 0) {
            return [null, result.statusDescription || "Error al consultar tracking"];
        }

        return [result.data, null];

    } catch (error) {
        console.error("Error al consultar tracking:", error);
        return [null, "Error interno al consultar el seguimiento"];
    }
}

/**
 * Actualiza el estado de tracking de un envío en la base de datos
 */
export async function updateTrackingStatus(id_compra) {
    try {
        const envioRepository = AppDataSource.getRepository(Envios);
        const envio = await envioRepository.findOne({
            where: { id_compra }
        });

        if (!envio) {
            return [null, "Envío no encontrado"];
        }

        if (!envio.transport_order_number) {
            return [envio, null];
        }

        const [trackingData, error] = await getTrackingInfo(envio.transport_order_number);

        if (error) {
            return [envio, null];
        }

        if (trackingData) {
            const updateData = {
                current_status: trackingData.transportOrderData?.status || envio.current_status,
                current_location: trackingData.transportOrderData?.locationStatus || envio.current_location,
                last_tracking_update: new Date()
            };

            if (trackingData.deliveryData) {
                updateData.delivered_date = new Date(trackingData.deliveryData.deliveryDateTime);
                updateData.delivered_to = trackingData.deliveryData.receptorName;
                updateData.estado = "entregado";
            }

            await envioRepository.update({ id_compra }, updateData);

            const envioActualizado = await envioRepository.findOne({
                where: { id_compra }
            });

            return [{ ...envioActualizado, trackingEvents: trackingData.trackingEvents }, null];
        }

        return [envio, null];

    } catch (error) {
        console.error("Error al actualizar tracking:", error);
        return [null, "Error interno al actualizar el seguimiento"];
    }
}

// Funciones auxiliares
function extractStreetNumber(address) {
    const match = address.match(/\d+/);
    return match ? match[0] : "S/N";
}

function extractSupplement(address) {
    const parts = address.split(' ');
    return parts.length > 3 ? parts.slice(3).join(' ') : "";
}

function calculatePackageWeight(productos) {
    const totalItems = productos.reduce((sum, p) => sum + p.cantidad, 0);
    return Math.max(1, Math.ceil(totalItems * 0.5));
} 