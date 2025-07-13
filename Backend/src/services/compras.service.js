import Compras from "../entity/compra.entity.js";
import Compra_Producto from "../entity/compra_producto.entity.js";
import { AppDataSource } from "../config/configDB.js";

// Obtener todas las compras de un usuario con sus productos
export async function getComprasUsuario(id_usuario) {
    try {
        const comprasRepository = AppDataSource.getRepository(Compras);
        const compras = await comprasRepository.find({
            where: { id_usuario: parseInt(id_usuario) },
            relations: ["Usuarios"],
            order: { createdAt: "DESC" }
        });

        // Para cada compra, obtener los productos asociados
        const comprasConProductos = await Promise.all(
            compras.map(async (compra) => {
                const compraProductoRepository = AppDataSource.getRepository(Compra_Producto);
                const productosCompra = await compraProductoRepository.find({
                    where: { id_compra: compra.id_compra },
                    relations: ["Productos"]
                });

                return {
                    ...compra,
                    productos: productosCompra.map(cp => ({
                        id_producto: cp.id_producto,
                        cantidad: cp.cantidad,
                        precio_unitario: cp.precio_unitario,
                        nombre_producto: cp.Productos?.nombre || 'Producto no disponible',
                        imagen_producto: cp.Productos?.imagen || null
                    }))
                };
            })
        );

        return [comprasConProductos, null];
    } catch (error) {
        console.error("Error al obtener compras del usuario:", error);
        return [null, "Error al obtener compras del usuario"];
    }
}

// Verificar si un usuario ha comprado un producto específico
export async function verificarCompraProducto(id_usuario, id_producto) {
    try {
        const compraProductoRepository = AppDataSource.getRepository(Compra_Producto);
        
        // Buscar si existe una compra del usuario específico que incluya el producto
        const compraProducto = await compraProductoRepository.findOne({
            where: {
                id_producto: parseInt(id_producto)
            },
            relations: ["Compras"]
        });

        if (!compraProducto) {
            return [false, null];
        }

        // Verificar que la compra pertenece al usuario específico
        const compra = compraProducto.Compras;
        if (compra && compra.id_usuario === parseInt(id_usuario)) {
            return [true, null];
        }

        return [false, null];
    } catch (error) {
        console.error("Error al verificar compra del producto:", error);
        return [null, "Error al verificar compra del producto"];
    }
} 