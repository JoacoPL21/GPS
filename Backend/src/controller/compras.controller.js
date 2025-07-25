import { getComprasUsuario, verificarCompraProducto, getProductosCompradosConValoracion, getAllCompras } from "../services/compras.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDB.js";

// Obtener todas las compras del usuario autenticado
export async function getComprasUsuarioController(req, res) {
    try {
        const userId = req.user.id;
        const [compras, error] = await getComprasUsuario(userId);
        
        if (error) {
            return handleErrorClient(res, 400, error);
        }
        
        return handleSuccess(res, 200, "Compras obtenidas exitosamente", compras);
    } catch (error) {
        return handleErrorServer(res, 500, "Error interno del servidor al obtener compras");
    }
}

// Verificar si el usuario ha comprado un producto específico
export async function verificarCompraProductoController(req, res) {
    try {
        const userId = req.user.id;
        const { id_producto } = req.params;
        
        const [haComprado, error] = await verificarCompraProducto(userId, id_producto);
        
        if (error) {
            return handleErrorClient(res, 400, error);
        }
        
        return handleSuccess(res, 200, "Verificación completada", { 
            success: haComprado,
            puedeValorar: haComprado 
        });
    } catch (error) {
        return handleErrorServer(res, 500, "Error interno del servidor al verificar compra");
    }
} 

export async function getProductosCompradosConValoracionController(req, res) {
    try {
        const userId = req.user.id;
        const [productos, error] = await getProductosCompradosConValoracion(userId);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return handleSuccess(res, 200, "Productos comprados obtenidos exitosamente", productos);
    } catch (error) {
        return handleErrorServer(res, 500, "Error interno del servidor al obtener productos comprados");
    }
} 

export async function getAllComprasController(req, res) {
    try {
        const [compras, error] = await getAllCompras();
        if (error) {
            return handleErrorClient(res, 400, error);
        }
        return handleSuccess(res, 200, "Compras obtenidas exitosamente", compras);
    } catch (error) {
        return handleErrorServer(res, 500, "Error interno del servidor al obtener compras");
    }
} 

export async function updateEstadoEnvioCompra(req, res) {
    try {
        const { id_compra } = req.params;
        const { estado_envio } = req.body;
        console.log('PATCH estado_envio', { id_compra, estado_envio });
        if (!id_compra || !estado_envio) {
            return handleErrorClient(res, 400, "Faltan datos para actualizar el estado de envío");
        }
        const comprasRepository = AppDataSource.getRepository('Compra');
        const compra = await comprasRepository.findOne({ where: { id_compra: parseInt(id_compra) } });
        if (!compra) {
            return handleErrorClient(res, 404, "Compra no encontrada");
        }
        compra.estado_envio = estado_envio;
        await comprasRepository.save(compra);
        return handleSuccess(res, 200, "Estado de envío actualizado", compra);
    } catch (error) {
        console.error('Error en updateEstadoEnvioCompra:', error);
        return handleErrorServer(res, 500, "Error interno al actualizar el estado de envío");
    }
} 