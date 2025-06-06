"use strict";
import Productos from "../entity/Productos.js";
import { AppDataSource } from "../config/configDB.js";
import Categorias from "../entity/Categoria.js";


//Funcion para traer productos con estado valido
export async function getProductosDisponibles() {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const productos = await productoRepository.find({
        where: { estado: "disponible",
         },
        relations: ["Categoria"]
        });
        const productosData = productos.map(producto => ({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion,
            estado: producto.estado,
            categoria: {
            categoria:Categorias.nombre
            }
        }));
        return [productosData, null];
    } catch (error) {
        console.error("Error al obtener productos disponibles:", error);
        return [null, "Error al obtener productos disponibles"];
    }
}