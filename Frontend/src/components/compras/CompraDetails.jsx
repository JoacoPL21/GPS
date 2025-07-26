import React from 'react';
import { FaInfoCircle, FaTruck, FaBox } from 'react-icons/fa';
import { formatearFecha, formatearPrecio, getEstadoPagoColor, getEstadoPagoTexto, getMetodoPagoTexto, getEstadoEnvioInfo } from '../../utils/formatters';

const CompraDetails = ({ compra, envio, isAdmin = false }) => {
  const idCompra = compra.id_compra || compra.id;
  const paymentStatus = compra.payment_status || compra.estado;
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

  return (
    <div className="border-t border-gray-200 p-6 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información detallada de la compra */}
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
            {isAdmin && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Pago:</span>
                  <span className="font-medium">{compra.id_pago || 'N/A'}</span>
                </div>
              </>
            )}
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
            <div key={producto.id_producto || index} className="flex items-center gap-4 bg-white rounded-lg p-4 border border-gray-200">
              <img
                src={producto.imagen || '/images/imagenotfound.png'}
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
    </div>
  );
};

export default CompraDetails; 