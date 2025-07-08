import { getValoracionesPorProducto } from "../services/valoraciones.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function getValoracionesPorProductoController(req, res) {
  const { id_producto } = req.params;
  try {
    const [valoraciones, error] = await getValoracionesPorProducto(id_producto);
    if (error) {
      return handleErrorClient(res, 400, error);
    }
    return handleSuccess(res, 200, "Valoraciones obtenidas exitosamente", valoraciones);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor al obtener valoraciones");
  }
} 