import Valoraciones from "../entity/valoraciones.entity.js";
import Productos from "../entity/productos.entity.js";
import { AppDataSource } from "../config/configDB.js";

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

// Función para verificar si el producto existe
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

// Función para crear una nueva valoración
export async function createValoracion(valoracionData) {
    try {
        const valoracionesRepository = AppDataSource.getRepository(Valoraciones);
        
        // Verificar si el producto existe
        const productoExiste = await verificarProductoExiste(valoracionData.id_producto);
        if (!productoExiste) {
            return [null, "El producto especificado no existe"];
        }
        
        // Verificar si ya existe una valoración del mismo usuario para el mismo producto
        const valoracionExistente = await valoracionesRepository.findOne({
            where: {
                id_usuario: valoracionData.id_usuario,
                id_producto: valoracionData.id_producto
            }
        });

        if (valoracionExistente) {
            return [null, "Ya has valorado este producto anteriormente"];
        }

        // Crear la nueva valoración
        const nuevaValoracion = valoracionesRepository.create({
            id_usuario: valoracionData.id_usuario,
            id_producto: valoracionData.id_producto,
            puntuacion: valoracionData.puntuacion,
            descripcion: valoracionData.descripcion
        });

        await valoracionesRepository.save(nuevaValoracion);

        // Calcular y actualizar el promedio de valoraciones del producto
        await actualizarPromedioValoraciones(valoracionData.id_producto);

        return [nuevaValoracion, null];
    } catch (error) {
        console.error("Error al crear valoración:", error);
        return [null, "Error al crear la valoración"];
    }
}

// Función para actualizar una valoración existente
export async function updateValoracion(valoracionData) {
    try {
        const valoracionesRepository = AppDataSource.getRepository(Valoraciones);
        
        // Verificar si el producto existe
        const productoExiste = await verificarProductoExiste(valoracionData.id_producto);
        if (!productoExiste) {
            return [null, "El producto especificado no existe"];
        }
        
        // Buscar la valoración existente
        const valoracionExistente = await valoracionesRepository.findOne({
            where: {
                id_usuario: valoracionData.id_usuario,
                id_producto: valoracionData.id_producto
            }
        });

        if (!valoracionExistente) {
            return [null, "No existe una valoración para actualizar"];
        }

        // Actualizar la valoración
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

        // Calcular y actualizar el promedio de valoraciones del producto
        await actualizarPromedioValoraciones(valoracionData.id_producto);

        // Obtener la valoración actualizada
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

// Función para crear o actualizar una valoración (upsert)
export async function createOrUpdateValoracion(valoracionData) {
    try {
        // Verificar si el producto existe
        const productoExiste = await verificarProductoExiste(valoracionData.id_producto);
        if (!productoExiste) {
            return [null, "El producto especificado no existe"];
        }
        
        const valoracionesRepository = AppDataSource.getRepository(Valoraciones);
        
        // Verificar si ya existe una valoración del mismo usuario para el mismo producto
        const valoracionExistente = await valoracionesRepository.findOne({
            where: {
                id_usuario: valoracionData.id_usuario,
                id_producto: valoracionData.id_producto
            }
        });

        let valoracionResultado;

        if (valoracionExistente) {
            // Actualizar valoración existente
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
            
            // Obtener la valoración actualizada
            valoracionResultado = await valoracionesRepository.findOne({
                where: {
                    id_usuario: valoracionData.id_usuario,
                    id_producto: valoracionData.id_producto
                }
            });
        } else {
            // Crear nueva valoración
            const nuevaValoracion = valoracionesRepository.create({
                id_usuario: valoracionData.id_usuario,
                id_producto: valoracionData.id_producto,
                puntuacion: valoracionData.puntuacion,
                descripcion: valoracionData.descripcion
            });

            valoracionResultado = await valoracionesRepository.save(nuevaValoracion);
        }

        // Calcular y actualizar el promedio de valoraciones del producto
        await actualizarPromedioValoraciones(valoracionData.id_producto);

        return [valoracionResultado, null];
    } catch (error) {
        console.error("Error al crear o actualizar valoración:", error);
        return [null, "Error al procesar la valoración"];
    }
}

// Función para calcular el promedio de valoraciones de un producto
export async function calcularPromedioValoraciones(id_producto) {
    try {
        const valoracionesRepository = AppDataSource.getRepository(Valoraciones);
        
        // Obtener todas las valoraciones del producto
        const valoraciones = await valoracionesRepository.find({
            where: { id_producto: parseInt(id_producto) }
        });

        if (valoraciones.length === 0) {
            return 0; // No hay valoraciones
        }

        // Calcular el promedio
        const sumaPuntuaciones = valoraciones.reduce((sum, valoracion) => sum + valoracion.puntuacion, 0);
        const promedio = Math.round(sumaPuntuaciones / valoraciones.length);

        return promedio;
    } catch (error) {
        console.error("Error al calcular promedio de valoraciones:", error);
        throw error;
    }
}

// Función para actualizar el promedio de valoraciones en el producto
export async function actualizarPromedioValoraciones(id_producto) {
    try {
        const productosRepository = AppDataSource.getRepository(Productos);
        
        // Calcular el nuevo promedio
        const nuevoPromedio = await calcularPromedioValoraciones(id_producto);
        
        // Actualizar el producto con el nuevo promedio
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