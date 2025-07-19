import { getComprasUsuario, verificarCompraProducto, getProductosCompradosConValoracion } from "../services/compras.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

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