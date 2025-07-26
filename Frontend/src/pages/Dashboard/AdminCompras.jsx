import React, { useState } from "react";
import { FaShoppingBag, FaClock, FaBox, FaTruck, FaSearch, FaChevronLeft, FaChevronRight, FaUser, FaCreditCard, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendar, FaDollarSign, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaEye, FaPrint, FaBarcode } from "react-icons/fa";
import { useAdminCompras } from "../../hooks/compras/useAdminCompras";
import CompraCard from "../../components/compras/CompraCard";
import ExportButton from "../../components/compras/ExportButton";

export default function AdminCompras() {
  const {
    search,
    filter,
    currentPage,
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
    setSearch,
    setFilter,
    handlePageChange,
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "pagado":
        return <FaCheckCircle className="h-4 w-4 text-emerald-600" />;
      case "pending":
      case "pendiente":
        return <FaClock className="h-4 w-4 text-amber-600" />;
      case "rejected":
      case "cancelado":
        return <FaTimesCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FaExclamationTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getShippingStatusIcon = (status, estadoPago) => {
    if (estadoPago === 'pending') {
      return <FaClock className="h-4 w-4 text-gray-600" />;
    }
    
    switch (status?.toLowerCase()) {
      case "entregado":
        return <FaCheckCircle className="h-4 w-4 text-emerald-600" />;
      case "en_transito":
      case "en tránsito":
        return <FaTruck className="h-4 w-4 text-slate-600" />;
      case "en_preparacion":
      case "preparando":
        return <FaBox className="h-4 w-4 text-amber-600" />;
      case "cancelado":
        return <FaTimesCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FaExclamationTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "pagado":
        return "bg-emerald-600 text-white";
      case "pending":
      case "pendiente":
        return "bg-amber-600 text-white";
      case "rejected":
      case "cancelado":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getShippingStatusColor = (status, estadoPago) => {
    if (estadoPago === 'pending') {
      return "bg-gray-100 text-gray-800 border-gray-300";
    }
    
    switch (status?.toLowerCase()) {
      case "entregado":
        return "bg-emerald-600 text-white";
      case "en_transito":
      case "en tránsito":
        return "bg-slate-600 text-white";
      case "en_preparacion":
      case "preparando":
        return "bg-amber-600 text-white";
      case "cancelado":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getShippingStatusText = (status, estadoPago) => {
    if (estadoPago === 'pending') {
      return 'Esperando Pago';
    }
    
    switch (status?.toLowerCase()) {
      case "en_preparacion":
        return 'En preparación';
      case "en_transito":
        return 'En tránsito';
      case "entregado":
        return 'Entregado';
      default:
        return 'Pendiente';
    }
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-stone-50 to-slate-50">
        <div className="flex items-center justify-center min-h-screen">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-stone-50 to-slate-50">
        <div className="container mx-auto px-6 py-8">
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
    <div className="min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Compras</h2>
        <p className="text-gray-600">Administra todas las compras realizadas en la plataforma</p>
      </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, email o ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
            className="lg:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="todas">Todas las compras</option>
                <option value="en_transito">Enviadas</option>
                <option value="entregado">Entregadas</option>
                <option value="en_preparacion">Pendientes</option>
              </select>
          <ExportButton
            showDropdown={showExportDropdown}
            onToggleDropdown={toggleExportDropdown}
          />
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <div className="bg-gradient-to-br from-slate-600 to-slate-700 text-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200 text-sm font-medium">Total Compras</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <FaShoppingBag className="h-8 w-8 text-slate-300" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">En Tránsito</p>
                <p className="text-3xl font-bold">{stats.enviadas}</p>
              </div>
              <FaTruck className="h-8 w-8 text-amber-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Entregadas</p>
                <p className="text-3xl font-bold">{stats.entregadas}</p>
              </div>
              <FaCheckCircle className="h-8 w-8 text-emerald-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-stone-600 to-stone-700 text-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-200 text-sm font-medium">En Preparación</p>
                <p className="text-3xl font-bold">{stats.en_preparacion}</p>
              </div>
              <FaBox className="h-8 w-8 text-stone-300" />
            </div>
          </div>
        </div>

            <div className="space-y-6">
          {currentCompras.map((order) => {
            const envio = enviosData[order.id_compra];
            
            return (
              <div
                key={order.id_compra}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm rounded-lg"
              >
                <div className="bg-gradient-to-r from-gray-50 to-stone-50 pb-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-full flex items-center justify-center text-white font-bold">
                        {String(order.id_compra).slice(-2)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Compra #{order.id_compra}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FaCalendar className="h-4 w-4" />
                          {new Date(order.fecha).toLocaleDateString('es-CL')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.estado === 'en_preparacion' && order.estado_pago !== 'pending' && !envio?.transport_order_number && (
                        <button
                          onClick={() => handleProcesarEnvio(order)}
                          disabled={processingShipment === order.id_compra}
                          className="flex items-center px-3 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingShipment === order.id_compra ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                              Procesando...
                            </>
                          ) : (
                            <>
                              <FaTruck className="w-3 h-3 mr-2" />
                              Procesar Envío
                            </>
                          )}
                        </button>
                      )}
                      
                      {envio && envio.transport_order_number && order.estado === 'en_preparacion' && (
                        <>
                          <button
                            onClick={() => handleVerEtiqueta(envio.transport_order_number)}
                            className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <FaEye className="w-3 h-3 mr-2" />
                            Ver Etiqueta
                          </button>
                          <button
                            onClick={() => handleReimprimirEtiqueta(envio.transport_order_number)}
                            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FaPrint className="w-3 h-3 mr-2" />
                            Descargar
                          </button>
                          <button
                            onClick={() => handleMarcarEnTransito(order)}
                            className="flex items-center px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                          >
                            <FaTruck className="w-3 h-3 mr-2" />
                            Marcar en Tránsito
                          </button>
                        </>
                      )}
                      

                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FaUser className="h-4 w-4 text-slate-600" />
                      Cliente
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                      <div className="font-medium text-gray-800">{order.cliente}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaEnvelope className="h-3 w-3" />
                        {order.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhone className="h-3 w-3" />
                        {order.telefono}
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{order.direccion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FaShoppingBag className="h-4 w-4 text-stone-600" />
                        Productos ({order.productos?.length || 0})
                      </div>
                    </div>
                    <div className="space-y-3">
                      {(order.productos || []).slice(0, 3).map((product, index) => (
                        <div key={product.id_producto || index} className="bg-stone-50 rounded-lg p-4 border-l-4 border-stone-300">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-stone-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                            </div>
                            <img
                              src={product.imagen || "/images/imagenotfound.png"}
                              alt={product.nombre}
                              className="w-12 h-12 object-cover rounded-md border flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-800 mb-1">{product.nombre}</div>
                              <div className="text-sm text-gray-600 mb-2">
                                Cantidad: <span className="font-semibold">{product.cantidad}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Precio unitario: <span className="font-semibold">${product.precio?.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-lg font-bold text-gray-800">
                                ${((product.cantidad * product.precio) || 0).toLocaleString()}
                            </div>
                              <div className="text-xs text-gray-500">Total</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.productos && order.productos.length > 3 && (
                        <div className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
                          <button className="w-full text-center text-sm text-gray-600">
                            Ver {order.productos.length - 3} productos más
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FaCreditCard className="h-4 w-4 text-gray-600" />
                        Pago
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.estado_pago)}
                          <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(order.estado_pago)}`}>
                            {order.estado_pago === 'approved' ? 'Pagado' : order.estado_pago === 'pending' ? 'Pendiente' : 'Rechazado'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.metodo_pago === 'credit_card' ? 'Tarjeta de Crédito/Debito' : 
                           order.metodo_pago || 'No especificado'}
                        </div>
                        <div className="text-lg font-bold text-gray-800">${Math.floor(order.total || 0).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{order.id_pago || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FaTruck className="h-4 w-4 text-gray-600" />
                        Envío
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          {getShippingStatusIcon(order.estado, order.estado_pago)}
                          <span className={`inline-block px-2 py-1 rounded text-xs ${getShippingStatusColor(order.estado, order.estado_pago)}`}>
                            {getShippingStatusText(order.estado, order.estado_pago)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{envio?.service_description || 'No especificado'}</div>
                        <div className="text-xs text-gray-500">{envio?.transport_order_number || 'N/A'}</div>
                        {envio && (
                          <div className="text-xs text-gray-500">
                            Estado: {envio.current_status || 'N/A'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            );
          })}
        </div>

        {currentCompras.length === 0 && (
          <div className="text-center py-12">
            <FaBox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron compras</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
            </div>
        )}

            {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-600">
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredOrders.length)} de {filteredOrders.length} compras
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                <FaChevronLeft className="h-4 w-4" />
                    </button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
                            </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                <FaChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
        )}
      </div>

      {modalEtiqueta.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Etiqueta de Envío</h3>
            <button
                onClick={closeModalEtiqueta}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle className="h-6 w-6" />
            </button>
            </div>
            <div className="text-center">
              {modalEtiqueta.mimeType?.startsWith('image/') ? (
                <img
                  src={modalEtiqueta.url}
                  alt="Etiqueta de envío"
                  className="max-w-full h-auto mx-auto"
                />
              ) : (
                <iframe
                  src={modalEtiqueta.url}
                  className="w-full h-96 border-0"
                  title="Etiqueta de envío"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 