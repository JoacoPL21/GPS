"use client"

import { useState, useMemo, useEffect } from "react"
import { useCart } from "../../context/CartContext.jsx"
import { useProductos } from "../../hooks/productos/useProductos"
import CardCatalogo from "../../components/ProductoClientes/CardCatalogo.jsx"
import PageHeader from "../../components/PageHeader"
import ErrorProductos from "../../components/ProductoClientes/ErrorProductos.jsx"

const CatalogoConnected = () => {
  const { productos, loading, error } = useProductos()
  const { addItemToCart } = useCart()

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("nombre")
  const [sortOrder, setSortOrder] = useState("asc")
  // Cambiar a strings para manejar valores vacíos
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [addedToCart, setAddedToCart] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, priceRange, sortBy, sortOrder])

  const filteredAndSortedProducts = useMemo(() => {
    if (!productos) return []

    const filtered = productos.filter((producto) => {
      const matchesSearch =
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))

      // Convertir los valores de precio, usando 0 para min vacío y Infinity para max vacío
      const minPrice = priceRange.min === "" ? 0 : Number(priceRange.min)
      const maxPrice = priceRange.max === "" ? Infinity : Number(priceRange.max)

      const matchesPrice = producto.precio >= minPrice && producto.precio <= maxPrice
      return matchesSearch && matchesPrice
    })

    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      if (sortBy === "precio") {
        aValue = Number.parseFloat(aValue)
        bValue = Number.parseFloat(bValue)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [productos, searchTerm, sortBy, sortOrder, priceRange])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredAndSortedProducts.slice(start, start + itemsPerPage)
  }, [filteredAndSortedProducts, currentPage])

  const handleAddToCart = (producto) => {
    const itemToAdd = {
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria,
      stock: producto.stock,
    }
    addItemToCart(itemToAdd)
    setAddedToCart(producto.id_producto)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  const handleMinPriceChange = (e) => {
    const value = e.target.value
    // Permitir valor vacío o solo números
    if (value === "" || /^\d+$/.test(value)) {
      setPriceRange(prev => ({ ...prev, min: value }))
    }
  }

  const handleMaxPriceChange = (e) => {
    const value = e.target.value
    // Permitir valor vacío o solo números
    if (value === "" || /^\d+$/.test(value)) {
      setPriceRange(prev => ({ ...prev, max: value }))
    }
  }

  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse max-w-[300px] w-full mx-auto">
      <div className="h-64 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  )

  if (error) {
    return <ErrorProductos message={error} onRetry={() => window.location.reload()} />
  }

  return (
    <div >
      {/* Header del Catálogo */}
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", to: "/" },
          { label: "Catálogo" }
        ]}
        title="Nuestro Catálogo"
      />

      <div>
        {/* Barra de herramientas */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-gray-700">
                  {loading ? "..." : `${filteredAndSortedProducts.length} productos`}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                  />
                </svg>
                <span>Filtros</span>
              </button>

              {/* Ordenamiento */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-")
                  setSortBy(field)
                  setSortOrder(order)
                }}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="nombre-asc">Nombre A-Z</option>
                <option value="nombre-desc">Nombre Z-A</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>

          {/* Panel de Filtros */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Precio (CLP)</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Precio mínimo"
                      value={priceRange.min}
                      onChange={handleMinPriceChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="text"
                      placeholder="Precio máximo"
                      value={priceRange.max}
                      onChange={handleMaxPriceChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Deja vacío para sin límite
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setPriceRange({ min: "", max: "" })
                      setSortBy("nombre")
                      setSortOrder("asc")
                    }}
                    className="px-4 py-2 text-[#a47148] hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Productos */}
        <div className="mb-8">
          {loading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(12)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((producto) => (
                <div key={producto.id_producto} className="relative max-w-[300px] w-full mx-auto">
                  <CardCatalogo producto={producto} onAddToCart={handleAddToCart} viewMode={viewMode} />
                  {addedToCart === producto.id_producto && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce">
                      ¡Agregado!
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda"
                    : "No hay productos disponibles en este momento"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-gradient-to-r from-[#a47148] to-[#8c5d3d] hover:from-[#946746] hover:to-[#7e5137] text-white hover:scale-105 hover:shadow-lg"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Paginación */}
        {!loading && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            {Array.from({ length: Math.ceil(filteredAndSortedProducts.length / itemsPerPage) }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === page
                      ? "bg-[#a47148] text-white"
                      : "bg-white text-[#a47148] border border-[#a47148] hover:bg-orange-50"
                    }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogoConnected