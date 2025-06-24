"use client"

import { useState, useMemo } from "react"
import Swal from "sweetalert2"
import ProductoCard from "../../components/ProductoCard"
import ProductoModal from "../../components/ProductoModal"

const initialProducts = [
  {
    id: 1,
    nombre: "Producto 1",
    descripcion: "Descripción 1",
    precio: 10000,
    stock: 10,
    categoria: "Artesanía",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Producto 2",
    descripcion: "Descripción 2",
    precio: 15000,
    stock: 5,
    categoria: "Juguetes",
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Producto 3",
    descripcion: "Descripción 3",
    precio: 8000,
    stock: 0,
    categoria: "Decoración",
    estado: "inactivo",
  },
  {
    id: 4,
    nombre: "Producto 4",
    descripcion: "Descripción 4",
    precio: 25000,
    stock: 15,
    categoria: "Artesanía",
    estado: "activo",
  },
]

const emptyForm = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoria: "",
  estado: "activo",
}

function ProductosManager() {
  const [products, setProducts] = useState(initialProducts)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [sortBy, setSortBy] = useState("nombre")
  const [sortOrder, setSortOrder] = useState("asc")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const total = products.length
    const active = products.filter((p) => p.estado === "activo").length
    const lowStock = products.filter((p) => p.stock <= 5).length
    const totalValue = products.reduce((sum, p) => sum + p.precio * p.stock, 0)

    return { total, active, lowStock, totalValue }
  }, [products])

  // Productos filtrados y ordenados
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((producto) => {
      const matchesSearch =
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !filterCategory || producto.categoria === filterCategory
      const matchesStatus = !filterStatus || producto.estado === filterStatus

      return matchesSearch && matchesCategory && matchesStatus
    })

    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "precio" || sortBy === "stock") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [products, searchTerm, filterCategory, filterStatus, sortBy, sortOrder])

  // Categorías únicas para el filtro
  const categories = [...new Set(products.map((p) => p.categoria))]

  const validate = () => {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
    if (form.nombre.trim().length < 3) newErrors.nombre = "Debe tener al menos 3 caracteres"
    if (form.nombre.trim().length > 50) newErrors.nombre = "No puede tener más de 50 caracteres"
    if (!form.precio) newErrors.precio = "El precio es obligatorio"
    if (isNaN(form.precio) || Number(form.precio) < 0) newErrors.precio = "Precio inválido"
    if (!form.stock) newErrors.stock = "El stock es obligatorio"
    if (isNaN(form.stock) || Number(form.stock) < 0) newErrors.stock = "Stock inválido"
    if (!form.categoria.trim()) newErrors.categoria = "La categoría es obligatoria"
    return newErrors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleAddClick = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const handleEdit = (producto) => {
    // Solo editar si no estamos en modo selección
    if (selectionMode) return

    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      estado: producto.estado,
    })
    setEditingId(producto.id)
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    // Solo eliminar si no estamos en modo selección
    if (selectionMode) return

    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        setSelectedProducts((prev) => prev.filter((selectedId) => selectedId !== id))
        Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success")
      }
    })
  }

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return

    Swal.fire({
      title: `¿Eliminar ${selectedProducts.length} productos?`,
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar todos",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p.id)))
        setSelectedProducts([])
        setSelectionMode(false)
        Swal.fire("¡Eliminados!", `${selectedProducts.length} productos han sido eliminados.`, "success")
      }
    })
  }

  // Función principal para manejar el click en las cards
  const handleCardClick = (productoId) => {
    if (!selectionMode) return

    setSelectedProducts((prev) =>
      prev.includes(productoId) ? prev.filter((id) => id !== productoId) : [...prev, productoId],
    )
  }

  // Función para verificar si un producto está seleccionado
  const isProductSelected = (productoId) => {
    return selectedProducts.includes(productoId)
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredAndSortedProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredAndSortedProducts.map((p) => p.id))
    }
  }

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode)
    if (selectionMode) {
      setSelectedProducts([]) // Limpiar selección al salir del modo
    }
  }

  // Función para manejar clicks en la tabla
  const handleTableRowClick = (producto) => {
    if (selectionMode) {
      handleCardClick(producto.id)
    }
  }

  const handleExport = () => {
    const csvContent = [
      ["ID", "Nombre", "Descripción", "Precio", "Stock", "Categoría", "Estado"],
      ...products.map((p) => [p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria, p.estado]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "productos.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, ...form, precio: Number(form.precio), stock: Number(form.stock) } : p,
        ),
      )
      Swal.fire("¡Actualizado!", "El producto ha sido actualizado.", "success")
    } else {
      setProducts((prev) => [
        { ...form, id: Date.now(), precio: Number(form.precio), stock: Number(form.stock) },
        ...prev,
      ])
      Swal.fire("¡Agregado!", "El producto ha sido agregado.", "success")
    }

    setForm(emptyForm)
    setEditingId(null)
    setModalOpen(false)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header del Dashboard */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
              <p className="text-gray-600">Gestiona tu inventario de productos</p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Exportar</span>
              </button>
              <button
                onClick={handleAddClick}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Agregar Producto</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productos Activos</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-3xl font-bold text-purple-600">${stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

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
              {/* Modo selección y acciones en lote */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleSelectionMode}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-colors ${
                    selectionMode
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{selectionMode ? "Salir de selección" : "Seleccionar"}</span>
                </button>

                {selectionMode && (
                  <>
                    <button
                      onClick={handleSelectAll}
                      className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {selectedProducts.length === filteredAndSortedProducts.length
                        ? "Deseleccionar todo"
                        : "Seleccionar todo"}
                    </button>

                    {selectedProducts.length > 0 && (
                      <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-xl">
                        <span className="text-sm text-red-700">{selectedProducts.length} seleccionados</span>
                        <button
                          onClick={handleBulkDelete}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

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
                <option value="stock-asc">Stock: Menor a Mayor</option>
                <option value="stock-desc">Stock: Mayor a Menor</option>
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
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "table" ? "bg-white shadow-sm" : "hover:bg-gray-200"
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
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setFilterCategory("")
                      setFilterStatus("")
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

        {/* Instrucciones para modo selección */}
        {selectionMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-blue-800 text-sm">
                <strong>Modo selección activado:</strong> Haz clic en las tarjetas para seleccionarlas. Los botones de
                editar y eliminar están deshabilitados.
              </p>
            </div>
          </div>
        )}

        {/* Lista de productos */}
        {viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((producto) => (
              <div
                key={producto.id}
                onClick={() => handleCardClick(producto.id)}
                className={`${selectionMode ? "cursor-pointer" : ""}`}
              >
                <ProductoCard
                  producto={producto}
                  onEditar={handleEdit}
                  onEliminar={handleDelete}
                  isSelected={isProductSelected(producto.id)}
                  selectionMode={selectionMode}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {selectionMode && (
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedProducts.length === filteredAndSortedProducts.length &&
                            filteredAndSortedProducts.length > 0
                          }
                          onChange={handleSelectAll}
                          className="w-5 h-5 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500"
                        />
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    {!selectionMode && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedProducts.map((producto) => (
                    <tr
                      key={producto.id}
                      className={`hover:bg-gray-50 transition-colors ${selectionMode ? "cursor-pointer" : ""} ${
                        isProductSelected(producto.id) ? "bg-blue-50 border-l-4 border-blue-500" : ""
                      }`}
                      onClick={() => handleTableRowClick(producto)}
                    >
                      {selectionMode && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isProductSelected(producto.id)}
                            onChange={() => handleCardClick(producto.id)}
                            className="w-5 h-5 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500"
                          />
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                          <div className="text-sm text-gray-500">{producto.descripcion}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{producto.categoria}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${producto.precio.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            producto.stock <= 5 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {producto.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            producto.estado === "activo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {producto.estado}
                        </span>
                      </td>
                      {!selectionMode && (
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(producto)
                              }}
                              className="text-orange-600 hover:text-orange-900 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(producto.id)
                              }}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredAndSortedProducts.length === 0 && (
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M7 8h10l-1 8H8L7 8z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron productos</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterCategory || filterStatus
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Comienza agregando tu primer producto"}
              </p>
              <button
                onClick={handleAddClick}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Agregar Producto
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de producto */}
      <ProductoModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setForm(emptyForm)
          setEditingId(null)
          setErrors({})
        }}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleInputChange}
        errors={errors}
        isEditing={!!editingId}
        submitting={submitting}
      />
    </div>
  )
}

export default ProductosManager
