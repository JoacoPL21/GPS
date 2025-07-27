"use client"

const ProductoCard = ({ 
  producto, 
  onEditar, 
  onEliminar, 
  onRestaurar,
  isSelected = false, 
  selectionMode = false, 
  showDeleted = false 
}) => {
  const getStockStatus = (stock) => {
    if (stock === 0) return { color: "bg-red-100 text-red-800", text: "Sin stock" }
    if (stock <= 5) return { color: "bg-yellow-100 text-yellow-800", text: "Stock bajo" }
    return { color: "bg-green-100 text-green-800", text: "En stock" }
  }

  const getEstadoStatus = (estado) => {
    return estado === "activo"
      ? { color: "bg-green-100 text-green-800", text: "Activo" }
      : { color: "bg-gray-100 text-gray-800", text: "Inactivo" }
  }

  const getCategoryColor = (categoria) => {
    const colors = {
      Artesanía: "bg-blue-100 text-blue-800",
      Juguetes: "bg-purple-100 text-purple-800",
      Decoración: "bg-pink-100 text-pink-800",
      Muebles: "bg-indigo-100 text-indigo-800",
      Accesorios: "bg-teal-100 text-teal-800",
    }
    return colors[categoria] || "bg-gray-100 text-gray-800"
  }

  const stockStatus = getStockStatus(producto.stock)
  const estadoStatus = getEstadoStatus(producto.estado)
  const categoryColor = getCategoryColor(producto.categoria)

  const handleEditClick = (e) => {
    e.stopPropagation() // Evitar que se active la selección
    if (!selectionMode) {
      onEditar(producto)
    }
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation() // Evitar que se active la selección
    if (!selectionMode) {
      onEliminar(producto.id_producto)
    }
  }

  const handleRestoreClick = (e) => {
    e.stopPropagation() // Evitar que se active la selección
    if (!selectionMode && onRestaurar) {
      onRestaurar(producto.id_producto)
    }
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative ${
        isSelected ? "ring-4 ring-blue-500 ring-opacity-50 bg-blue-50 transform scale-105" : "hover:scale-105"
      }`}
    >
      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-blue-500 text-white rounded-full p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Header con imagen placeholder */}
      <div
        className={`relative h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center ${
          isSelected ? "from-blue-100 to-blue-200" : ""
        }`}
      >
        <img
          src={producto.imagen|| "/placeholder.png"}
          alt={producto.nombre}
          className="object-cover w-full h-full"
        />

        {/* Badge de estado en la esquina superior derecha */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoStatus.color}`}>
            {estadoStatus.text}
          </span>
        </div>

        {/* Badge de stock bajo si aplica */}
        {producto.stock <= 5 && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              ¡Stock bajo!
            </span>
          </div>
        )}

        {/* Overlay de selección */}
        {selectionMode && (
          <div
            className={`absolute inset-0 z-20 transition-all duration-300 ${
              isSelected ? "bg-blue-500 bg-opacity-30" : "bg-black bg-opacity-0 group-hover:bg-opacity-20"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? "border-blue-500 bg-blue-500 text-white shadow-lg"
                    : "border-white bg-white bg-opacity-90 text-gray-600 group-hover:border-blue-300"
                }`}
              >
                {isSelected ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6">
        {/* Título y categoría */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3
              className={`text-xl font-bold transition-colors ${
                isSelected ? "text-blue-600" : "text-gray-800 group-hover:text-orange-600"
              }`}
            >
              {producto.nombre}
            </h3>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryColor}`}>
              {producto.categoria}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{producto.descripcion}</p>
        </div>

        {/* Información del producto */}
        <div className="space-y-3 mb-6">
          {/* Precio */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Precio:</span>
            <span className={`text-2xl font-bold ${isSelected ? "text-blue-600" : "text-orange-600"}`}>
              ${producto.precio.toLocaleString()}
            </span>
          </div>

          {/* Stock */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Stock:</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-800">{producto.stock}</span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
            </div>
          </div>
        </div>



        {/* Botones de acción - Solo mostrar si no está en modo selección */}
        {!selectionMode && (
          <div className="flex space-x-3">
            {showDeleted ? (
              // Botón de restaurar para productos eliminados
              <button
                onClick={handleRestoreClick}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Restaurar</span>
              </button>
            ) : (
              // Botones normales para productos activos
              <>
                <button
                  onClick={handleEditClick}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Editar</span>
                </button>

                <button
                  onClick={handleDeleteClick}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Eliminar</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Información adicional en hover - Solo si no está seleccionado */}
        {!isSelected && (
          <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Valor total: ${(producto.precio * producto.stock).toLocaleString()}</span>
              <span>Última actualización: Hoy</span>
            </div>
          </div>
        )}
      </div>

      {/* Indicador de hover en el borde - Solo si no está en modo selección */}
      {!selectionMode && (
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-200 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
      )}
    </div>
  )
}

export default ProductoCard
