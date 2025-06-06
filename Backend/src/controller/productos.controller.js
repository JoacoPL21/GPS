"use strict";
import { getProductosDisponibles } from "../services/productos.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function getProductosDisponiblesController(req, res) {
  try {
    const [productos, error] = await getProductosDisponibles();
    if (error) {
      return handleErrorClient(res, 400, error);
    }
    return handleSuccess(res, 200, "Productos disponibles obtenidos exitosamente", productos);
  } catch (error) {
    console.error("Error en getProductosDisponiblesController:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al obtener productos");
  }
}