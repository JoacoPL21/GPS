import React, { useState } from 'react';
import { FaShoppingBag, FaCalendar, FaDollarSign, FaMapMarkerAlt, FaClock, FaCheckCircle, FaInfoCircle, FaChevronDown, FaChevronUp, FaTruck, FaBox } from 'react-icons/fa';
import { useMisCompras } from '../../hooks/compras/useMisCompras';
import CompraCard from '../../components/compras/CompraCard';
import CompraDetails from '../../components/compras/CompraDetails';
import { formatearFecha, formatearPrecio, getEstadoPagoColor, getEstadoPagoTexto, getEstadoEnvioInfo } from '../../utils/formatters';
import PurchaseDetailsModal from '../../components/PurchaseDetailsModal';

const MisCompras = () => {
  const {
    // State
    compras,
    loading,
    error,
    enviosData,
    compraExpandida,
    loadingTracking,

    // Actions
    setCompraExpandida,
    actualizarTracking,
    cargarCompras,
  } = useMisCompras();

  const [selectedCompra, setSelectedCompra] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerDetalles = (compra) => {
    setSelectedCompra(compra);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompra(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando historial de compras...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">Error al cargar las compras: {error}</p>
            <button
              onClick={cargarCompras}
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Mis Compras</h2>
        <p className="text-gray-500">Revisa el historial de tus compras realizadas</p>
      </div>

      {compras.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border-gray-400 p-8 text-center">
          <FaShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no tienes compras</h3>
          <p className="text-gray-600 mb-6">Cuando realices tu primera compra, aparecerá aquí tu historial.</p>
          <a
            href="/catalogo"
            className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <FaShoppingBag className="w-5 h-5 mr-2" /> Ir al catálogo
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {compras.map((compra) => {
            const idCompra = compra.id_compra || compra.id;
            const envio = enviosData[idCompra];
            const estadoEnvio = getEstadoEnvioInfo(envio);
            const esExpandida = compraExpandida === idCompra;
            const paymentStatus = compra.payment_status || compra.estado;
            
            return (
              <div key={idCompra} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header de la compra */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-900">Compra #{idCompra}</span>
                      <span className={`inline-block px-3 py-1 text-xs rounded border font-medium ${getEstadoPagoColor(paymentStatus)}`}>
                        {getEstadoPagoTexto(paymentStatus)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendar className="w-4 h-4 mr-1" />
                        {formatearFecha(compra.createdAt || compra.fecha)}
                      </div>
                      <div className="flex items-center">
                        <FaDollarSign className="w-4 h-4 mr-1" />
                        {formatearPrecio(compra.payment_amount || compra.total)}
                      </div>
                    </div>
                  </div>

                  {/* Estado del envío */}
                  {paymentStatus === 'approved' && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Importar icono dinámicamente */}
                          {(() => {
                            const IconComponent = estadoEnvio.icono === 'FaTruck' ? FaTruck : 
                                                  estadoEnvio.icono === 'FaBox' ? FaBox : 
                                                  estadoEnvio.icono === 'FaCheckCircle' ? FaCheckCircle : FaInfoCircle;
                            return <IconComponent className={`w-5 h-5 ${estadoEnvio.color}`} />;
                          })()}
                          <div>
                            <div className={`font-medium ${estadoEnvio.color}`}>{estadoEnvio.texto}</div>
                            <div className="text-sm text-gray-600">{estadoEnvio.descripcion}</div>
                            {estadoEnvio.transportOrder && (
                              <div className="text-xs text-gray-500">Orden de transporte: {estadoEnvio.transportOrder}</div>
                            )}
                          </div>
                        </div>
                        {envio && envio.transport_order_number && (
                          <button
                            onClick={() => actualizarTracking(idCompra)}
                            disabled={loadingTracking[idCompra]}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {loadingTracking[idCompra] ? 'Actualizando...' : 'Actualizar estado'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Productos resumen */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    {(compra.productos || []).slice(0, 3).map((producto, index) => (
                      <div key={producto.id_producto || index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 flex-1 min-w-[220px]">
                        <img
                          src={producto.imagen || producto.imagen_producto || '/images/imagenotfound.png'}
                          alt={producto.nombre || producto.nombre_producto}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm line-clamp-2">
                            {producto.nombre || producto.nombre_producto}
                          </div>
                          <div className="text-xs text-gray-500">Cantidad: {producto.cantidad}</div>
                        </div>
                      </div>
                    ))}
                    {compra.productos && compra.productos.length > 3 && (
                      <div className="flex items-center text-xs text-gray-500 ml-2">+{compra.productos.length - 3} más</div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setCompraExpandida(esExpandida ? null : idCompra)}
                      className="flex items-center px-4 py-2 bg-[#A47048] text-white rounded hover:bg-[#8a5a36] font-medium transition-colors"
                    >
                      {esExpandida ? 'Ocultar detalles' : 'Ver más detalles'}
                      {esExpandida ? <FaChevronUp className="ml-2 w-4 h-4" /> : <FaChevronDown className="ml-2 w-4 h-4" />}
                    </button>
                    <button
                      className="px-4 py-2 bg-[#A47048] text-white rounded hover:bg-[#8a5a36] font-medium transition-colors"
                      onClick={() => handleVerDetalles(compra)}
                    >
                      Ver detalles completos
                    </button>
                  </div>
                </div>

                {/* Sección expandida con detalles completos */}
                {esExpandida && (
                  <CompraDetails
                    compra={compra}
                    envio={envio}
                    isAdmin={false}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de detalles */}
      <PurchaseDetailsModal
        compra={selectedCompra}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MisCompras; 