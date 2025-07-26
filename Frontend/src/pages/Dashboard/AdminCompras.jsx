import React, { useState } from "react";
import { FaShoppingBag, FaClock, FaBox , FaTruck, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAdminCompras } from "../../hooks/compras/useAdminCompras";
import CompraCard from "../../components/compras/CompraCard";
import CompraDetails from "../../components/compras/CompraDetails";
import ExportButton from "../../components/compras/ExportButton";

export default function AdminCompras() {
  const {
    // State
    search,
    filter,
    currentPage,
    itemsPerPage,
    enviosData,
    processingShipment,
    modalEtiqueta,
    loading,
    error,
    filteredOrders,
    currentCompras,
    totalPages,
    startIndex,
    endIndex,
    stats,

    // Actions
    setSearch,
    setFilter,
    handlePageChange,
    handleItemsPerPageChange,
    handleProcesarEnvio,
    handleVerEtiqueta,
    handleReimprimirEtiqueta,
    handleMarcarEnTransito,
    closeModalEtiqueta,
    fetchCompras,
  } = useAdminCompras();

  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const toggleExportDropdown = () => {
    setShowExportDropdown(!showExportDropdown);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando compras...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">Error al cargar las compras: {error}</p>
            <button
              onClick={fetchCompras}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Compras</h2>
          <p className="text-gray-600">Administra todas las compras realizadas en la plataforma</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Compras</div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaClock className="h-8 w-8 text-gray-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">En preparación</div>
                <div className="text-2xl font-bold text-gray-900">{stats.en_preparacion}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaBox className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Enviadas</div>
                <div className="text-2xl font-bold text-gray-900">{stats.enviadas}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaTruck className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Entregadas</div>
                <div className="text-2xl font-bold text-gray-900">{stats.entregadas}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, email o ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            {/* Filtro por estado */}
            <div className="lg:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="todas">Todos los estados</option>
                <option value="en_transito">Enviadas</option>
                <option value="entregado">Entregadas</option>
                <option value="en_preparacion">Pendientes</option>
              </select>
            </div>
            {/* Botón exportar */}
            <ExportButton
              showDropdown={showExportDropdown}
              onToggleDropdown={toggleExportDropdown}
            />
          </div>
          {/* Selector de elementos por página */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Mostrar:</span>
              <select
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={15}>15 por página</option>
                <option value={20}>20 por página</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredOrders.length > 0 ? (
                <>
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} de {filteredOrders.length} compras
                </>
              ) : (
                'No hay compras para mostrar'
              )}
            </div>
          </div>
        </div>

        {/* Lista de compras */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <FaShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {search || filter !== 'todas' 
                ? 'No se encontraron compras con los filtros aplicados' 
                : 'No hay compras registradas'
              }
            </h3>
            <p className="text-gray-600">
              {search || filter !== 'todas'
                ? 'Intenta ajustar los filtros de búsqueda.'
                : 'Cuando se realicen compras en la plataforma, aparecerán aquí.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Compras paginadas */}
            <div className="space-y-6">
              {currentCompras.map((order) => (
                <CompraCard
                  key={order.id_compra}
                  compra={order}
                  envio={enviosData[order.id_compra]}
                  isAdmin={true}
                  onProcesarEnvio={handleProcesarEnvio}
                  onVerEtiqueta={handleVerEtiqueta}
                  onReimprimirEtiqueta={handleReimprimirEtiqueta}
                  onMarcarEnTransito={handleMarcarEnTransito}
                  processingShipment={processingShipment}
                />
              ))}
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Botón anterior */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft className="w-3 h-3 mr-1" />
                      Anterior
                    </button>
                    {/* Números de página */}
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                page === currentPage
                                  ? 'text-white bg-yellow-600 border border-yellow-600'
                                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 || 
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 py-2 text-sm text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    {/* Botón siguiente */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                      <FaChevronRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Etiqueta */}
      {modalEtiqueta.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={closeModalEtiqueta}
              title="Cerrar"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-center">Etiqueta de Envío</h3>
            <div className="mb-4 text-sm text-gray-700">
              <div><b>Orden de Transporte:</b> {modalEtiqueta.etiquetaData?.transportOrderNumber || 'N/A'}</div>
              <div><b>Referencia:</b> {modalEtiqueta.etiquetaData?.reference || 'N/A'}</div>
              <div><b>Destinatario:</b> {modalEtiqueta.etiquetaData?.recipient || 'N/A'}</div>
              <div><b>Dirección:</b> {modalEtiqueta.etiquetaData?.address || 'N/A'}</div>
              <div><b>Código de Barras:</b> {modalEtiqueta.etiquetaData?.barcode || 'N/A'}</div>
              <div><b>Tipo de archivo:</b> {modalEtiqueta.mimeType === 'application/pdf' ? 'PDF' : 'Imagen'}</div>
            </div>
            <div className="flex justify-center items-center min-h-[300px]">
              {modalEtiqueta.mimeType === 'application/pdf' ? (
                <iframe src={modalEtiqueta.url} title="Etiqueta PDF" className="w-full h-[500px] border" />
              ) : (
                <img src={modalEtiqueta.url} alt="Etiqueta de envío" className="max-w-full max-h-[500px] border" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 