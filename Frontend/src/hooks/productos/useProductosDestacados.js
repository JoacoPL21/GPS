"use client"

import { useState, useEffect } from "react"
import { getProductosDestacados, handleApiError } from "../../services/productos.service.js"

// Hook personalizado para manejar productos destacados
export const useProductosDestacados = (limit = 4) => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar productos destacados
  const loadProductosDestacados = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getProductosDestacados()

      if (response.data && !response.error) {
        const productosData = response.data.data || response.data || []
        
        // Mapear los productos al formato esperado por el componente
        const productosDestacados = productosData.map(producto => ({
          id: producto.id_producto,
          name: producto.nombre,
          price: `$${producto.precio.toLocaleString()}`,
          originalPrice: null, // Puedes agregar lógica para precios originales si los tienes
          image: producto.imagen || "default-product.jpg",
          rating: producto.prom_valoraciones || 0, // Usar prom_valoraciones del backend
          reviews: Math.floor(Math.random() * 20) + 1, // Valor por defecto para reviews
          badge: producto.destacado ? "Destacado" : null, // Usar el campo destacado del backend
        }))

        setProductos(productosDestacados)
      } else {
        setError(handleApiError(response.error))
      }
    } catch (err) {
      setError(handleApiError(err.message))
    } finally {
      setLoading(false)
    }
  }

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProductosDestacados()
  }, [limit])

  return {
    productos,
    loading,
    error,
    loadProductosDestacados,
  }
} 