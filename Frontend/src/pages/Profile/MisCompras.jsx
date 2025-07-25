import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComprasUsuario } from '../../services/valoraciones.service';
import { getEnvioPorCompra, getTracking } from '../../services/envios.service';
import { FaShoppingBag, FaCalendar, FaDollarSign, FaStar, FaStarHalfAlt, FaBox, FaTruck, FaMapMarkerAlt, FaClock, FaCheckCircle, FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ValoracionForm from '../../components/ValoracionForm';
import PurchaseDetailsModal from '../../components/PurchaseDetailsModal';

const MisCompras = () => {
  const { authUser } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enviosData, setEnviosData] = useState({});
  const [compraExpandida, setCompraExpandida] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState({});

  useEffect(() => {
    const cargarCompras = async () => {
      if (!authUser) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getComprasUsuario();
        if (error) {
          setError(error);
        } else {
          setCompras(data.data || []);
        }
      } catch (error) {
        setError('Error al cargar las compras');
        console.error('Error al cargar compras:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarCompras();
  }, [authUser]);

  // Cargar información de envío para una compra
  const cargarEnvioCompra = async (id_compra) => {
    if (enviosData[id_compra]) return; // Ya está cargado

    try {
      const { data, error } = await getEnvioPorCompra(id_compra);
      if (!error && data?.data) {
        setEnviosData(prev => ({
          ...prev,
          [id_compra]: data.data
        }));
      }
      // Si no hay envío (404), es normal, no hacer nada
    } catch (error) {
      // Error silencioso para 404s
      if (!error.message?.includes('404')) {
        console.error('Error al cargar envío:', error);
      }
    }
  };

  // Actualizar tracking de un envío
  const actualizarTracking = async (id_compra) => {
    setLoadingTracking(prev => ({ ...prev, [id_compra]: true }));

    try {
      const { data, error } = await getTracking(id_compra);
      if (!error && data?.data) {
        setEnviosData(prev => ({
          ...prev,
          [id_compra]: data.data
        }));
        alert('Estado de envío actualizado');
      } else {
        // Si hay error, mostrar mensaje pero no es crítico
        alert(`No se pudo actualizar desde Chilexpress, pero aquí tienes la información actual del envío. ${error || ''}`);
      }
    } catch (error) {
      console.error('Error al actualizar tracking:', error);
      alert('Error al actualizar el estado del envío. La información mostrada es la última disponible.');
    } finally {
      setLoadingTracking(prev => ({ ...prev, [id_compra]: false }));
    }
  };

  // Cargar envíos para compras aprobadas
  useEffect(() => {
    if (compras.length > 0) {
      compras.forEach(compra => {
        if (compra.payment_status === 'approved' || compra.estado === 'approved') {
          cargarEnvioCompra(compra.id_compra || compra.id);
        }
      });
    }
  }, [compras]);

  const formatearFecha = (fechaString) => {
    try {
      const fecha = new Date(fechaString);
      
      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        throw new Error('Fecha inválida');
      }
      
      return fecha.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha no disponible';
    }
  };

  const formatearPrecio = (precio) => {
    // Manejar valores undefined, null o no numéricos
    const valor = parseFloat(precio);
    if (isNaN(valor)) {
      return '$0';
    }
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor);
  };



  const getEstadoPagoColor = (estado) => {
    switch (estado) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoPagoTexto = (estado) => {
    switch (estado) {
      case 'approved':
        return 'Pagado';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  };

  const getEstadoEnvioInfo = (envio) => {
    if (!envio) {
      return {
        texto: 'Sin procesar',
        color: 'text-gray-500',
        icono: FaInfoCircle,
        descripcion: 'El envío aún no ha sido procesado'
      };
    }

    if (envio.transport_order_number) {
      return {
        texto: envio.current_status || 'En proceso',
        color: 'text-blue-600',
        icono: FaTruck,
        descripcion: envio.current_location || 'En tránsito',
        transportOrder: envio.transport_order_number
      };
    }

    return {
      texto: 'Preparando envío',
      color: 'text-yellow-600',
      icono: FaBox,
      descripcion: 'Preparando paquete para despacho'
    };
  };

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
      {loading ? (
        <div className="text-center text-gray-500 py-8">Cargando historial de compras...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : compras.length === 0 ? (
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
                          <estadoEnvio.icono className={`w-5 h-5 ${estadoEnvio.color}`} />
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
                    {(compra.productos || []).slice(0, 3).map((producto) => (
                      <div key={producto.id_producto} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 flex-1 min-w-[220px]">
                        <img
                          src={producto.imagen || producto.imagen_producto || '/images/imagenotfound.png'}
                          alt={producto.nombre_producto}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm line-clamp-2">{producto.nombre_producto}</div>
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
                            <span className="font-medium">{compra.payment_method || compra.metodo_pago || 'No especificado'}</span>
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
                                  <estadoEnvio.icono className={`w-5 h-5 ${estadoEnvio.color}`} />
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
                        {(compra.productos || []).map((producto) => (
                          <div key={producto.id_producto} className="flex items-center gap-4 bg-white rounded-lg p-4 border border-gray-200">
                            <img
                              src={producto.imagen || producto.imagen_producto || '/images/imagenotfound.png'}
                              alt={producto.nombre_producto}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{producto.nombre_producto}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                Cantidad: {producto.cantidad} × {formatearPrecio(producto.precio_unitario)} = {formatearPrecio(producto.cantidad * producto.precio_unitario)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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