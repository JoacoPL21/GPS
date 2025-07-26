import React from 'react';
import { FaTimes, FaCalendar, FaMapMarkerAlt, FaCreditCard, FaTruck, FaBox, FaInfoCircle } from 'react-icons/fa';
import { formatearFecha, formatearPrecio, getEstadoPagoColor, getEstadoPagoTexto, getMetodoPagoTexto, getEstadoEnvioInfo } from '../utils/formatters';

const PurchaseDetailsModal = ({ compra, isOpen, onClose, envio }) => {
  const idCompra = compra?.id_compra || compra?.id;
  const paymentStatus = compra?.payment_status || compra?.estado;
  const estadoEnvio = getEstadoEnvioInfo(envio);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'FaInfoCircle':
        return FaInfoCircle;
      case 'FaTruck':
        return FaTruck;
      case 'FaBox':
        return FaBox;
      default:
        return FaInfoCircle;
    }
  };

  const EstadoIcon = getIconComponent(estadoEnvio.icono);

  if (!isOpen || !compra) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalles de Compra #{idCompra}</h2>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <FaCalendar className="w-4 h-4 mr-2" />
                {formatearFecha(compra.createdAt || compra.fecha)}
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoPagoColor(paymentStatus)}`}>
                {getEstadoPagoTexto(paymentStatus)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información detallada de la compra */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de la compra</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de compra:</span>
                  <span className="font-medium">#{idCompra}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado del pago:</span>
                  <span className={`px-2 py-1 rounded text-xs ${getEstadoPagoColor(paymentStatus)}`}>
                    {getEstadoPagoTexto(paymentStatus)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método de pago:</span>
                  <span className="font-medium">{getMetodoPagoTexto(compra.payment_method || compra.metodo_pago)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total pagado:</span>
                  <span className="font-medium text-lg">{formatearPrecio(compra.payment_amount || compra.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de compra:</span>
                  <span className="font-medium">{formatearFecha(compra.createdAt || compra.fecha)}</span>
                </div>
              </div>
            </div>

            {/* Información de envío */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de envío</h4>
              {paymentStatus === 'approved' ? (
                <div className="space-y-3 text-sm">
                  {envio ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <EstadoIcon className={`w-5 h-5 ${estadoEnvio.color}`} />
                        <span className={`font-medium ${estadoEnvio.color}`}>{estadoEnvio.texto}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <span className="font-medium">{envio.current_status || 'En proceso'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ubicación actual:</span>
                        <span className="font-medium">{envio.current_location || 'No disponible'}</span>
                      </div>
                      {envio.transport_order_number && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Orden de transporte:</span>
                          <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">{envio.transport_order_number}</span>
                        </div>
                      )}
                      {envio.last_tracking_update && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Última actualización:</span>
                          <span className="font-medium">{formatearFecha(envio.last_tracking_update)}</span>
                        </div>
                      )}
                      {envio.delivered_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fecha de entrega:</span>
                          <span className="font-medium text-green-600">{formatearFecha(envio.delivered_date)}</span>
                        </div>
                      )}
                      {envio.delivered_to && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Entregado a:</span>
                          <span className="font-medium">{envio.delivered_to}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <FaInfoCircle className="w-4 h-4" />
                        <span>Envío aún no procesado</span>
                      </div>
                      <p className="text-sm">Tu pago ha sido confirmado. El envío será procesado pronto.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <FaInfoCircle className="w-4 h-4" />
                    <span>Esperando confirmación de pago</span>
                  </div>
                  <p className="text-sm">Una vez confirmado el pago, procesaremos tu envío.</p>
                </div>
              )}
            </div>
          </div>

          {/* Lista detallada de productos */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Productos en esta compra</h4>
            <div className="space-y-3">
              {(compra.productos || []).map((producto, index) => (
                <div key={producto.id_producto || index} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <img
                    src={producto.imagen || producto.imagen_producto || '/images/imagenotfound.png'}
                    alt={producto.nombre || producto.nombre_producto}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{producto.nombre || producto.nombre_producto}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Cantidad: {producto.cantidad} × {formatearPrecio(producto.precio || producto.precio_unitario)} = {formatearPrecio((producto.precio || producto.precio_unitario) * producto.cantidad)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaMapMarkerAlt className="w-5 h-5 mr-2 text-gray-400" />
                Dirección de Envío
              </h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium">
                  {compra.nombre && compra.apellido ? `${compra.nombre} ${compra.apellido}` : 
                   compra.cliente || 'Cliente'}
                </p>
                {compra.direccion && <p>{compra.direccion}</p>}
                {(compra.ciudad || compra.region) && (
                  <p>{[compra.ciudad, compra.region].filter(Boolean).join(', ')}</p>
                )}
                {compra.codigo_postal && <p>Código Postal: {compra.codigo_postal}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaCreditCard className="w-5 h-5 mr-2 text-gray-400" />
                Método de Pago
              </h3>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{getMetodoPagoTexto(compra.payment_method || compra.metodo_pago)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#A47048] text-white rounded-lg hover:bg-[#8a5a36] transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailsModal; 