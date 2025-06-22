"use strict";
import Productos from "../entity/productos.entity.js";
import { AppDataSource } from "../config/configDB.js";
import Categorias from "../entity/categoria.entity.js";



//Funcion para traer productos con estado Disponible Funcional
export async function getProductosDisponibles() {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const productos = await productoRepository.find({
        where: { estado: "disponible", 
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
            categoria:producto.categoria?.nombre
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
            return {data:null, error: "Producto no encontrado"};
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

        return { data: productoData,error: null };
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return [null, "Error al obtener el producto"];
    }
}

//Funcion para crear un producto con validaciones
export async function createProducto(productoData) {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const categoriaRepository = AppDataSource.getRepository(Categorias);
    
        const categoria = await categoriaRepository.findOneBy({ id_categoria: productoData.id_categoria});
        if (!categoria) {
            return [null, "Categoría no encontrada"];
        }
          
        const nuevoProducto = productoRepository.create({
            ...productoData,
            Categoria: categoria
        });

        await productoRepository.save(nuevoProducto);
        return [nuevoProducto, null];
    } catch (error) {
        console.error("Error al crear el producto:", error);
        return [null, "Error al crear el producto"];
    }
}

//Funcion para actualizar un producto de STOCK con validaciones
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

//Funcion para editar un producto Para ADMIN
/*
export async function updateProducto(id, productoData) {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const producto = await productoRepository.findOneBy({ id_producto: id });

        if (!producto) {
            return [null, "Producto no encontrado"];
        }

        // Actualizar los campos del producto
        Object.assign(producto, productoData);

        await productoRepository.save(producto);
        return [producto, null];
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        return [null, "Error al actualizar el producto"];
    }
}
*/