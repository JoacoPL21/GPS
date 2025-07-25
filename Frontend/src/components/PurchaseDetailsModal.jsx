import React from 'react';
import { FaTimes, FaCalendar, FaMapMarkerAlt, FaCreditCard, FaTruck, FaBox } from 'react-icons/fa';

const PurchaseDetailsModal = ({ compra, isOpen, onClose }) => {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstado = (estado) => {
    switch (estado) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobado';
      default:
        return 'Pendiente';
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoEnvioColor = (estado) => {
    switch (estado) {
      case 'en_elaboracion':
        return 'bg-blue-100 text-blue-800';
      case 'en_transito':
        return 'bg-orange-100 text-orange-800';
      case 'entregado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoEnvioText = (estado) => {
    switch (estado) {
      case 'en_elaboracion':
        return 'En elaboración';
      case 'en_transito':
        return 'En tránsito';
      case 'entregado':
        return 'Entregado';
      default:
        return 'Pendiente';
    }
  };

  if (!isOpen || !compra) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalles de Compra #{compra.id}</h2>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <FaCalendar className="w-4 h-4 mr-2" />
                {formatearFecha(compra.fecha)}
              </div>
              {compra.estado === 'approved' && compra.estado_envio && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoEnvioColor(compra.estado_envio)}`}>
                  <FaTruck className="w-4 h-4 mr-1" />
                  {getEstadoEnvioText(compra.estado_envio)}
                </span>
              )}
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
          {/* Información de la compra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información del Pedido</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de factura:</span>
                  <span className="font-medium">{compra.facturacion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado del pago:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getEstadoColor(compra.estado)}`}>
                    {compra.estado}
                  </span>
                </div>
                {compra.estado === 'Aprobado' && compra.estado_envio && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado del envío:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getEstadoEnvioColor(compra.estado_envio)}`}>
                      <FaTruck className="w-3 h-3 mr-1" />
                      {getEstadoEnvioText(compra.estado_envio)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Resumen de Pago</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatearPrecio(compra.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium">Gratis</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-gray-900">{formatearPrecio(compra.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Productos ({compra.productos?.length || 0})</h3>
            <div className="space-y-4">
              {compra.productos?.map((producto) => (
                <div key={producto.id_producto} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <img
                      src={producto.imagen || '/images/imagenotfound.png'}
                      alt={producto.nombre_producto}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/images/imagenotfound.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1">{producto.nombre_producto}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="space-y-1">
                        <div>Cantidad: {producto.cantidad}</div>
                        <div>Precio unitario: {formatearPrecio(producto.precio_unitario)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatearPrecio(producto.precio_unitario * producto.cantidad)}
                        </div>
                      </div>
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
                <p className="font-medium">Juan Pérez</p>
                <p>Calle Mayor 123, 2º A</p>
                <p>Madrid, Madrid 28001</p>
                <p>España</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaCreditCard className="w-5 h-5 mr-2 text-gray-400" />
                Método de Pago
              </h3>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{compra.metodo_pago}</span>
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