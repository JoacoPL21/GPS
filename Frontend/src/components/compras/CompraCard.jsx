import React from 'react';
import { FaCalendar, FaDollarSign, FaUser, FaBox, FaTruck, FaCheckCircle, FaEye, FaPrint, FaBarcode, FaInfoCircle } from 'react-icons/fa';
import { formatearFecha, formatearPrecio, getEstadoColor, getEstadoTexto } from '../../utils/formatters';

const CompraCard = ({ 
  compra, 
  envio, 
  isAdmin = false,
  onProcesarEnvio,
  onVerEtiqueta,
  onReimprimirEtiqueta,
  onMarcarEnTransito,
  processingShipment,
  showDetails = false,
  onToggleDetails,
  isExpanded = false
}) => {
  const idCompra = compra.id_compra || compra.id;

  const getEstadoEnvioIcon = (estado) => {
    switch (estado) {
      case 'en_preparacion':
        return <FaBox className="w-4 h-4" />;
      case 'en_transito':
        return <FaTruck className="w-4 h-4" />;
      case 'entregado':
        return <FaCheckCircle className="w-4 h-4" />;
      default:
        return <FaBox className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header de la compra */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900">Compra #{idCompra}</span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded border font-medium ${getEstadoColor(compra.estado)}`}>
              {getEstadoEnvioIcon(compra.estado)}
              {getEstadoTexto(compra.estado)}
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

        {/* Información del cliente (solo para admin) */}
        {isAdmin && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FaUser className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Información del Cliente</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Nombre:</span>
                <div className="text-gray-900">{compra.cliente}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <div className="text-gray-900">{compra.email}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Teléfono:</span>
                <div className="text-gray-900">{compra.telefono || 'N/A'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Dirección:</span>
                <div className="text-gray-900">{compra.direccion || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Productos resumen */}
        <div className="flex flex-wrap gap-4 mb-4">
          {(compra.productos || []).slice(0, 3).map((producto, index) => (
            <div key={producto.id_producto || index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 flex-1 min-w-[220px]">
              <img
                src={producto.imagen || '/images/imagenotfound.png'}
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

        {/* Información adicional de la compra */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FaInfoCircle className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">Información de la compra</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Estado del pago:</span>
              <div className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                compra.estado_pago === 'approved' ? 'bg-green-100 text-green-800' :
                compra.estado_pago === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {compra.estado_pago === 'approved' ? 'Pagado' :
                 compra.estado_pago === 'pending' ? 'Pendiente' : 'Rechazado'}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Método de pago:</span>
              <div className="text-gray-900">{compra.payment_method || compra.metodo_pago || 'No especificado'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">ID de pago:</span>
              <div className="text-gray-900">{compra.id_pago || 'N/A'}</div>
            </div>
            {envio && envio.transport_order_number && (
              <div>
                <span className="font-medium text-gray-700">Orden de transporte:</span>
                <div className="text-gray-900 font-mono text-sm">{envio.transport_order_number}</div>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3">
          {showDetails && (
            <button
              onClick={() => onToggleDetails(idCompra)}
              className="flex items-center px-4 py-2 bg-[#A47048] text-white rounded hover:bg-[#8a5a36] font-medium transition-colors"
            >
              {isExpanded ? 'Ocultar detalles' : 'Ver más detalles'}
            </button>
          )}
          
          {/* Botones específicos para admin */}
          {isAdmin && compra.estado === 'en_preparacion' && envio && envio.transport_order_number && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onVerEtiqueta(envio.transport_order_number)}
                className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaEye className="w-3 h-3 mr-2" />
                Ver Etiqueta
              </button>
              <button
                onClick={() => onReimprimirEtiqueta(envio.transport_order_number)}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPrint className="w-3 h-3 mr-2" />
                Descargar Etiqueta
              </button>
              {envio.barcode && (
                <button
                  onClick={() => {
                    const barcode = envio.barcode;
                    navigator.clipboard.writeText(barcode).then(() => {
                      alert(`Código de barras copiado al portapapeles:\n${barcode}`);
                    }).catch(() => {
                      alert(`Código de barras: ${barcode}`);
                    });
                  }}
                  className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  title="Copiar código de barras al portapapeles"
                >
                  <FaBarcode className="w-3 h-3 mr-2" />
                  Copiar Código
                </button>
              )}
              <button
                onClick={() => onMarcarEnTransito(compra)}
                className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <FaTruck className="w-4 h-4 mr-2" />
                Marcar como entregado al courier
              </button>
            </div>
          )}
          
          {isAdmin && compra.estado === 'en_preparacion' && !envio?.transport_order_number && (
            <button
              onClick={() => onProcesarEnvio(compra)}
              disabled={processingShipment === idCompra}
              className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingShipment === idCompra ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <FaTruck className="w-4 h-4 mr-2" />
                  Procesar Envío
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompraCard; 