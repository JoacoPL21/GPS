"use strict";
import { getProductosDisponibles, getProductoById, createProducto, updateProductoStock } from "../services/productos.service.js";
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
    const {data:producto, error} = await getProductoById(id_producto);
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
/*
export async function updateProductoController(req, res) {
  const { id_producto } = req.params;
  const productoData = req.body;

  try {
    const [productoActualizado] = await updateProducto(id_producto, productoData);
    const { error } = productoUpdateValidation.validate(productoData);
    if (error) {
      return handleErrorClient(res, 404, error);
    }
    return handleSuccess(res, 200, "Producto actualizado exitosamente", productoActualizado);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor al actualizar el producto");
  }
}*/