"use strict";
import { getProductosDisponibles, getProductoById, createProducto } from "../services/productos.service.js";
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