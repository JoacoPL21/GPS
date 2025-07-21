const EstadoVacio = ({ 
  mostrarEliminados, 
  searchTerm, 
  filterCategory, 
  filterStatus, 
  manejarAgregarClick 
}) => {
  return (
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
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {mostrarEliminados ? "No hay productos eliminados" : "No se encontraron productos"}
        </h3>
        <p className="text-gray-600 mb-6">
          {mostrarEliminados 
            ? (searchTerm || filterCategory || filterStatus
              ? "No hay productos eliminados que coincidan con los filtros"
              : "No hay productos eliminados en el sistema")
            : (searchTerm || filterCategory || filterStatus
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza agregando tu primer producto")
          }
        </p>
        {!mostrarEliminados && (
          <button
            onClick={manejarAgregarClick}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Agregar Producto
          </button>
        )}
      </div>
    </div>
  );
};

export default EstadoVacio;
