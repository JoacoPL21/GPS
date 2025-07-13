"use client"

import { useState } from "react"
import { toggleProductoDestacado, handleApiError } from "../../services/productos.service.js"

// Hook personalizado para manejar el toggle de productos destacados
export const useToggleDestacado = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const toggleDestacado = async (id_producto) => {
    setLoading(true)
    setError(null)

    try {
      const response = await toggleProductoDestacado(id_producto)

      if (response.data && !response.error) {
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

  return {
    loading,
    error,
    toggleDestacado,
  }
} 