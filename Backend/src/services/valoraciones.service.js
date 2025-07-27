import Valoraciones from "../entity/valoraciones.entity.js";
import Productos from "../entity/productos.entity.js";
import Compra_Producto from "../entity/compra_producto.entity.js";
import { AppDataSource } from "../config/configDB.js";

export async function verificarCompraProducto(id_usuario, id_producto) {
    try {
        const compraProductoRepository = AppDataSource.getRepository(Compra_Producto);
        
        const compraProducto = await compraProductoRepository
            .createQueryBuilder("cp")
            .leftJoinAndSelect("cp.Compras", "compra")
            .leftJoinAndSelect("compra.Envios", "envio")
            .where("cp.id_producto = :id_producto", { id_producto: parseInt(id_producto) })
            .andWhere("compra.id_usuario = :id_usuario", { id_usuario: parseInt(id_usuario) })
            .andWhere("(compra.estado_envio = 'entregado' OR envio.estado = 'entregado' OR envio.delivered_date IS NOT NULL)")
            .getOne();

        if (compraProducto) {
            return [true, null];
        } else {
            return [false, null];
        }
    } catch (error) {
        console.error("Error al verificar compra del producto:", error);
        return [null, "Error al verificar compra del producto"];
    }
}

export async function getValoracionesPorProducto(id_producto) {
    try {
        const valoracionesRepository = AppDataSource.getRepository(Valoraciones);
        const valoraciones = await valoracionesRepository.find({
            where: { id_producto: parseInt(id_producto) },
            relations: ["Usuarios"]
        });
        return [valoraciones, null];
    } catch (error) {
        console.error("Error al obtener valoraciones del producto:", error);
        return [null, "Error al obtener valoraciones del producto"];
    }
}

export async function verificarProductoExiste(id_producto) {
    try {
        const productosRepository = AppDataSource.getRepository(Productos);
        const producto = await productosRepository.findOne({
            where: { id_producto: parseInt(id_producto) }
        });
        return producto !== null;
    } catch (error) {
        console.error("Error al verificar producto:", error);
        return false;
    }
}

export async function createValoracion(valoracionData) {
    try {
        const valoracionesRepository = AppDataSource.getRepository(Valoraciones);
        
        const productoExiste = await verificarProductoExiste(valoracionData.id_producto);
        if (!productoExiste) {
            return [null, "El producto especificado no existe"];
        }
        
        const compraProducto = await verificarCompraProducto(valoracionData.id_usuario, valoracionData.id_producto);
        if (!compraProducto[0]) {
            return [null, "No has comprado este producto o aún no ha sido entregado, por lo que no puedes valorarlo."];
        }

        const valoracionExistente = await valoracionesRepository.findOne({
            where: {
                id_usuario: valoracionData.id_usuario,
                id_producto: valoracionData.id_producto
            }
        });

        if (valoracionExistente) {
            return [null, "Ya has valorado este producto anteriormente"];
        }

        const nuevaValoracion = valoracionesRepository.create({
            id_usuario: valoracionData.id_usuario,
            id_producto: valoracionData.id_producto,
            puntuacion: valoracionData.puntuacion,
            descripcion: valoracionData.descripcion
        });

        await valoracionesRepository.save(nuevaValoracion);

        await actualizarPromedioValoraciones(valoracionData.id_producto);

        return [nuevaValoracion, null];
    } catch (error) {
        console.error("Error al crear valoración:", error);
        return [null, "Error al crear la valoración"];
    }
}

export async function updateValoracion(valoracionData) {
    try {
        const valoracionesRepository = AppDataSource.getRepository(Valoraciones);
        
        const productoExiste = await verificarProductoExiste(valoracionData.id_producto);
        if (!productoExiste) {
            return [null, "El producto especificado no existe"];
        }
        
        const compraProducto = await verificarCompraProducto(valoracionData.id_usuario, valoracionData.id_producto);
        if (!compraProducto[0]) {
            return [null, "No has comprado este producto o aún no ha sido entregado, por lo que no puedes valorarlo."];
        }
        
        const valoracionExistente = await valoracionesRepository.findOne({
            where: {
                id_usuario: valoracionData.id_usuario,
                id_producto: valoracionData.id_producto
            }
        });

        if (!valoracionExistente) {
            return [null, "No existe una valoración para actualizar"];
        }

        await valoracionesRepository.update(
            {
                id_usuario: valoracionData.id_usuario,
                id_producto: valoracionData.id_producto
            },
            {
                puntuacion: valoracionData.puntuacion,
                descripcion: valoracionData.descripcion
            }
        );

        await actualizarPromedioValoraciones(valoracionData.id_producto);

        const valoracionActualizada = await valoracionesRepository.findOne({
            where: {
                id_usuario: valoracionData.id_usuario,
                id_producto: valoracionData.id_producto
            }
        });

        return [valoracionActualizada, null];
    } catch (error) {
        console.error("Error al actualizar valoración:", error);
        return [null, "Error al actualizar la valoración"];
    }
}

export async function createOrUpdateValoracion(valoracionData) {
    try {
        const productoExiste = await verificarProductoExiste(valoracionData.id_producto);
        if (!productoExiste) {
            return [null, "El producto especificado no existe"];
        }
        
        const compraProducto = await verificarCompraProducto(valoracionData.id_usuario, valoracionData.id_producto);
        if (!compraProducto[0]) {
            return [null, "No has comprado este producto o aún no ha sido entregado, por lo que no puedes valorarlo."];
        }
        
        const valoracionesRepository = AppDataSource.getRepository(Valoraciones);
        
        const valoracionExistente = await valoracionesRepository.findOne({
            where: {
                id_usuario: valoracionData.id_usuario,
                id_producto: valoracionData.id_producto
            }
        });

        let valoracionResultado;

        if (valoracionExistente) {
            await valoracionesRepository.update(
                {
                    id_usuario: valoracionData.id_usuario,
                    id_producto: valoracionData.id_producto
                },
                {
                    puntuacion: valoracionData.puntuacion,
                    descripcion: valoracionData.descripcion
                }
            );
            
            valoracionResultado = await valoracionesRepository.findOne({
                where: {
                    id_usuario: valoracionData.id_usuario,
                    id_producto: valoracionData.id_producto
                }
            });
        } else {
            const nuevaValoracion = valoracionesRepository.create({
                id_usuario: valoracionData.id_usuario,
                id_producto: valoracionData.id_producto,
                puntuacion: valoracionData.puntuacion,
                descripcion: valoracionData.descripcion
            });

            valoracionResultado = await valoracionesRepository.save(nuevaValoracion);
        }

        await actualizarPromedioValoraciones(valoracionData.id_producto);

        return [valoracionResultado, null];
    } catch (error) {
        console.error("Error al crear o actualizar valoración:", error);
        return [null, "Error al procesar la valoración"];
    }
}

export async function calcularPromedioValoraciones(id_producto) {
    try {
        const valoracionesRepository = AppDataSource.getRepository(Valoraciones);
        
        const valoraciones = await valoracionesRepository.find({
            where: { id_producto: parseInt(id_producto) }
        });

        if (valoraciones.length === 0) {
            return 0;
        }

        const sumaPuntuaciones = valoraciones.reduce((sum, valoracion) => sum + valoracion.puntuacion, 0);
        const promedio = Math.round(sumaPuntuaciones / valoraciones.length);

        return promedio;
    } catch (error) {
        console.error("Error al calcular promedio de valoraciones:", error);
        throw error;
    }
}

export async function actualizarPromedioValoraciones(id_producto) {
    try {
        const productosRepository = AppDataSource.getRepository(Productos);
        
        const nuevoPromedio = await calcularPromedioValoraciones(id_producto);
        
        await productosRepository.update(
            { id_producto: parseInt(id_producto) },
            { prom_valoraciones: nuevoPromedio }
        );

        return nuevoPromedio;
    } catch (error) {
        console.error("Error al actualizar promedio de valoraciones:", error);
        throw error;
    }
} 