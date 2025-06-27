"use client"

import { useState, useEffect } from "react"
import {
  getProductosDisponibles,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
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
  const addProducto = async (productoData) => {
    setLoading(true)
    setError(null)

    try {
      const formattedData = formatProductoData(productoData)
      const response = await createProducto(formattedData)

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
  const editProducto = async (id, productoData) => {
    setLoading(true)
    setError(null)

    try {
      const formattedData = formatProductoData(productoData)
      const response = await updateProducto(id, formattedData)

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
    setLoading(true)
    setError(null)

    try {
      const response = await deleteProducto(id)

      if (response.data && !response.error) {
        await loadProductos()
        return { success: true }
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
