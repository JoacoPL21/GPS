"use strict";
import Productos from "../entity/productos.entity.js";
import { AppDataSource } from "../config/configDB.js";
import Categorias from "../entity/categoria.entity.js";



//Funcion para traer productos con estado Disponible Funcional
export async function getProductosDisponibles() {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const productos = await productoRepository.find({
            where: {
                estado: "disponible",
            },
            relations: ["categoria"]
        });


        const productosData = productos.map(producto => ({
            id_producto: producto.id_producto,
            prom_valoraciones: producto.prom_valoraciones,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion,
            estado: producto.estado,
            destacado: producto.destacado,
            imagen: producto.image_url,
            categoria: producto.categoria?.nombre
        }));
        return [productosData, null];
    } catch (error) {
        console.error("Error al obtener productos disponibles:", error);
        return [null, "Error al obtener productos disponibles"];
    }
}

//Funcion para traer UN producto por ID
export async function getProductoById(id) {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const producto = await productoRepository.findOne({
            where: { id_producto: id, estado: "disponible" },
            relations: ["categoria"]
        });

        if (!producto) {
            return { data: null, error: "Producto no encontrado" };
        }

        const productoData = {
            id: producto.id_producto,
            prom_valoraciones: producto.prom_valoraciones,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion,
            estado: producto.estado,
            destacado: producto.destacado,
            imagen: producto.image_url,
            categoria: producto.categoria?.nombre
        };

        return { data: productoData, error: null };
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return [null, "Error al obtener el producto"];
    }
}

//Funcion para crear un producto con validaciones
export async function createProducto(productoData) {

    console.log("Datos del producto a crear:", productoData);

    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const categoriaRepository = AppDataSource.getRepository(Categorias);

        // Buscar la categoría por id_categoria
        const categoria = await categoriaRepository.findOneBy({ id_categoria: productoData.id_categoria });
        if (!categoria) throw Error("Categoría no encontrada");
        const nuevoProducto = productoRepository.create({
            nombre: productoData.nombre,
            precio: productoData.precio,
            stock: productoData.stock,
            descripcion: productoData.descripcion,
            estado: productoData.estado,
            categoria: categoria,  // relacionando correctamente
        });

        
    console.log("Nuevo producto preparado para guardar:", nuevoProducto);

        await productoRepository.save(nuevoProducto);

        return [nuevoProducto, null];
    } catch (error) {
        console.error("Error al crear el producto:", error);
        return [null, "Error al crear el producto"];
    }
}


export const updateProductoService = async (id_producto, productoData) => {
    try {
        const productosRepository = AppDataSource.getRepository(Productos);

        // Verificar si el producto existe
        const productoExistente = await productosRepository.findOne({
            where: { id_producto: parseInt(id_producto) }
        });

        if (!productoExistente) {
            return {
                success: false,
                message: "Producto no encontrado",
                data: null
            };
        }

        // Actualizar los datos
        const datosActualizados = {
            ...productoExistente,
            nombre: productoData.nombre || productoExistente.nombre,
            descripcion: productoData.descripcion || productoExistente.descripcion,
            precio: productoData.precio !== undefined ? productoData.precio : productoExistente.precio,
            stock: productoData.stock !== undefined ? productoData.stock : productoExistente.stock,
            id_categoria: productoData.id_categoria || productoExistente.id_categoria,
            estado: productoData.estado || productoExistente.estado,
            image_url: productoData.image_url !== undefined ? productoData.image_url : productoExistente.image_url,
            updated_at: new Date()
        };

        // Guardar los cambios
        const productoActualizado = await productosRepository.save(datosActualizados);

        return {
            success: true,
            message: "Producto actualizado exitosamente",
            data: productoActualizado
        };

    } catch (error) {
        console.error("Error en updateProductoService:", error);
        return {
            success: false,
            message: "Error al actualizar el producto",
            data: null
        };
    }
};

// Eliminar un producto
export const deleteProductoService = async (id_producto) => {
    try {
        const productosRepository = AppDataSource.getRepository(Productos);
        const valoracionesRepository = AppDataSource.getRepository("Valoraciones");

        // Verificar si el producto existe
        const productoExistente = await productosRepository.findOne({
            where: { id_producto: parseInt(id_producto) }
        });

        if (!productoExistente) {
            return {
                success: false,
                message: "Producto no encontrado",
                data: null
            };
        }

        // Eliminar valoraciones asociadas
        await valoracionesRepository.delete({ id_producto: parseInt(id_producto) });

        // Eliminar el producto
        await productosRepository.remove(productoExistente);

        return {
            success: true,
            message: "Producto eliminado exitosamente",
            data: { id_producto: parseInt(id_producto) }
        };

    } catch (error) {
        console.error("Error en deleteProductoService:", error);
        return {
            success: false,
            message: "Error al eliminar el producto",
            data: null
        };
    }
};



//Funcion para traer productos destacados
export async function getProductosDestacados() {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const productos = await productoRepository.find({
            where: {
                estado: "disponible",
                destacado: true,
            },
            relations: ["categoria"],
            order: {
                created_at: "DESC"
            }
        });

        const productosData = productos.map(producto => ({
            id_producto: producto.id_producto,
            prom_valoraciones: producto.prom_valoraciones,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion,
            estado: producto.estado,
            destacado: producto.destacado,
            imagen: producto.image_url,
            categoria: producto.categoria?.nombre
        }));
        return [productosData, null];
    } catch (error) {
        console.error("Error al obtener productos destacados:", error);
        return [null, "Error al obtener productos destacados"];
    }
}

//Funcion para traer los últimos productos agregados (por defecto)
export async function getUltimosProductos(limit = 4) {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const productos = await productoRepository.find({
            where: {
                estado: "disponible",
            },
            relations: ["categoria"],
            order: {
                created_at: "DESC"
            },
            take: limit
        });

        const productosData = productos.map(producto => ({
            id_producto: producto.id_producto,
            prom_valoraciones: producto.prom_valoraciones,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion,
            estado: producto.estado,
            destacado: producto.destacado,
            imagen: producto.image_url,
            categoria: producto.categoria?.nombre
        }));
        return [productosData, null];
    } catch (error) {
        console.error("Error al obtener últimos productos:", error);
        return [null, "Error al obtener últimos productos"];
    }
}

//Funcion para marcar/desmarcar producto como destacado
export async function toggleProductoDestacado(id_producto) {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        
        // Verificar si el producto existe
        const producto = await productoRepository.findOne({
            where: { id_producto: parseInt(id_producto) }
        });

        if (!producto) {
            return { success: false, message: "Producto no encontrado" };
        }

        // Si vamos a marcar como destacado, verificar el límite
        if (!producto.destacado) {
            // Contar productos destacados actuales
            const productosDestacados = await productoRepository.count({
                where: { destacado: true }
            });

            if (productosDestacados >= 8) {
                return { 
                    success: false, 
                    message: "No se puede marcar más productos como destacados. Máximo 8 productos permitidos." 
                };
            }
        }

        // Cambiar el estado de destacado
        producto.destacado = !producto.destacado;
        await productoRepository.save(producto);

        return { 
            success: true, 
            message: producto.destacado ? "Producto marcado como destacado" : "Producto desmarcado como destacado",
            destacado: producto.destacado
        };
    } catch (error) {
        console.error("Error al cambiar estado destacado:", error);
        return { success: false, message: "Error al cambiar estado destacado" };
    }
}

//Funcion para obtener el conteo de productos destacados
export async function getConteoProductosDestacados() {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const conteo = await productoRepository.count({
            where: { destacado: true }
        });
        return conteo;
    } catch (error) {
        console.error("Error al obtener conteo de productos destacados:", error);
        return 0;
    }
}

export async function updateProductoStock(id, cantidad) {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const producto = await productoRepository.findOneBy({ id_producto: id });

        if (!producto) {
            return [null, "Producto no encontrado"];
        }

        if (producto.stock < cantidad) {
            return [null, "Stock insuficiente"];
        }

        producto.stock -= cantidad;
        console.log(cantidad);
        await productoRepository.save(producto);
        return [producto, null];
    } catch (error) {
        console.error("Error al actualizar el stock del producto:", error);
        return [null, "Error al actualizar el stock del producto"];
    }
}