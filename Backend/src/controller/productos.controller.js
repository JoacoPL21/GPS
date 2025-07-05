"use strict";
import { getProductosDisponibles, getProductoById, createProducto, updateProductoService, deleteProductoService, updateProductoStock } from "../services/productos.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { productoCreateValidation } from "../validations/productos.validation.js";

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
    const productoData = req.body;
    delete productoData.image_url;

    console.log("Datos del producto a crear controller:", productoData);

    const { error } = productoCreateValidation.validate(productoData);

    if (error) {
      return handleErrorClient(res, 400, "Datos inválidos", error.message);
    }

    const [nuevoProducto] = await createProducto(productoData);

    if (!nuevoProducto) {
      return handleErrorClient(res, 400, "No se pudo crear el producto. Verifica los datos proporcionados.");
    }
    return handleSuccess(res, 201, "Producto creado exitosamente", nuevoProducto);
  } catch (error) {

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