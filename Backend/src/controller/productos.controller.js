"use strict";
import { getProductos, getProductosDisponibles, getProductoById, createProducto, updateProductoService, deleteProductoService, getProductosDestacados, getUltimosProductos, toggleProductoDestacado, getConteoProductosDestacados, updateProductoStock } from "../services/productos.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { productoCreateValidation } from "../validations/productos.validation.js";
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
    const { body, file } = req;
    let imagen_nombre = null;

    if (file) {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimeTypes.includes(file.mimetype)) {
    return handleErrorClient(res, 400, "Formato de imagen no válido (solo JPG, PNG o WEBP)");
  }

    imagen_nombre = await postImagen(file.buffer, body.nombre);
  }
    const productoData = {
    nombre: body.nombre,
    precio: Number(body.precio),
    stock: Number(body.stock),
    descripcion: body.descripcion,
    estado: body.estado,
    id_categoria: Number(body.id_categoria),
    image_url: imagen_nombre, 
  };

    // Validar datos
    const { error } = productoCreateValidation.validate(productoData);
    if (error) {
      return handleErrorClient(res, 400, "Datos inválidos", error.message);
    }
    const [nuevoProducto, err] = await createProducto(productoData);
    if (err || !nuevoProducto) {
      return handleErrorClient(res, 400, "No se pudo crear el producto.");
    }
    return handleSuccess(res, 201, "Producto creado exitosamente", nuevoProducto);
  } catch (error) {
    console.error(error);
    return handleErrorServer(res, 500, "Error interno del servidor al crear producto");
  }
}



export const updateProductoController = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const productoData = req.body;

    // Validar que el ID sea válido
    if (!id_producto || isNaN(id_producto)) {
      return res.status(400).json({
        message: "ID de producto inválido",
        data: null
      });
    }

    // Validar datos requeridos
    const { nombre, precio, stock, id_categoria } = productoData;
    if (!nombre || precio === undefined || stock === undefined || !id_categoria) {
      return res.status(400).json({
        message: "Faltan datos requeridos: nombre, precio, stock, id_categoria",
        data: null
      });
    }

    // Validar campos numéricos opcionales (dimensiones y peso)
    const camposNumericos = ['peso', 'ancho', 'alto', 'profundidad'];
    for (const campo of camposNumericos) {
      if (productoData[campo] !== undefined && (isNaN(productoData[campo]) || productoData[campo] < 0)) {
        return res.status(400).json({
          message: `El campo ${campo} debe ser un número positivo`,
          data: null
        });
      }
    }

    const resultado = await updateProductoService(id_producto, productoData);

    if (resultado.success) {
      res.status(200).json({
        message: "Producto actualizado exitosamente",
        data: resultado.data
      });
    } else {
      res.status(404).json({
        message: resultado.message || "Producto no encontrado",
        data: null
      });
    }
  } catch (error) {
    console.error("Error en updateProductoController:", error);
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

    // Validar que el ID sea válido
    if (!id_producto || isNaN(id_producto)) {
      return res.status(400).json({
        message: "ID de producto inválido",
        data: null
      });
    }

    const resultado = await deleteProductoService(id_producto);

    if (resultado.success) {
      res.status(200).json({
        message: "Producto eliminado exitosamente",
        data: { id_producto: parseInt(id_producto) }
      });
    } else {
      res.status(404).json({
        message: resultado.message || "Producto no encontrado",
        data: null
      });
    }
  } catch (error) {
    console.error("Error en deleteProductoController:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      data: null
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