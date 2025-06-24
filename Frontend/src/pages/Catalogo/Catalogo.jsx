"use client"
import { useState, useMemo } from "react"
import { useCart } from "../../context/CartContext.jsx"
import { useProductos } from "../../hooks/productos/useProductos"
import CardCatalogo from "../../components/CardCatalogo.jsx"

const CatalogoConnected = () => {
  const { productos, loading, error } = useProductos()
  const { addItemToCart } = useCart()

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("nombre")
  const [sortOrder, setSortOrder] = useState("asc")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 })
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [addedToCart, setAddedToCart] = useState(null)

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    if (!productos) return []

    const filtered = productos.filter((producto) => {
      const matchesSearch =
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesPrice = producto.precio >= priceRange.min && producto.precio <= priceRange.max
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

const Catalogo = () => {
  const { productosDisponibles, loading } = useProductosDispo();
  const { addItemToCart } = useCart();


  const handleAddToCart = (producto) => {
    addItemToCart(producto)
    setAddedToCart(producto.id_producto)
    console.log(`Producto ${producto.nombre} agregado al carrito`)

    // Remover el feedback después de 2 segundos
    setTimeout(() => {
      setAddedToCart(null)
    }, 2000)
  }

  // Componente de Loading Skeleton
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  )

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar productos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header del Catálogo */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-500 mb-4">
            <span>Inicio</span> <span className="mx-2">/</span>{" "}
            <span className="text-orange-600 font-medium">Catálogo</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Nuestro Catálogo</h1>
              <p className="text-gray-600">Descubre todas nuestras artesanías únicas en madera</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-gray-700">
                  {loading ? "..." : `${filteredAndSortedProducts.length} productos`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
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

              {/* Vista */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
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
                      type="number"
                      placeholder="Mín"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({ ...prev, min: Number.parseInt(e.target.value) || 0 }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Máx"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({ ...prev, max: Number.parseInt(e.target.value) || 50000 }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setPriceRange({ min: 0, max: 50000 })
                      setSortBy("nombre")
                      setSortOrder("asc")
                    }}
                    className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
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
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {filteredAndSortedProducts.map((producto) => (
                <div key={producto.id_producto} className="relative">
                  <CardCatalogo producto={producto} onAddToCart={handleAddToCart} viewMode={viewMode} />
                  {/* Feedback visual al agregar al carrito */}
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
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas del catálogo */}
        {!loading && productos && productos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">{productos.length}</div>
                <div className="text-sm text-gray-600">Total productos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{filteredAndSortedProducts.length}</div>
                <div className="text-sm text-gray-600">Mostrando</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  ${Math.min(...productos.map((p) => p.precio)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Precio mínimo</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  ${Math.max(...productos.map((p) => p.precio)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Precio máximo</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogoConnected
