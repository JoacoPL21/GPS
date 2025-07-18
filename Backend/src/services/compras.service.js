import Compras from "../entity/compra.entity.js";
import Compra_Producto from "../entity/compra_producto.entity.js";
import { AppDataSource } from "../config/configDB.js";
import Valoraciones from "../entity/valoraciones.entity.js";

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
        
        // Usar una consulta más específica que incluya la relación con Compras
        // y filtre directamente por el usuario
        const compraProducto = await compraProductoRepository
            .createQueryBuilder("cp")
            .leftJoinAndSelect("cp.Compras", "compra")
            .where("cp.id_producto = :id_producto", { id_producto: parseInt(id_producto) })
            .andWhere("compra.id_usuario = :id_usuario", { id_usuario: parseInt(id_usuario) })
            .getOne();

        console.log(`Buscando compra para usuario ${id_usuario} y producto ${id_producto}`);
        console.log(`Resultado de la consulta:`, compraProducto);

        if (compraProducto) {
            console.log(`Usuario ${id_usuario} ha comprado el producto ${id_producto}`);
            return [true, null];
        } else {
            console.log(`Usuario ${id_usuario} NO ha comprado el producto ${id_producto}`);
            return [false, null];
        }
    } catch (error) {
        console.error("Error al verificar compra del producto:", error);
        return [null, "Error al verificar compra del producto"];
    }
} 

export async function getProductosCompradosConValoracion(id_usuario) {
    try {
        const comprasRepository = AppDataSource.getRepository(Compras);
        const compras = await comprasRepository.find({
            where: { id_usuario: parseInt(id_usuario) },
            order: { createdAt: "DESC" }
        });

        const compraProductoRepository = AppDataSource.getRepository(Compra_Producto);
        const productos = [];

        for (const compra of compras) {
            const productosCompra = await compraProductoRepository.find({
                where: { id_compra: compra.id_compra },
                relations: ["Productos"]
            });

            for (const cp of productosCompra) {
                // Buscar valoración del usuario para ese producto
                const valoracion = await AppDataSource.getRepository(Valoraciones).findOne({
                    where: {
                        id_usuario: parseInt(id_usuario),
                        id_producto: cp.id_producto
                    }
                });

                productos.push({
                    id_producto: cp.id_producto,
                    nombre_producto: cp.Productos?.nombre || 'Producto no disponible',
                    imagen_producto: cp.Productos?.imagen || null,
                    fecha_compra: compra.createdAt,
                    id_compra: compra.id_compra,
                    valoracion: valoracion
                        ? {
                            puntuacion: valoracion.puntuacion,
                            descripcion: valoracion.descripcion,
                            updatedAt: valoracion.updatedAt
                        }
                        : null
                });
            }
        }

        return [productos, null];
    } catch (error) {
        console.error("Error al obtener productos comprados con valoración:", error);
        return [null, "Error al obtener productos comprados con valoración"];
    }
} 