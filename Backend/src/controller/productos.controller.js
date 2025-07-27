"use strict";
import { getProductos, getProductosDisponibles, getProductoById, createProducto, updateProductoService, deleteProductoService, restoreProductoService, getProductosEliminados, getProductosDestacados, getUltimosProductos, toggleProductoDestacado, getConteoProductosDestacados, updateProductoStock } from "../services/productos.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { productoCreateValidation, productoUpdateValidation } from "../validations/productos.validation.js";
import { postImagen } from "./minio.controller.js";


export async function getProductosDisponiblesController(req, res) {
  try {
    const [productos, error] = await getProductosDisponibles();
    if (error) {
      return handleErrorClient(res, 400, error);
    }
    return handleSuccess(res, 200, "Productos disponibles obtenidos exitosamente", productos);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor al obtener productos");
  }
}

export async function getProductosController(req, res) {
  try {
    const productos = await getProductos();
    return handleSuccess(res, 200, "Productos all obtenidos exitosamente", productos); 
  }
  catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor al obtener productos");
  }
}

export async function getProductoByIdController(req, res) {
  const { id_producto } = req.params;
  try {
    const { data: producto, error } = await getProductoById(id_producto);
    if (error) {
      return handleErrorClient(res, 404, error);
    }
    return handleSuccess(res, 200, "Producto obtenido exitosamente", producto);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor al obtener el producto");
  }
}

export async function createProductoController(req, res) {
  try {
    console.log("🎯 === CREAR PRODUCTO ===");
    console.log("📥 Body recibido:", req.body);
    console.log("📁 Archivo recibido:", req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer ? "Buffer presente" : "No buffer"
    } : "Sin archivo");

    const { body, file } = req;
    let imagen_nombre = null;

    if (file) {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimeTypes.includes(file.mimetype)) {
    return handleErrorClient(res, 400, "Formato de imagen no válido (solo JPG, PNG o WEBP)");
  }

    console.log("📸 Procesando imagen con MinIO...");
    imagen_nombre = await postImagen(file.buffer, body.nombre);
    console.log("✅ Imagen subida a MinIO:", imagen_nombre);
  }
    const productoData = {
    nombre: body.nombre,
    precio: Number(body.precio),
    stock: Number(body.stock),
    descripcion: body.descripcion,
    estado: body.estado,
    id_categoria: Number(body.id_categoria),
   ...(imagen_nombre && { image_url: imagen_nombre })
  };

    console.log("💾 Datos que se guardarán en BD:", productoData);

    // Validar datos
    const { error } = productoCreateValidation.validate(productoData);
    if (error) {
      console.log("❌ Error de validación:", error.message);
      return handleErrorClient(res, 400, "Datos inválidos", error.message);
    }
    
    console.log("📊 Guardando en base de datos...");
    const [nuevoProducto, err] = await createProducto(productoData);
    if (err || !nuevoProducto) {
      console.log("❌ Error al guardar en BD:", err);
      return handleErrorClient(res, 400, "No se pudo crear el producto.");
    }
    
    console.log("✅ Producto creado exitosamente:", nuevoProducto);
    return handleSuccess(res, 201, "Producto creado exitosamente", nuevoProducto);
  } catch (error) {
    console.error("💥 Error en createProductoController:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al crear producto");
  }
}

export const updateProductoController = async (req, res) => {
  try {
    console.log("🎯 === ACTUALIZAR PRODUCTO ===");
    console.log("🆔 ID del producto:", req.params.id_producto);
    console.log("📥 Body recibido:", req.body);
    console.log("📁 Headers de Content-Type:", req.headers['content-type']);
    console.log("📋 Todas las headers:", {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
      'authorization': req.headers.authorization ? 'Bearer [TOKEN]' : 'Sin auth'
    });
    console.log("📁 Archivo recibido:", req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer ? "Buffer presente" : "No buffer"
    } : "Sin archivo");

    const { id_producto } = req.params;
    const { body, file } = req;
    let imagen_nombre = null;

    // Validar que el ID sea válido
    if (!id_producto || isNaN(id_producto)) {
      return res.status(400).json({
        message: "ID de producto inválido",
        data: null
      });
    }

    // Procesar imagen si se proporciona
    if (file) {
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Formato de imagen no válido (solo JPG, PNG o WEBP)",
          data: null
        });
      }
      console.log("📸 Procesando nueva imagen con MinIO...");
      imagen_nombre = await postImagen(file.buffer, body.nombre || `producto_${id_producto}`);
      console.log("✅ Nueva imagen subida a MinIO:", imagen_nombre);
    }

    // Construir datos del producto (solo campos que se van a actualizar)
    const productoData = {};
    
    if (body.nombre !== undefined) productoData.nombre = body.nombre;
    if (body.precio !== undefined) productoData.precio = Number(body.precio);
    if (body.stock !== undefined) productoData.stock = Number(body.stock);
    if (body.descripcion !== undefined) productoData.descripcion = body.descripcion;
    if (body.estado !== undefined) productoData.estado = body.estado;
    if (body.id_categoria !== undefined) productoData.id_categoria = Number(body.id_categoria);
    if (body.peso !== undefined) productoData.peso = Number(body.peso);
    if (body.ancho !== undefined) productoData.ancho = Number(body.ancho);
    if (body.alto !== undefined) productoData.alto = Number(body.alto);
    if (body.profundidad !== undefined) productoData.profundidad = Number(body.profundidad);
    if (imagen_nombre) productoData.image_url = imagen_nombre;

    console.log("💾 Datos que se actualizarán en BD:", productoData);

    // Validar que al menos un campo se está actualizando
    if (Object.keys(productoData).length === 0) {
      return res.status(400).json({
        message: "No se proporcionaron datos para actualizar",
        data: null
      });
    }

    // Validar datos con Joi
    const { error } = productoUpdateValidation.validate(productoData);
    if (error) {
      console.log("❌ Error de validación:", error.message);
      return res.status(400).json({
        message: "Datos inválidos",
        error: error.message,
        data: null
      });
    }

    console.log("📊 Actualizando en base de datos...");
    const resultado = await updateProductoService(id_producto, productoData);

    if (resultado.success) {
      console.log("✅ Producto actualizado exitosamente:", resultado.data);
      res.status(200).json({
        message: "Producto actualizado exitosamente",
        data: resultado.data
      });
    } else {
      console.log("❌ Error al actualizar en BD:", resultado.message);
      res.status(404).json({
        message: resultado.message || "Producto no encontrado",
        data: null
      });
    }
  } catch (error) {
    console.error("💥 Error en updateProductoController:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      data: null
    });
  }
};

// Eliminar un producto
export const deleteProductoController = async (req, res) => {
  try {
    const { id_producto } = req.params;
    
    console.log('🟠 [deleteProductoController] === ELIMINAR PRODUCTO ===');
    console.log('🟠 [deleteProductoController] ID recibido:', id_producto);
    console.log('🟠 [deleteProductoController] Tipo de ID:', typeof id_producto);
    console.log('🟠 [deleteProductoController] req.params completo:', req.params);

    // Validar que el ID sea válido
    if (!id_producto || isNaN(id_producto)) {
      console.log('🔴 [deleteProductoController] ID inválido');
      return res.status(400).json({
        message: "ID de producto inválido",
        data: null
      });
    }

    console.log('🟠 [deleteProductoController] Llamando a deleteProductoService...');
    const resultado = await deleteProductoService(id_producto);
    
    console.log('🟠 [deleteProductoController] Resultado del servicio:', resultado);

    if (resultado.success) {
      console.log('🟢 [deleteProductoController] Eliminación exitosa');
      res.status(200).json({
        message: "Producto eliminado exitosamente",
        data: { id_producto: parseInt(id_producto) }
      });
    } else {
      console.log('🔴 [deleteProductoController] Error en eliminación:', resultado.message);
      res.status(404).json({
        message: resultado.message || "Producto no encontrado",
        data: null
      });
    }
  } catch (error) {
    console.error("🔴 [deleteProductoController] Error en deleteProductoController:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      data: null
    });
  }
};

// Restaurar un producto eliminado
export const restoreProductoController = async (req, res) => {
  try {
    const { id_producto } = req.params;

    if (!id_producto || isNaN(id_producto)) {
      return res.status(400).json({
        message: "ID de producto inválido",
        data: null
      });
    }

    const resultado = await restoreProductoService(id_producto);

    if (resultado.success) {
      res.status(200).json({
        message: resultado.message,
        data: resultado.data
      });
    } else {
      res.status(404).json({
        message: resultado.message,
        data: null
      });
    }
  } catch (error) {
    console.error("Error en restoreProductoController:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      data: null
    });
  }
};

// Obtener productos eliminados
export const getProductosEliminadosController = async (req, res) => {
  try {
    const resultado = await getProductosEliminados();

    if (resultado.success) {
      res.status(200).json({
        message: resultado.message,
        data: resultado.data
      });
    } else {
      res.status(500).json({
        message: resultado.message,
        data: []
      });
    }
  } catch (error) {
    console.error("Error en getProductosEliminadosController:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      data: []
    });
  }
};

// Obtener productos destacados o últimos productos por defecto
export async function getProductosDestacadosController(req, res) {
  try {
    // Primero intentar obtener productos destacados
    const [productosDestacados, errorDestacados] = await getProductosDestacados();

    if (errorDestacados) {
      return handleErrorClient(res, 400, errorDestacados);
    }

    // Si hay productos destacados, devolverlos
    if (productosDestacados && productosDestacados.length > 0) {
      return handleSuccess(res, 200, "Productos destacados obtenidos exitosamente", productosDestacados);
    }

    // Si no hay productos destacados, devolver los últimos 4 productos
    const [ultimosProductos, errorUltimos] = await getUltimosProductos(4);

    if (errorUltimos) {
      return handleErrorClient(res, 400, errorUltimos);
    }

    return handleSuccess(res, 200, "Últimos productos obtenidos exitosamente", ultimosProductos);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor al obtener productos destacados");
  }
}

// Marcar/desmarcar producto como destacado
export async function toggleDestacadoController(req, res) {
  try {
    const { id_producto } = req.params;

    if (!id_producto || isNaN(id_producto)) {
      return handleErrorClient(res, 400, "ID de producto inválido");
    }

    const resultado = await toggleProductoDestacado(id_producto);

    if (resultado.success) {
      return handleSuccess(res, 200, resultado.message, { destacado: resultado.destacado });
    } else {
      return handleErrorClient(res, 404, resultado.message);
    }
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor al cambiar estado destacado");
  }
}

// Obtener conteo de productos destacados
export async function getConteoDestacadosController(req, res) {
  try {
    const conteo = await getConteoProductosDestacados();
    return handleSuccess(res, 200, "Conteo de productos destacados obtenido exitosamente", { conteo });
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor al obtener conteo de productos destacados");
  }
}

export async function updateProductoStockController(req, res) {
  const { id_producto } = req.params;
  const { cantidad } = req.body;

  if (typeof cantidad !== 'number' || cantidad <= 0) {
    return handleErrorClient(res, 400, "Cantidad inválida");
  }

  try {
    const [productoActualizado, error] = await updateProductoStock(id_producto, cantidad);
    if (error) {
      return handleErrorClient(res, 404, error);
    }
    return handleSuccess(res, 200, "Stock actualizado exitosamente", productoActualizado);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor al actualizar el stock");
  }
}