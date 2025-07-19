"use client"

import { useState, useEffect } from "react"
import { getConteoProductosDestacados, handleApiError } from "../../services/productos.service.js"

// Hook personalizado para obtener el conteo de productos destacados
export const useConteoDestacados = () => {
  const [conteo, setConteo] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadConteo = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getConteoProductosDestacados()

      if (response.data && !response.error) {
        setConteo(response.data.data?.conteo || 0)
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
    loadConteo()
  }, [])

  return {
    conteo,
    loading,
    error,
    loadConteo,
  }
} 