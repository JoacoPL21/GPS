"use client"

import { useState, useMemo } from "react"
import Swal from "sweetalert2"
import ProductoCard from "../../components/ProductoCard"
import ProductoModal from "../../components/ProductoModal"
import { useProductos } from "../../hooks/productos/useProductos"
import { useCategorias } from "../../hooks/productos/useCategorias"

function ProductosManagerConnected() {
  const {
    productos,
    loading: productosLoading,
    error: productosError,
    addProducto,
    editProducto,
    removeProducto,
  } = useProductos()

  const [productosAll, setProductosAll] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    setLoading(true);
    const response = await getProductos();
    console.log("productosAll antes de la carga:", response.data);
    if (response.success) {
      setProductosAll(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    console.log("productosAll actualizado:", productosAll)
  }, [productosAll])



  console.log("produtosAll antes del render:", productosAll)

  const { categorias, loading: categoriasLoading, addCategoria, editCategoria, removeCategoria } = useCategorias()

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    id_categoria: "",
    estado: "disponible",
  })
  const [errors, setErrors] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [categoriasSet, setCategorias] = useState([])
  const [loadingCategorias, setLoadingCategorias] = useState(false)

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    setLoadingCategorias(true)
    const response = await getCategorias()
    if (response.success) {
      setCategorias(response.data.data[0])
    }
    setLoadingCategorias(false)
  }

  const handleAddCategoria = async (data) => {
    const response = await createCategoria(data)
    if (response.success) {
      fetchCategorias()
    }
    return response
  }

  const handleEditCategoria = async (id, data) => {
    const response = await updateCategoria(id, data)
    if (response.success) {
      fetchCategorias()
    }
    return response
  }

  const handleDeleteCategoria = async (id) => {
    const response = await deleteCategoria(id)
    if (response.success) {
      fetchCategorias()
    }
    return response
  }

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
    const total = productosAll.length;
    const active = productosAll.filter((p) => p.estado === "activo").length;
    const lowStock = productosAll.filter((p) => p.stock <= 5).length;
    const totalValue = productosAll.reduce((sum, p) => sum + p.precio * p.stock, 0);

    return { total, active, lowStock, totalValue };
  }, [productosAll]);

  // Productos filtrados y ordenados
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = productos.filter((producto) => {
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
  }, [productos, searchTerm, filterCategory, filterStatus, sortBy, sortOrder])

  // Categorías únicas para el filtro
  const categories = [...new Set(productos.map((p) => p.categoria))]

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
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      id_categoria: "",
      estado: "disponible",
    })
    setModalOpen(true)
  }

  const handleEdit = (producto) => {
    if (selectionMode) return

    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      id_categoria: producto.id_categoria,
      estado: producto.estado,
    })
    setEditingId(producto.id_producto)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (selectionMode) return

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      const response = await removeProducto(id)
      if (response.success) {
        setSelectedProducts((prev) => prev.filter((selectedId) => selectedId !== id))
        Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success")
      } else {
        Swal.fire("Error", response.error || "No se pudo eliminar el producto", "error")
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return

    const result = await Swal.fire({
      title: `¿Eliminar ${selectedProducts.length} productos?`,
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar todos",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      let successCount = 0
      let errorCount = 0

      for (const id of selectedProducts) {
        const response = await removeProducto(id)
        if (response.success) {
          successCount++
        } else {
          errorCount++
        }
      }

      setSelectedProducts([])
      setSelectionMode(false)

      if (errorCount === 0) {
        Swal.fire("¡Eliminados!", `${successCount} productos han sido eliminados.`, "success")
      } else {
        Swal.fire("Parcialmente completado", `${successCount} productos eliminados, ${errorCount} errores.`, "warning")
      }
    }
  }

  const handleCardClick = (productoId) => {
    if (!selectionMode) return

    setSelectedProducts((prev) =>
      prev.includes(productoId) ? prev.filter((id) => id !== productoId) : [...prev, productoId],
    )
  }

  const isProductSelected = (productoId) => {
    return selectedProducts.includes(productoId)
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredAndSortedProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredAndSortedProducts.map((p) => p.id_producto))
    }
  }

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode)
    if (selectionMode) {
      setSelectedProducts([])
    }
  }

  const handleTableRowClick = (producto) => {
    if (selectionMode) {
      handleCardClick(producto.id_producto)
    }
  }

  const handleExport = () => {
    const csvContent = [
      ["ID", "Nombre", "Descripción", "Precio", "Stock", "Categoría", "Estado"],
      ...productos.map((p) => [p.id_producto, p.nombre, p.descripcion, p.precio, p.stock, p.categoria, p.estado]),
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)

    try {
      let response
      if (editingId) {
        response = await editProducto(editingId, form)
        if (response.success) {
          Swal.fire("¡Actualizado!", "El producto ha sido actualizado.", "success")
          await fetchProductos()
        }
      } else {
        response = await addProducto(form)
        if (response.success) {
          Swal.fire("¡Agregado!", "El producto ha sido agregado.", "success")
          await fetchProductos()
        }
      }

      if (response.success) {
        setForm({
          nombre: "",
          descripcion: "",
          precio: "",
          stock: "",
          id_categoria: "",
          estado: "disponible",
        })
        setEditingId(null)
        setModalOpen(false)
      } else {
        Swal.fire("Error", response.error || "No se pudo procesar la solicitud", "error")
      }
    } catch (error) {
      console.log("Error al procesar la solicitud:", error)
      Swal.fire("Error", "Ha ocurrido un error inesperado", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const categoriasManagement = {
    add: addCategoria,
    edit: editCategoria,
    delete: removeCategoria,
  }

  // Mostrar loading
  if (productosLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#fff8f0]">
        {/* Spinner con animación y sombra */}
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-transparent border-orange-500 shadow-lg"></div>
          {/* Ícono dentro del spinner (puedes cambiar el SVG por uno que te guste) */}
          <svg
            className="absolute h-12 w-12 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        {/* Texto con animación de opacidad pulsante */}
        <p className="mt-6 text-xl font-semibold text-orange-600 animate-pulse">
          Cargando productos...
        </p>
      </div>
    )
  }



  // Mostrar error
  if (productosError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar productos</h2>
          <p className="text-gray-600 mb-4">{productosError}</p>
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
  console.log("categoriasSet antes del render:", categoriasSet)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header del Catálogo */}
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", to: "/" },
          { label: "Administración de productos" }
        ]}
        title="Administración de productos"
        subtitle="Gestiona tu inventario de productos"
      />
      <div className="mt-4 lg:mt-0 flex items-center space-x-4 bg-[#fff8f0]">

      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 bg-[#fff8f0]">
        {/* Botones de acción */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <button
            onClick={handleAddClick}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Agregar Producto</span>
          </button>
          <button
            onClick={() => setModalCategoriaOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="
currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 0v4m0-4h4m-4 0H8"
              />
            </svg>
            <span>Agregar Categoría</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl hover:from-lime-600 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
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
        </div>
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
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-colors ${selectionMode
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
                    <option value="disponible">Disponible</option>
                    <option value="agotado">Agotado</option>
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
                key={producto.id_producto}
                onClick={() => handleCardClick(producto.id_producto)}
                className={`${selectionMode ? "cursor-pointer" : ""}`}
              >
                <ProductoCard
                  producto={producto}
                  onEditar={handleEdit}
                  onEliminar={handleDelete}
                  isSelected={isProductSelected(producto.id_producto)}
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
                      key={producto.id_producto}
                      className={`hover:bg-gray-50 transition-colors ${selectionMode ? "cursor-pointer" : ""} ${
                        isProductSelected(producto.id_producto) ? "bg-blue-50 border-l-4 border-blue-500" : ""
                      }`}
                      onClick={() => handleTableRowClick(producto)}
                    >
                      {selectionMode && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isProductSelected(producto.id_producto)}
                            onChange={() => handleCardClick(producto.id_producto)}
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
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${productosAll.estado === "activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
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
                                handleDelete(producto.id_producto)
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
          setForm({
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            categoria: "",
            estado: "disponible",
          })
          setEditingId(null)
          setErrors({})
        }}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleInputChange}
        errors={errors}
        isEditing={!!editingId}
        submitting={submitting}
        categorias={categorias}
        categoriasLoading={categoriasLoading}
        onManageCategorias={categoriasManagement}
      />
    </div>
  )
}

export default ProductosManagerConnected