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
      data: response.data.data, 
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

export async function getProductosEliminados() {
  try {
    const response = await axios.get("/productos/eliminados/all");
    return {
      success: true,
      data: response.data.data, 
    };
  } catch (error) {
    console.error("Error al obtener productos eliminados:", error);
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || error.message || "Error al obtener productos eliminados",
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

// Función helper para upload con progreso
const uploadWithProgress = async (url, formData, token, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Configurar progreso
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress?.(percentComplete);
      }
    });
    
    // Configurar respuesta
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (error) {
          reject(new Error('Error parsing response'));
        }
      } else {
        reject(new Error(`HTTP error! status: ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error'));
    
    // Configurar y enviar
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
};

export async function createProducto(productoData, onProgress) {
  try {
    console.log("🚀 Creando producto con datos:", productoData);
    
    const formData = new FormData()
    
    // Agregar datos del producto (excluyendo image_url)
    formData.append('nombre', productoData.nombre || '');
    formData.append('descripcion', productoData.descripcion || '');
    formData.append('precio', productoData.precio || '');
    formData.append('stock', productoData.stock || '');
    formData.append('id_categoria', productoData.id_categoria || '');
    formData.append('estado', productoData.estado || 'activo');
    
    // Agregar campos opcionales solo si tienen valor
    if (productoData.peso) formData.append('peso', productoData.peso);
    if (productoData.ancho) formData.append('ancho', productoData.ancho);
    if (productoData.alto) formData.append('alto', productoData.alto);
    if (productoData.profundidad) formData.append('profundidad', productoData.profundidad);
    
    // Agregar el archivo si existe
    if (productoData.imagen && productoData.imagen instanceof File) {
      console.log("📸 Agregando imagen al FormData:", {
        fileName: productoData.imagen.name,
        fileSize: productoData.imagen.size,
        fileType: productoData.imagen.type
      });
      formData.append('imagen', productoData.imagen);
    }

    console.log("📦 FormData creado para creación, enviando al backend...");

    // Debug: Mostrar todos los entries del FormData
    console.log("🔍 FormData entries (crear):");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    // Usar XMLHttpRequest para progreso o fetch nativo
    const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    
    let response;
    if (onProgress && productoData.imagen instanceof File) {
      // Usar XMLHttpRequest para mostrar progreso
      console.log("📊 Usando XMLHttpRequest con progreso");
      response = { data: await uploadWithProgress(`${API_URL}/productos/crear`, formData, token, onProgress) };
    } else {
      // Usar fetch normal
      console.log("📡 Usando fetch normal");
      const fetchResponse = await fetch(`${API_URL}/productos/crear`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!fetchResponse.ok) {
        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
      }

      response = { data: await fetchResponse.json() };
    }

    console.log("✅ Respuesta del backend (crear):", response.data);
    return { data: response.data, error: null }
  } catch (error) {
    console.error("❌ Error al crear producto:", error)
    console.error("📋 Detalles del error:", error.response?.data);
    return {
      data: null,
      error: error.response ? error.response.data : "Error al crear producto",
    }
  }
}

export async function updateProducto(id_producto, productoData, onProgress) {
  try {
    console.log("🔄 Actualizando producto ID:", id_producto, "con datos:", productoData);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Si hay una imagen, usar FormData; si no, usar JSON
    let requestData;
    let headers = {
      'Authorization': `Bearer ${token}`
    };

    if (productoData.imagen && productoData.imagen instanceof File) {
      console.log("📸 Detectada imagen en actualización:", {
        fileName: productoData.imagen.name,
        fileSize: productoData.imagen.size,
        fileType: productoData.imagen.type
      });
      
      // Crear FormData para enviar archivos
      requestData = new FormData();
      
      // Agregar datos del producto (excluyendo image_url e imagen)
      requestData.append('nombre', productoData.nombre || '');
      requestData.append('descripcion', productoData.descripcion || '');
      requestData.append('precio', productoData.precio || '');
      requestData.append('stock', productoData.stock || '');
      requestData.append('id_categoria', productoData.id_categoria || '');
      requestData.append('estado', productoData.estado || 'activo');
      
      // Agregar campos opcionales solo si tienen valor
      if (productoData.peso) requestData.append('peso', productoData.peso);
      if (productoData.ancho) requestData.append('ancho', productoData.ancho);
      if (productoData.alto) requestData.append('alto', productoData.alto);
      if (productoData.profundidad) requestData.append('profundidad', productoData.profundidad);
      
      // Agregar el archivo con el nombre correcto que espera multer
      requestData.append('imagen', productoData.imagen);
      
      console.log("📦 FormData construido para actualización con imagen");
      console.log("📋 Campos en FormData:", {
        nombre: productoData.nombre,
        hasFile: productoData.imagen instanceof File,
        fileName: productoData.imagen.name
      });
      
      // Debug: Mostrar todos los entries del FormData
      console.log("🔍 FormData entries:");
      for (let [key, value] of requestData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
      
      // No establecer Content-Type para FormData, axios lo hace automáticamente
    } else {
      console.log("📝 Sin imagen, usando JSON para actualización");
      // Usar JSON para datos sin archivos
      requestData = JSON.stringify(productoData);
      headers['Content-Type'] = 'application/json';
    }

    console.log("🚀 Enviando actualización al backend...");

    // Usar XMLHttpRequest para progreso o fetch nativo  
    const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';
    
    let response;
    if (onProgress && productoData.imagen instanceof File) {
      // Usar XMLHttpRequest para mostrar progreso
      console.log("📊 Usando XMLHttpRequest con progreso para actualización");
      
      // Helper para PUT con XMLHttpRequest
      const uploadPutWithProgress = async (url, formData, token, onProgress) => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              onProgress?.(percentComplete);
            }
          });
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch (error) {
                reject(new Error('Error parsing response'));
              }
            } else {
              reject(new Error(`HTTP error! status: ${xhr.status}`));
            }
          };
          
          xhr.onerror = () => reject(new Error('Network error'));
          
          xhr.open('PUT', url);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(formData);
        });
      };
      
      response = { data: await uploadPutWithProgress(`${API_URL}/productos/${id_producto}`, requestData, token, onProgress) };
    } else {
      // Usar fetch normal
      console.log("📡 Usando fetch normal para actualización");
      const fetchResponse = await fetch(`${API_URL}/productos/${id_producto}`, {
        method: 'PUT',
        headers: headers, // Usar las headers construidas arriba
        body: requestData
      });

      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        console.log("🔴 Error response:", errorText);
        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
      }

      response = { data: await fetchResponse.json() };
    }

    console.log("✅ Respuesta del backend (actualizar):", response.data);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    console.error("📋 Detalles del error:", error.response?.data);
    return {
      data: null,
      error: error.response?.data?.message || error.message || "Error al actualizar producto",
    };
  }
}

export async function deleteProducto(id_producto) {
  console.log('🟡 [deleteProducto] Iniciando eliminación en servicio:', id_producto)
  console.log('🟡 [deleteProducto] Tipo de ID:', typeof id_producto)
  console.log('🟡 [deleteProducto] URL que se va a llamar:', `/productos/${id_producto}`)
  
  try {
    const response = await axios.delete(`/productos/${id_producto}`)
    
    console.log('🟢 [deleteProducto] Respuesta exitosa del servidor:')
    console.log('🟢 [deleteProducto] Status:', response.status)
    console.log('🟢 [deleteProducto] Data:', response.data)
    console.log('🟢 [deleteProducto] Headers:', response.headers)
    
    return { data: response.data, error: null }
  } catch (error) {
    console.error("🔴 [deleteProducto] Error al eliminar producto:", error)
    console.log('🔴 [deleteProducto] error.response:', error.response)
    console.log('🔴 [deleteProducto] error.response?.status:', error.response?.status)
    console.log('🔴 [deleteProducto] error.response?.data:', error.response?.data)
    console.log('🔴 [deleteProducto] error.message:', error.message)
    
    // Extraer mensaje de error apropiado
    let errorMessage = "Error al eliminar producto";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.log('🔴 [deleteProducto] Mensaje de error final:', errorMessage)
    
    return {
      data: null,
      error: errorMessage, // Siempre retornar string
    }
  }
}

export async function restoreProducto(id_producto) {
  console.log('🔄 [restoreProducto] Iniciando restauración en servicio:', id_producto)
  console.log('🔄 [restoreProducto] Tipo de ID:', typeof id_producto)
  console.log('🔄 [restoreProducto] URL que se va a llamar:', `/productos/${id_producto}/restore`)
  
  try {
    const response = await axios.put(`/productos/${id_producto}/restore`)
    
    console.log('🟢 [restoreProducto] Respuesta exitosa del servidor:')
    console.log('🟢 [restoreProducto] Status:', response.status)
    console.log('🟢 [restoreProducto] Data:', response.data)
    console.log('🟢 [restoreProducto] Headers:', response.headers)
    
    return { data: response.data, error: null }
  } catch (error) {
    console.error("🔴 [restoreProducto] Error al restaurar producto:", error)
    console.log('🔴 [restoreProducto] error.response:', error.response)
    console.log('🔴 [restoreProducto] error.response?.status:', error.response?.status)
    console.log('🔴 [restoreProducto] error.response?.data:', error.response?.data)
    console.log('🔴 [restoreProducto] error.message:', error.message)
    
    // Extraer mensaje de error apropiado
    let errorMessage = "Error al restaurar producto";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.log('🔴 [restoreProducto] Mensaje de error final:', errorMessage)
    
    return {
      data: null,
      error: errorMessage, // Siempre retornar string
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
  
  // Si el error es un string, retornarlo directamente
  if (typeof error === 'string') {
    return error;
  }
  
  // Si es un objeto, extraer el mensaje
  if (error && typeof error === 'object') {
    if (error.message) {
      return error.message;
    }
    if (error.data && error.data.message) {
      return error.data.message;
    }
  }
  
  return defaultMessage;
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

  // 🖼️ IMPORTANTE: Preservar el archivo de imagen si existe
  if (formData.imagen && formData.imagen instanceof File) {
    console.log("🔄 Preservando archivo de imagen en formatProductoData:", formData.imagen.name);
    data.imagen = formData.imagen;
  }

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


