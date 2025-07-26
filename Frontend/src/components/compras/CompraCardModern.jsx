import React from 'react';
import { FaCalendar, FaDollarSign, FaBox, FaTruck, FaCheckCircle, FaEye, FaCreditCard, FaDownload } from 'react-icons/fa';
import { formatearFecha, formatearPrecio } from '../../utils/formatters';

const CompraCardModern = ({ 
  compra, 
  onVerDetalles
}) => {
  const idCompra = compra.id_compra || compra.id;
  const paymentStatus = compra.payment_status || compra.estado;
  const shippingStatus = compra.estado_envio || compra.estado;

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Pagado</span>
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
      case "rejected":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rechazado</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Desconocido</span>
    }
  }

  const getShippingStatusBadge = (status, paymentStatus) => {
    if (paymentStatus === 'pending') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Esperando Pago</span>
    }
    
    switch (status) {
      case "entregado":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
      case "en_transito":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En tránsito</span>
      case "en_preparacion":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Procesando</span>
      case "cancelado":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelado</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pendiente</span>
    }
  }

  const getShippingStatusIcon = (status, paymentStatus) => {
    if (paymentStatus === 'pending') {
      return <FaCalendar className="h-5 w-5 text-gray-600" />
    }
    
    switch (status) {
      case "entregado":
        return <FaCheckCircle className="h-5 w-5 text-green-600" />
      case "en_transito":
        return <FaTruck className="h-5 w-5 text-blue-600" />
      case "en_preparacion":
        return <FaBox className="h-5 w-5 text-orange-600" />
      default:
        return <FaBox className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 max-w-3xl mx-auto">
      {/* Header de la compra */}
      <div className="bg-gradient-to-r from-gray-50 to-stone-50 border-b border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pedido #{idCompra}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <FaCalendar className="h-4 w-4" />
              <span>{formatearFecha(compra.createdAt || compra.fecha)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {onVerDetalles && (
              <button
                onClick={() => onVerDetalles(compra)}
                className="flex items-center px-3 py-1.5 text-sm bg-[#A47048] text-white rounded-lg hover:bg-[#8a5a36] transition-colors"
              >
                <FaEye className="h-4 w-4 mr-2" />
                Ver detalles
              </button>
            )}
            <button className="flex items-center px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <FaDownload className="h-4 w-4 mr-2" />
              Factura
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Estado del pedido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#A47048]/10 rounded-full">
              <FaCreditCard className="h-5 w-5 text-[#A47048]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Estado del Pago</p>
              {getPaymentStatusBadge(paymentStatus)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              {getShippingStatusIcon(shippingStatus, paymentStatus)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Estado del Envío</p>
              {getShippingStatusBadge(shippingStatus, paymentStatus)}
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Productos */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FaBox className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Productos ({compra.productos?.length || 0})</h3>
          </div>

          <div className="space-y-4">
            {(compra.productos || []).map((producto, index) => (
              <div key={producto.id_producto || index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <img
                    src={producto.imagen || producto.imagen_producto || '/images/imagenotfound.png'}
                    alt={producto.nombre || producto.nombre_producto}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{producto.nombre || producto.nombre_producto}</h4>
                  <p className="text-sm text-gray-600 mt-1">Cantidad: {producto.cantidad}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatearPrecio(producto.precio_unitario || producto.precio)}</p>
                  {producto.cantidad > 1 && (
                    <p className="text-sm text-gray-600">c/u: {formatearPrecio(producto.precio_unitario || producto.precio)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total al final */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-xl font-bold text-gray-900">{formatearPrecio(compra.payment_amount || compra.total)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompraCardModern; 