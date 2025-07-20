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

export async function getProductos() {
  try {
    const response = await axios.get("/productos/all");
    return {
      success: true,
      data: response.data.data, // Estructura consistente con el backend
    };
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || error.message || "Error al obtener productos",
    };
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

// ===== FUNCION CREAR PRODUCTO =====

export async function createProducto(productoData) {
  try {
    const formData = new FormData()
    
    for (const key in productoData) {
      if (productoData[key] !== undefined && productoData[key] !== null) {
        formData.append(key, productoData[key])
      }
    }

    const response = await axios.post("/productos/crear", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

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

    const response = await axios.put(`/productos/${id_producto}`, productoData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return { data: response.data, error: null }; // Mantener formato original
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
    return { success:true, data: response.data }
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
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post("/categorias/crear", categoriaData, { headers })
    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error al crear categoría:", error)
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || error.message || "Error al crear categoría",
    }
  }
}

export async function updateCategoria(id, categoriaData) {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.put(`/categorias/${id}`, categoriaData, { headers })
    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || error.message || "Error al actualizar categoría",
    }
  }
}

export async function deleteCategoria(id) {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.delete(`/categorias/${id}`, { headers })
    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || error.message || "Error al eliminar categoría",
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

  const data = {
    nombre: formData.nombre?.trim(),
    descripcion: formData.descripcion?.trim(),
    precio: Number.parseFloat(formData.precio),
    stock: Number.parseInt(formData.stock),
    id_categoria: Number.parseInt(id_categoria),
    estado: formData.estado || "activo", // Mantener "activo"
    image_url: formData.image_url || null,
  };

  // Añadir campos de dimensiones y peso si están presentes
  if (formData.peso !== undefined && formData.peso !== "" && formData.peso !== null) {
    data.peso = Number.parseFloat(formData.peso);
  }
  if (formData.ancho !== undefined && formData.ancho !== "" && formData.ancho !== null) {
    data.ancho = Number.parseFloat(formData.ancho);
  }
  if (formData.alto !== undefined && formData.alto !== "" && formData.alto !== null) {
    data.alto = Number.parseFloat(formData.alto);
  }
  if (formData.profundidad !== undefined && formData.profundidad !== "" && formData.profundidad !== null) {
    data.profundidad = Number.parseFloat(formData.profundidad);
  }

  return data;
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
