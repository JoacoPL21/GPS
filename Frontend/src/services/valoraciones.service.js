import axios from './root.service.js';

// Obtener valoraciones de un producto
export async function getValoracionesPorProducto(id_producto) {
  try {
    const response = await axios.get(`/valoraciones/producto/${id_producto}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error al obtener valoraciones del producto:", error);
    return {
      data: null,
      error: error.response ? error.response.data : "Error al obtener valoraciones del producto",
    };
  }
}



// Verificar si el usuario ha comprado un producto específico
export async function verificarCompraProducto(id_producto) {
  try {
    const response = await axios.get(`/user/compras/producto/${id_producto}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error al verificar compra del producto:", error);
    return {
      data: null,
      error: error.response?.data?.message || error.message || "Error al verificar compra",
    };
  }
}

// Crear o actualizar valoración (upsert)
export async function createOrUpdateValoracion(valoracionData) {
  try {
    const response = await axios.post('/valoraciones/crear-o-actualizar', valoracionData);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error al crear/actualizar valoración:", error);
    return {
      data: null,
      error: error.response?.data?.message || error.message || "Error al procesar valoración",
    };
  }
} 