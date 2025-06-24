"use strict";
import Productos from "../entity/Productos.js";
import { AppDataSource } from "../config/configDB.js";
import Categorias from "../entity/Categoria.js";
import { error } from "console";


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
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion,
            estado: producto.estado,
            imagen: producto.image_url,
            categoria: producto.categoria?.nombre
        }));
        return [productosData, null];
    } catch (error) {
        console.error("Error al obtener productos disponibles:", error);
        return [null, "Error al obtener productos disponibles"];
    }
}

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
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion,
            estado: producto.estado,
            imagen: producto.image_url,
            categoria: producto.categoria?.nombre
        };

        return { data: productoData, error: null };
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return [null, "Error al obtener el producto"];
    }
}

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