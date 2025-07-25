import Compras from "../entity/compra.entity.js";
import Compra_Producto from "../entity/compra_producto.entity.js";
import { AppDataSource } from "../config/configDB.js";
import Valoraciones from "../entity/valoraciones.entity.js";
import { getUrlImage } from "../services/minio.service.js";

export async function getComprasUsuario(id_usuario) {
    try {
        const comprasRepository = AppDataSource.getRepository(Compras);
        const compras = await comprasRepository.find({
            where: { id_usuario: parseInt(id_usuario) },
            order: { id_compra: "DESC" }
        });

        const comprasConProductos = await Promise.all(
            compras.map(async (compra) => {
                const compraProductoRepository = AppDataSource.getRepository(Compra_Producto);
                const productosCompra = await compraProductoRepository.find({
                    where: { id_compra: compra.id_compra },
                    relations: ["Productos"]
                });

                const productos = await Promise.all(productosCompra.map(async cp => {
                  let imagen = null;
                  if (cp.Productos?.image_url) {
                    imagen = await getUrlImage(cp.Productos.image_url);
                  }
                  return {
                    id_producto: cp.id_producto,
                    cantidad: cp.cantidad,
                    precio_unitario: cp.precio_unitario,
                    nombre_producto: cp.Productos?.nombre || 'Producto no disponible',
                    imagen,
                  };
                }));

                // Mapear campos de la compra con nuevos nombres
                return {
                    id: compra.id_compra,
                    fecha: compra.createdAt,
                    total: compra.payment_amount,
                    estado: compra.payment_status,
                    estado_envio: compra.estado_envio,
                    metodo_pago: compra.payment_type,
                    productos
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
            order: { id_compra: "DESC" }
        });

        const compraProductoRepository = AppDataSource.getRepository(Compra_Producto);
        const productosMap = new Map(); // Usar Map para evitar duplicados por id_producto

        for (const compra of compras) {
            const productosCompra = await compraProductoRepository.find({
                where: { id_compra: compra.id_compra },
                relations: ["Productos"]
            });

            for (const cp of productosCompra) {
                // Solo agregar si el producto no existe ya en el Map
                if (!productosMap.has(cp.id_producto)) {
                    // Buscar valoración del usuario para ese producto
                    const valoracion = await AppDataSource.getRepository(Valoraciones).findOne({
                        where: {
                            id_usuario: parseInt(id_usuario),
                            id_producto: cp.id_producto
                        }
                    });

                    // Obtener la URL firmada de la imagen
                    let imagen = null;
                    if (cp.Productos?.image_url) {
                      imagen = await getUrlImage(cp.Productos.image_url);
                    }

                    productosMap.set(cp.id_producto, {
                        id_producto: cp.id_producto,
                        nombre_producto: cp.Productos?.nombre || 'Producto no disponible',
                        imagen: imagen,
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
        }

        // Convertir el Map a array
        const productos = Array.from(productosMap.values());

        return [productos, null];
    } catch (error) {
        console.error("Error al obtener productos comprados con valoración:", error);
        return [null, "Error al obtener productos comprados con valoración"];
    }
} 

export async function getAllCompras() {
    try {
        const comprasRepository = AppDataSource.getRepository(Compras);
        const compraProductoRepository = AppDataSource.getRepository(Compra_Producto);
        const compras = await comprasRepository.find({
            order: { id_compra: "DESC" },
            relations: ["Usuarios"]
        });
        // Mapear la info relevante para el admin
        const comprasAdmin = await Promise.all(compras.map(async (compra) => {
            const usuario = compra.Usuarios;
            // Obtener productos de la compra
            const productosCompra = await compraProductoRepository.find({
                where: { id_compra: compra.id_compra },
                relations: ["Productos"]
            });
            const productos = productosCompra.map(cp => ({
                id_producto: cp.id_producto,
                cantidad: cp.cantidad,
                precio: cp.precio_unitario,
                nombre: cp.Productos?.nombre || 'Producto no disponible',
                imagen: cp.Productos?.image_url || null
            }));
            // Mapeo de estado para frontend
            let estado = 'pendiente';
            if (compra.estado_envio === 'entregado') {
                estado = 'entregada';
            } else if (compra.estado_envio === 'en_elaboracion' || compra.estado_envio === 'en_transito') {
                estado = 'enviada';
            }
            return {
                id_compra: compra.id_compra,
                cliente: usuario?.nombreCompleto || 'Desconocido',
                email: usuario?.email || '',
                telefono: usuario?.telefono || 'No registra',
                direccion: compra.direccion,
                fecha: compra.createdAt,
                total: compra.payment_amount,
                estado: compra.estado_envio,
                estado_pago: compra.payment_status,
                metodo_pago: compra.payment_type,
                tracking: compra.tracking || '', 
                id_pago: compra.payment_id || 'Pendiente',
                productos // <-- Agrega los productos aquí
            };
        }));
        console.log('Compras mapeadas para admin:', comprasAdmin);
        return [comprasAdmin, null];
    } catch (error) {
        console.error("Error al obtener todas las compras para admin:", error);
        return [null, "Error al obtener todas las compras para admin"];
    }
} 