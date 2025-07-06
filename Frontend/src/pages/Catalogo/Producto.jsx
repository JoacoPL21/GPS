"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import useProductosbyId from "../../hooks/productos/useProductosId"
import { useCart } from "../../context/CartContext.jsx"
import CardInfoProducto from "../../components/CardInfoProductos.jsx"

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api"

const Producto = () => {
  const { id_producto: id } = useParams()
  const { producto, loading } = useProductosbyId(id)
  const [cantidad, setCantidad] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItemToCart } = useCart()

  const handleClickAddToCart = (producto) => {
    if (!producto) return

    const item = {
      id: producto.id_producto,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
      imagen: producto.imagen,
      categoria: producto.categoria,
      stock: producto.stock,
    }

    addItemToCart(item)
    setAddedToCart(true)

    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  const aumentarCantidad = () => {
    if (producto && cantidad < producto.stock) {
      setCantidad(cantidad + 1)
    }
  }

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <nav className="text-sm text-gray-500 mb-4">
              <span>Inicio</span> <span className="mx-2">/</span>
              <span>Catálogo</span> <span className="mx-2">/</span>
              <span className="text-orange-600 font-medium">Cargando...</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 lg:h-[600px] bg-gray-200 animate-pulse"></div>
              <div className="p-8 space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-orange-500 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <nav className="text-sm text-gray-500 mb-4">
            <span>Inicio</span> <span className="mx-2">/</span>
            <span>Catálogo</span> <span className="mx-2">/</span>
            <span className="text-orange-600 font-medium">{producto.nombre}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Detalle del Producto</h1>
              <p className="text-gray-600">Artesanía única en madera</p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-gray-700">
                  {producto.stock > 0 ? `${producto.stock} disponibles` : "Sin stock"}
                </span>
              </div>

              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Volver</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative mb-8">
          {addedToCart && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-bounce z-10 shadow-lg">
              ¡Agregado al carrito!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <img
                src={`${API_URL}/uploads/${producto.imagen}`}
                alt={producto.nombre}
                className="w-full h-96 lg:h-[600px] object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {producto.categoria}
                </span>
              </div>
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">{producto.nombre}</h1>
                  <p className="text-lg text-gray-600 leading-relaxed">{producto.descripcion}</p>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">${producto.precio.toLocaleString()} CLP</div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Cantidad:</span>
                    <div className="flex items-center bg-gray-100 rounded-xl">
                      <button
                        onClick={disminuirCantidad}
                        disabled={cantidad <= 1}
                        className="p-3 hover:bg-gray-200 rounded-l-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-6 py-3 font-semibold min-w-[60px] text-center">{cantidad}</span>
                      <button
                        onClick={aumentarCantidad}
                        disabled={cantidad >= producto.stock}
                        className="p-3 hover:bg-gray-200 rounded-r-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-orange-600">
                        ${(producto.precio * cantidad).toLocaleString()} CLP
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <button
                  onClick={() => handleClickAddToCart(producto)}
                  disabled={producto.stock === 0}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
                    />
                  </svg>
                  <span>{producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <CardInfoProducto producto={producto} />
      </div>
    </div>
  )
}

export default Producto
