"use strict";
import Productos from "../entity/Productos.js";
import { AppDataSource } from "../config/configDB.js";
import Categorias from "../entity/Categoria.js";


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