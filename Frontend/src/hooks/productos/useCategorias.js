"use client"

import { useState, useEffect } from "react"
import { getCategorias, createCategoria, updateCategoria, deleteCategoria, handleApiError } from "../../services/productos.service.js"

// Hook para manejar categorías con CRUD completo
export const useCategorias = () => {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadCategorias = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getCategorias()

      if (response.data && !response.error) {
        const categoriasRaw = response.data.data || []
const categoriasPlanas = Array.isArray(categoriasRaw[0]) ? categoriasRaw[0] : categoriasRaw
setCategorias(categoriasPlanas)

      } else {
        setError(handleApiError(response.error))
      }
    } catch (err) {
      setError(handleApiError(err.message))
    } finally {
      setLoading(false)
    }
  }

  // Crear categoría
  const addCategoria = async (categoriaData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await createCategoria(categoriaData)

      if (response.data && !response.error) {
        await loadCategorias() // Recargar la lista
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

  // Actualizar categoría
  const editCategoria = async (id, categoriaData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await updateCategoria(id, categoriaData)

      if (response.data && !response.error) {
        await loadCategorias() // Recargar la lista
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

  // Eliminar categoría
  const removeCategoria = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const response = await deleteCategoria(id)

      if (response.data && !response.error) {
        await loadCategorias() // Recargar la lista
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

  useEffect(() => {
    loadCategorias()
  }, [])

  return {
    categorias,
    loading,
    error,
    loadCategorias,
    addCategoria,
    editCategoria,
    removeCategoria,
  }
}
