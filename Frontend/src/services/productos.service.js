import axios from "./root.service.js"

// ===== FUNCIONES DE PRODUCTOS EXISTENTES =====

export async function getProductosDisponibles() {
  try {
    const response = await axios.get("/productos/")
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al obtener productos disponibles:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al obtener productos disponibles",
    }
  }
}

export async function getProductosDestacados() {
  try {
    const response = await axios.get("/productos/destacados")
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al obtener productos destacados:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al obtener productos destacados",
    }
  }
}

export async function toggleProductoDestacado(id_producto) {
  try {
    const response = await axios.put(`/productos/${id_producto}/destacado`)
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al cambiar estado destacado:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al cambiar estado destacado",
    }
  }
}

export async function getProductoById(id_producto) {
  try {
    const response = await axios.get(`/productos/${id_producto}`)
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al obtener el producto:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al obtener el producto",
    }
  }
}

// ===== NUEVAS FUNCIONES QUE NECESITAS AGREGAR AL BACKEND =====

export async function createProducto(productoData) {
  try {
    const response = await axios.post("/productos/crear", productoData)
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al crear producto:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al crear producto",
    }
  }
}

export async function updateProducto(id_producto, productoData) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Formatear datos si es necesario
    const formattedData = typeof productoData === 'object' ? 
      formatProductoData(productoData) : productoData;

    const response = await axios.put(`/productos/${id_producto}`, formattedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return {
      data: null,
      error: error.response?.data?.message || error.message || "Error al actualizar producto",
    };
  }
}

export async function deleteProducto(id_producto) {
  try {
    const response = await axios.delete(`/productos/${id_producto}`)
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al eliminar producto",
    }
  }
}

// ===== FUNCIONES DE CATEGORÍAS =====

export async function getCategorias() {
  try {
    const response = await axios.get("/categorias/")
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al obtener categorías",
    }
  }
}

export async function createCategoria(categoriaData) {
  try {
    const response = await axios.post("/categorias/crear", categoriaData)
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al crear categoría:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al crear categoría",
    }
  }
}

export async function updateCategoria(id, categoriaData) {
  try {
    const response = await axios.put(`/categorias/${id}`, categoriaData)
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al actualizar categoría",
    }
  }
}

export async function deleteCategoria(id) {
  try {
    const response = await axios.delete(`/categorias/${id}`)
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al eliminar categoría",
    }
  }
}

// ===== FUNCIONES HELPER =====

export const handleApiError = (error, defaultMessage = "Ha ocurrido un error") => {
  console.error("API Error:", error)
  return error || defaultMessage
}

export const formatProductoData = (formData, categorias = []) => {
  // Buscar tanto "categoria" como "id_categoria"
  let id_categoria = formData.id_categoria || formData.categoria;

  if (isNaN(id_categoria)) {
    // Es un nombre, buscar el ID
    const categoria = categorias.find((cat) => cat.nombre === id_categoria);
    id_categoria = categoria ? categoria.id_categoria : null;
  }

  // Verificar que id_categoria sea válido antes de parseInt
  if (!id_categoria || id_categoria === null) {
    console.error('Error: id_categoria no válido:', id_categoria);
    return null; // O lanzar un error
  }

  return {
    nombre: formData.nombre?.trim(),
    descripcion: formData.descripcion?.trim(),
    precio: Number.parseFloat(formData.precio),
    stock: Number.parseInt(formData.stock),
    id_categoria: Number.parseInt(id_categoria),
    estado: formData.estado || "disponible",
    image_url: formData.image_url || null,
  };
}

export async function getConteoProductosDestacados() {
  try {
    const response = await axios.get("/productos/destacados/conteo")
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al obtener conteo de productos destacados:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al obtener conteo de productos destacados",
    }
  }
}

export async function getValoracionesPorProducto(id_producto) {
  try {
    const response = await axios.get(`/valoraciones/producto/${id_producto}`)
    return { data: response.data, error: null }
  } catch (error) {
    console.error("Error al obtener valoraciones del producto:", error)
    return {
      data: null,
      error: error.response ? error.response.data : "Error al obtener valoraciones del producto",
    }
  }
}
