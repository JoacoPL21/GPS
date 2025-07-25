"use client"

import { useState, useEffect } from "react"
import {
  getProductosDisponibles,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  restoreProducto,
  handleApiError,
  formatProductoData,
} from "../../services/productos.service.js"

// Hook personalizado para manejar productos
export const useProductos = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar productos
  const loadProductos = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getProductosDisponibles()

      if (response.data && !response.error) {
        setProductos(response.data.data || response.data || [])
      } else {
        setError(handleApiError(response.error))
      }
    } catch (err) {
      setError(handleApiError(err.message))
    } finally {
      setLoading(false)
    }
  }

  // Crear producto
  const addProducto = async (productoData, onProgress) => {
    setLoading(true)
    setError(null)

    try {
      const formattedData = formatProductoData(productoData)
      const response = await createProducto(formattedData, onProgress)
      if (response.data && !response.error) {
        await loadProductos()
        return { success: true, data: response.data }
      } else {
        const errorMsg = handleApiError(response.error)
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      const errorMsg = handleApiError(err.message)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Actualizar producto
  const editProducto = async (id, productoData, onProgress) => {
    setLoading(true)
    setError(null)

    try {
      const formattedData = formatProductoData(productoData)
      const response = await updateProducto(id, formattedData, onProgress)

      if (response.data && !response.error) {
        await loadProductos()
        return { success: true, data: response.data }
      } else {
        const errorMsg = handleApiError(response.error)
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      const errorMsg = handleApiError(err.message)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Eliminar producto
  const removeProducto = async (id) => {
    console.log('🔴 [removeProducto] Iniciando eliminación de producto:', id)
    console.log('🔴 [removeProducto] Tipo de ID:', typeof id)
    
    setLoading(true)
    setError(null)

    try {
      console.log('🔴 [removeProducto] Llamando a deleteProducto...')
      const response = await deleteProducto(id)
      
      console.log('🔴 [removeProducto] Respuesta completa:', response)
      console.log('🔴 [removeProducto] response.data:', response.data)
      console.log('🔴 [removeProducto] response.error:', response.error)
      console.log('🔴 [removeProducto] response.success:', response.success)

      if (response.data && !response.error) {
        console.log('🟢 [removeProducto] Eliminación exitosa, recargando productos...')
        // Solo recargar si la eliminación fue exitosa
        await loadProductos()
        return { success: true }
      } else {
        console.log('🔴 [removeProducto] Error en eliminación:', response.error)
        const errorMsg = handleApiError(response.error)
        setError(errorMsg)
        
        // No recargar automáticamente en caso de error
        // El componente padre decidirá si refrescar o no
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      console.log('🔴 [removeProducto] Excepción capturada:', err)
      console.log('🔴 [removeProducto] err.message:', err.message)
      console.log('🔴 [removeProducto] err.response:', err.response)
      
      const errorMsg = handleApiError(err.message)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Restaurar producto
  const restoreProductoHook = async (id) => {
    console.log('🔄 [restoreProductoHook] Iniciando restauración de producto:', id)
    console.log('🔄 [restoreProductoHook] Tipo de ID:', typeof id)
    
    setLoading(true)
    setError(null)

    try {
      console.log('🔄 [restoreProductoHook] Llamando a restoreProducto...')
      const response = await restoreProducto(id)
      
      console.log('🔄 [restoreProductoHook] Respuesta completa:', response)
      console.log('🔄 [restoreProductoHook] response.data:', response.data)
      console.log('🔄 [restoreProductoHook] response.error:', response.error)

      if (response.data && !response.error) {
        console.log('🟢 [restoreProductoHook] Restauración exitosa, recargando productos...')
        await loadProductos()
        return { success: true }
      } else {
        console.log('🔴 [restoreProductoHook] Error en restauración:', response.error)
        const errorMsg = handleApiError(response.error)
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      console.log('🔴 [restoreProductoHook] Excepción capturada:', err)
      console.log('🔴 [restoreProductoHook] err.message:', err.message)
      console.log('🔴 [restoreProductoHook] err.response:', err.response)
      
      const errorMsg = handleApiError(err.message)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProductos()
  }, [])

  return {
    productos,
    loading,
    error,
    loadProductos,
    addProducto,
    editProducto,
    removeProducto,
    restoreProductoHook,
  }
}

// Hook para obtener un producto específico
export const useProducto = (id) => {
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadProducto = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const response = await getProductoById(id)

      if (response.data && !response.error) {
        setProducto(response.data.data || response.data)
      } else {
        setError(handleApiError(response.error))
      }
    } catch (err) {
      setError(handleApiError(err.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducto()
  }, [id])

  return {
    producto,
    loading,
    error,
    loadProducto,
  }
}
