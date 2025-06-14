import axis from "./root.service.js";

export async function getProductosDisponibles() {
  try {
    const response = await axis.get('/productos/');
    return { data: response.data, error: null }; 
  } catch (error) {
    console.error("Error al obtener productos disponibles:", error);
    return {
      data: null,
      error: error.response ? error.response.data : "Error al obtener productos disponibles",
    };
  }
}

export async function getProductoById(id_producto) {
  try {
    const response = await axis.get(`/productos/${id_producto}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return {
      data: null,
      error: error.response ? error.response.data : "Error al obtener el producto",
    };
  }
}