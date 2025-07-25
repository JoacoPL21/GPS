"use strict";
import Productos from "../entity/productos.entity.js";
import { AppDataSource } from "../config/configDB.js";
import { In } from "typeorm";
import Categorias from "../entity/categoria.entity.js";
import { getUrlImage } from "../services/minio.service.js";

//Funcion para traer productos con estado Activo
export async function getProductosDisponibles() {
  try {
    const productoRepository = AppDataSource.getRepository(Productos);
    const productos = await productoRepository.find({
      where: { estado: "activo" },
      relations: ["categoria"]
    });

    const productosData = await Promise.all(productos.map(async producto => {
      const imagenUrlFirmada = await getUrlImage(producto.image_url);

      return {
        id_producto: producto.id_producto,
        prom_valoraciones: producto.prom_valoraciones,
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock,
        descripcion: producto.descripcion,
        estado: producto.estado,
        destacado: producto.destacado,
        peso: producto.peso,
        ancho: producto.ancho,
        alto: producto.alto,
        profundidad: producto.profundidad,
        imagen: imagenUrlFirmada,
        categoria: producto.categoria?.nombre,
        id_categoria: producto.categoria?.id_categoria
      };
    }));

    return [productosData, null];
  } catch (error) {
    console.error("Error al obtener productos disponibles:", error);
    return [null, "Error al obtener productos disponibles"];
  }
}
//Funcion para traer todos los productos (excluyendo eliminados)
export async function getProductos() {
  try {
    // Filtrar productos activos e inactivos (excluir eliminados)
    const productos = await AppDataSource.getRepository(Productos).find({
      where: { 
        estado: In(["activo", "inactivo"]) // Excluir productos eliminados
      },
      relations: ["categoria"],
    });

   const productosData = await Promise.all(productos.map(async producto => {
    const imagenUrlFirmada = await getUrlImage(producto.image_url);
    return {
      id_producto: producto.id_producto,
      prom_valoraciones: producto.prom_valoraciones,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      descripcion: producto.descripcion,
      estado: producto.estado,
      destacado: producto.destacado,
      peso: producto.peso,
      ancho: producto.ancho,
      alto: producto.alto,
      profundidad: producto.profundidad,
      imagen: imagenUrlFirmada,
      categoria: producto.categoria?.nombre,
      id_categoria: producto.categoria?.id_categoria
    };
    }));

    return productosData;
  } catch (error) {
    throw new Error("Error al obtener productos");
  }
}

//Funcion para traer UN producto por ID
export async function getProductoById(id) {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const producto = await productoRepository.findOne({
            where: { id_producto: id, estado: "activo" },
            relations: ["categoria"]
        });

        if (!producto) {
            return { data: null, error: "Producto no encontrado" };
        }
        const imagenUrlFirmada = await getUrlImage(producto.image_url);
        const productoData = {
            id: producto.id_producto,
            prom_valoraciones: producto.prom_valoraciones,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion,
            estado: producto.estado,
            destacado: producto.destacado,
            peso: producto.peso,
            ancho: producto.ancho,
            alto: producto.alto,
            profundidad: producto.profundidad,
            imagen: imagenUrlFirmada,
            categoria: producto.categoria?.nombre,
            id_categoria: producto.categoria?.id_categoria
        };

        return { data: productoData, error: null };
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return [null, "Error al obtener el producto"];
    }
}

//Funcion para crear un producto con validaciones
export async function createProducto(productoData) {
    try {
        console.log("💽 === SERVICIO: CREAR PRODUCTO ===");
        const productoRepository = AppDataSource.getRepository(Productos);
        const categoriaRepository = AppDataSource.getRepository(Categorias);

        // Buscar la categoría por id_categoria
        const categoria = await categoriaRepository.findOneBy({ id_categoria: productoData.id_categoria });
        if (!categoria) {
            throw Error("Categoría no encontrada");
        }
        
        const nuevoProducto = productoRepository.create({
            nombre: productoData.nombre,
            precio: productoData.precio,
            stock: productoData.stock,
            descripcion: productoData.descripcion,
            estado: productoData.estado,
            image_url: productoData.image_url,
            peso: productoData.peso,
            ancho: productoData.ancho,
            alto: productoData.alto,
            profundidad: productoData.profundidad,
            categoria: categoria,  // relacionando correctamente
        });

        await productoRepository.save(nuevoProducto);

        return [nuevoProducto, null];
    } catch (error) {
        return [null, "Error al crear el producto"];
    }
}


export const updateProductoService = async (id_producto, productoData) => {
    try {
        console.log("💽 === SERVICIO: ACTUALIZAR PRODUCTO ===");
        console.log("🆔 ID a actualizar:", id_producto);
        console.log("📊 Datos para actualizar:", productoData);
        
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
            peso: productoData.peso !== undefined ? productoData.peso : productoExistente.peso,
            ancho: productoData.ancho !== undefined ? productoData.ancho : productoExistente.ancho,
            alto: productoData.alto !== undefined ? productoData.alto : productoExistente.alto,
            profundidad: productoData.profundidad !== undefined ? productoData.profundidad : productoExistente.profundidad,
            image_url: productoData.image_url !== undefined ? productoData.image_url : productoExistente.image_url,
            updated_at: new Date()
        };

        console.log("📝 Datos finales a guardar:", {
            id: datosActualizados.id_producto,
            nombre: datosActualizados.nombre,
            image_url: datosActualizados.image_url,
            peso: datosActualizados.peso,
            dimensiones: {
                ancho: datosActualizados.ancho,
                alto: datosActualizados.alto,
                profundidad: datosActualizados.profundidad
            }
        });

        // Guardar los cambios
        const productoActualizado = await productosRepository.save(datosActualizados);

        return {
            success: true,
            message: "Producto actualizado exitosamente",
            data: productoActualizado
        };

    } catch (error) {
        return {
            success: false,
            message: "Error al actualizar el producto",
            data: null
        };
    }
};

// Eliminar un producto (eliminación lógica)
export const deleteProductoService = async (id_producto) => {
    try {
        console.log('🟣 [deleteProductoService] === ELIMINAR PRODUCTO SERVICIO (LÓGICO) ===');
        console.log('🟣 [deleteProductoService] ID recibido:', id_producto);
        console.log('🟣 [deleteProductoService] Tipo de ID:', typeof id_producto);
        console.log('🟣 [deleteProductoService] ID parseado:', parseInt(id_producto));
        
        const productosRepository = AppDataSource.getRepository(Productos);

        // Verificar si el producto existe
        console.log('🟣 [deleteProductoService] Buscando producto en BD...');
        const productoExistente = await productosRepository.findOne({
            where: { id_producto: parseInt(id_producto) }
        });

        console.log('🟣 [deleteProductoService] Producto encontrado:', productoExistente);

        if (!productoExistente) {
            console.log('� [deleteProductoService] Producto no encontrado');
            return {
                success: false,
                message: "Producto no encontrado",
                data: null
            };
        }

        // Verificar si ya está eliminado lógicamente
        if (productoExistente.estado === "eliminado") {
            console.log('� [deleteProductoService] Producto ya estaba eliminado');
            return {
                success: false,
                message: "El producto ya había sido eliminado",
                data: null
            };
        }

        // ELIMINACIÓN LÓGICA: Cambiar estado a "eliminado" en lugar de eliminar físicamente
        console.log('🟣 [deleteProductoService] Realizando eliminación lógica...');
        console.log('🟣 [deleteProductoService] Estado anterior:', productoExistente.estado);
        
        productoExistente.estado = "eliminado";
        productoExistente.updated_at = new Date();
        
        await productosRepository.save(productoExistente);
        
        console.log('🟢 [deleteProductoService] Eliminación lógica completada exitosamente');
        console.log('� [deleteProductoService] Estado nuevo:', productoExistente.estado);

        return {
            success: true,
            message: "Producto eliminado exitosamente",
            data: { 
                id_producto: parseInt(id_producto),
                estado_anterior: "activo",
                estado_nuevo: "eliminado",
                eliminado_en: productoExistente.updated_at
            }
        };

    } catch (error) {
        console.error("🔴 [deleteProductoService] Error en deleteProductoService:", error);
        return {
            success: false,
            message: "Error al eliminar el producto",
            data: null
        };
    }
};

// Restaurar un producto eliminado lógicamente
export const restoreProductoService = async (id_producto) => {
    try {
        console.log('🔄 [restoreProductoService] === RESTAURAR PRODUCTO ===');
        console.log('🔄 [restoreProductoService] ID recibido:', id_producto);
        
        const productosRepository = AppDataSource.getRepository(Productos);

        // Buscar el producto eliminado
        const productoEliminado = await productosRepository.findOne({
            where: { 
                id_producto: parseInt(id_producto),
                estado: "eliminado" 
            }
        });

        if (!productoEliminado) {
            return {
                success: false,
                message: "Producto eliminado no encontrado",
                data: null
            };
        }

        // Restaurar el producto como inactivo para revisión del admin
        productoEliminado.estado = "inactivo";
        productoEliminado.updated_at = new Date();
        
        await productosRepository.save(productoEliminado);
        
        console.log('🟢 [restoreProductoService] Producto restaurado como inactivo para revisión');

        return {
            success: true,
            message: "Producto restaurado como inactivo para revisión",
            data: { 
                id_producto: parseInt(id_producto),
                estado_anterior: "eliminado",
                estado_nuevo: "inactivo",
                restaurado_en: productoEliminado.updated_at
            }
        };

    } catch (error) {
        console.error("🔴 [restoreProductoService] Error:", error);
        return {
            success: false,
            message: "Error al restaurar el producto",
            data: null
        };
    }
};

// Obtener productos eliminados (para panel de administración)
export const getProductosEliminados = async () => {
    try {
        const productosRepository = AppDataSource.getRepository(Productos);
        const productosEliminados = await productosRepository.find({
            where: { estado: "eliminado" },
            relations: ["categoria"],
            order: { updated_at: "DESC" }
        });

        const productosData = await Promise.all(productosEliminados.map(async producto => {
            const imagenUrlFirmada = await getUrlImage(producto.image_url);
            return {
                id_producto: producto.id_producto,
                prom_valoraciones: producto.prom_valoraciones,
                nombre: producto.nombre,
                precio: producto.precio,
                stock: producto.stock,
                descripcion: producto.descripcion,
                estado: producto.estado,
                destacado: producto.destacado,
                peso: producto.peso,
                ancho: producto.ancho,
                alto: producto.alto,
                profundidad: producto.profundidad,
                imagen: imagenUrlFirmada,
                categoria: producto.categoria?.nombre,
                id_categoria: producto.categoria?.id_categoria,
                eliminado_en: producto.updated_at
            };
        }));

        return {
            success: true,
            data: productosData,
            message: `${productosData.length} productos eliminados encontrados`
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Error al obtener productos eliminados"
        };
    }
};

//Funcion para traer productos destacados
export async function getProductosDestacados() {
    try {
        const productoRepository = AppDataSource.getRepository(Productos);
        const productos = await productoRepository.find({
            where: {
                estado: "activo",
                destacado: true,
            },
            relations: ["categoria"],
            order: {
                created_at: "DESC"
            }
        });

        const productosData = await Promise.all(productos.map(async producto => {
        const imagenUrlFirmada = await getUrlImage(producto.image_url);

        return {
            id_producto: producto.id_producto,
            prom_valoraciones: producto.prom_valoraciones,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion,
            estado: producto.estado,
            destacado: producto.destacado,
            peso: producto.peso,
            ancho: producto.ancho,
            alto: producto.alto,
            profundidad: producto.profundidad,
            imagen:imagenUrlFirmada,
            categoria: producto.categoria?.nombre,
            id_categoria: producto.categoria?.id_categoria
        }
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
                estado: "activo",
            },
            relations: ["categoria"],
            order: {
                created_at: "DESC"
            },
            take: limit
        });
        const productosData = await Promise.all(productos.map(async producto => {
        const imagenUrlFirmada = await getUrlImage(producto.image_url);
        return {
            id_producto: producto.id_producto,
            prom_valoraciones: producto.prom_valoraciones,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion,
            estado: producto.estado,
            destacado: producto.destacado,
            peso: producto.peso,
            ancho: producto.ancho,
            alto: producto.alto,
            profundidad: producto.profundidad,
            imagen: imagenUrlFirmada,
            categoria: producto.categoria?.nombre,
            id_categoria: producto.categoria?.id_categoria
        };
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
        await productoRepository.save(producto);
        return [producto, null];
    } catch (error) {
        console.error("Error al actualizar el stock del producto:", error);
        return [null, "Error al actualizar el stock del producto"];
    }
}