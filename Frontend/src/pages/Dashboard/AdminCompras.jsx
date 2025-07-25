import React, { useEffect, useState } from "react";
import { FaShoppingBag, FaCalendar, FaClock, FaDollarSign, FaUser, FaBox, FaTruck, FaSearch, FaDownload, FaChevronLeft, FaChevronRight, FaCheckCircle, FaEye, FaPrint, FaBarcode } from "react-icons/fa";
import { getAllComprasAdmin } from "../../services/compras.service";
import { procesarEnvio, getEnvioPorCompra, reimprimirEtiqueta } from "../../services/envios.service";
import axios from '../../services/root.service.js';

export default function AdminCompras() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [enviosData, setEnviosData] = useState({});
  const [processingShipment, setProcessingShipment] = useState(null);
  const [modalEtiqueta, setModalEtiqueta] = useState({ open: false, url: null, mimeType: null, etiquetaData: null });

  // Cargar información de envío para una compra
  const cargarEnvioCompra = async (id_compra, forzarRecarga = false) => {
    if (enviosData[id_compra] && !forzarRecarga) return;
    try {
      const { data } = await getEnvioPorCompra(id_compra);
      if (data?.data) {
        setEnviosData(prev => ({ ...prev, [id_compra]: data.data }));
      }
    } catch {
      // Silenciar error
    }
  };

  // Procesar envío (crear orden de transporte)
  const handleProcesarEnvio = async (order) => {
    setProcessingShipment(order.id_compra);
    try {
      const serviceCode = "3";
      const destinationCoverage = "STGO";
      const { error } = await procesarEnvio(order.id_compra, serviceCode, destinationCoverage);
      if (error) {
        alert(error?.response?.data?.message || error);
      } else {
        alert('Orden de transporte creada exitosamente');
        await cargarEnvioCompra(order.id_compra, true);
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Error interno al procesar el envío');
    } finally {
      setProcessingShipment(null);
    }
  };

  // Ver etiqueta (ahora en modal)
  const handleVerEtiqueta = async (transportOrderNumber) => {
    try {
      const response = await reimprimirEtiqueta(transportOrderNumber);
      if (response.error) {
        alert(`Error al obtener etiqueta: ${response.error}`);
      } else {
        const etiquetaData = response.data?.data || response.data;
        if (etiquetaData?.labelData) {
          const labelData = etiquetaData.labelData;
          let mimeType = 'image/jpeg';
          if (labelData.startsWith('/9j/')) mimeType = 'image/jpeg';
          else if (labelData.startsWith('iVBORw0KGgo')) mimeType = 'image/png';
          else if (labelData.startsWith('JVBERi0x')) mimeType = 'application/pdf';
          const byteCharacters = atob(labelData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          const url = window.URL.createObjectURL(blob);
          setModalEtiqueta({ open: true, url, mimeType, etiquetaData });
        } else {
          alert('No se encontraron datos de etiqueta en la respuesta');
        }
      }
    } catch {
      alert('Error interno al obtener la etiqueta');
    }
  };

  // Descargar etiqueta
  const handleReimprimirEtiqueta = async (transportOrderNumber) => {
    try {
      const response = await reimprimirEtiqueta(transportOrderNumber);
      if (response.error) {
        alert(`Error al reimprimir etiqueta: ${response.error}`);
      } else {
        const etiquetaData = response.data?.data || response.data;
        if (etiquetaData?.labelData) {
          const labelData = etiquetaData.labelData;
          let mimeType = 'image/jpeg';
          let fileExtension = 'jpg';
          if (labelData.startsWith('/9j/')) { mimeType = 'image/jpeg'; fileExtension = 'jpg'; }
          else if (labelData.startsWith('iVBORw0KGgo')) { mimeType = 'image/png'; fileExtension = 'png'; }
          else if (labelData.startsWith('JVBERi0x')) { mimeType = 'application/pdf'; fileExtension = 'pdf'; }
          const byteCharacters = atob(labelData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `etiqueta_${etiquetaData.transportOrderNumber || transportOrderNumber}_${etiquetaData.reference || 'GPS'}.${fileExtension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          alert('Etiqueta descargada exitosamente');
        } else {
          alert('Etiqueta reimpresa exitosamente, pero no se pudo generar el archivo de descarga');
        }
      }
    } catch {
      alert('Error interno al reimprimir la etiqueta');
    }
  };

  // Marcar como entregado al courier
  const handleMarcarEnTransito = async (order) => {
    try {
      await axios.patch(`/envios/compras/${order.id_compra}/estado-envio`, { estado_envio: 'en_transito' });
      alert('Compra marcada como entregada al courier (en tránsito)');
      // Refrescar compras
      setOrders((prev) => prev.map(o => o.id_compra === order.id_compra ? { ...o, estado: 'en_transito' } : o));
    } catch (error) {
      alert(error?.response?.data?.message || 'Error al actualizar el estado de envío');
    }
  };

  useEffect(() => {
    async function fetchCompras() {
      const res = await getAllComprasAdmin();
      if (res.status === "Success") {
        setOrders(res.data || []);
      }
    }
    fetchCompras();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      orders.forEach(order => {
        cargarEnvioCompra(order.id_compra);
      });
    }
    // eslint-disable-next-line
  }, [orders]);

  // Filtrado y búsqueda
  let filteredOrders = [...orders];
  if (search) {
    filteredOrders = filteredOrders.filter((order) =>
      order.cliente?.toLowerCase().includes(search.toLowerCase()) ||
      order.email?.toLowerCase().includes(search.toLowerCase()) ||
      String(order.id_compra).toLowerCase().includes(search.toLowerCase())
    );
  }
  if (filter !== "todas") {
    filteredOrders = filteredOrders.filter((order) => order.estado === filter);
  }


  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompras = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Estadísticas
  const stats = {
    total: orders.length,
    enviadas: orders.filter((c) => c.estado === "en_transito").length,
    entregadas: orders.filter((c) => c.estado === "entregado").length,
    en_preparacion: orders.filter((c) => c.estado === "en_preparacion").length,
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const formatearPrecio = (precio) => {
    const valor = parseFloat(precio);
    if (isNaN(valor)) {
      return 'Precio no disponible';
    }
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor);
  };
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'en_preparacion':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'entregado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'en_transito':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';  
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'en_preparacion':
        return 'En preparación';
      case 'en_transito':
        return 'En tránsito';
      case 'entregado':
        return 'Entregado';
      default:
        return estado || 'Pendiente';
    }
  };

  const getMetodoPagoTexto = (metodo) => {
    switch (metodo) {
      case 'credit_card':
        return 'Tarjeta de crédito';
      default:
        return 'N/A';
    }
  };

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
            <button className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <FaDownload className="mr-2" />
              Exportar
            </button>
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
                <div key={order.id_compra} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {/* Header de la compra */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold text-gray-900">
                        Compra #{order.id_compra}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded border font-medium ${getEstadoColor(order.estado)}`}>
                        {getEstadoEnvioIcon(order.estado)}
                        {getEstadoTexto(order.estado)}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendar className="w-4 h-4 mr-2" />
                        {formatearFecha(order.fecha)}
                      </div>
                      <div className="flex items-center">
                        <FaDollarSign className="w-4 h-4 mr-2" />
                        {formatearPrecio(order.total)}
                      </div>
                    </div>
                  </div>
                  {/* Información del cliente */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FaUser className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Información del Cliente</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Nombre:</span>
                        <div className="text-gray-900">{order.cliente}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <div className="text-gray-900">{order.email}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Teléfono:</span>
                        <div className="text-gray-900">{order.telefono || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Dirección:</span>
                        <div className="text-gray-900">{order.direccion || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                  {/* Productos */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Productos comprados:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(order.productos || []).map((producto, index) => (
                        <div key={`${order.id_compra}-${producto.id_producto || index}`} 
                             className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <img
                            src={producto.imagen || '/images/imagenotfound.png'}
                            alt={producto.nombre}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src = '/images/imagenotfound.png';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm truncate">
                              {producto.nombre}
                            </div>
                            <div className="text-xs text-gray-500">
                              Cantidad: {producto.cantidad}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatearPrecio(producto.precio)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Información adicional */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">ID de Pago:</span>
                        <div className="text-gray-900">{order.id_pago || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Método de Pago:</span>
                        <div className="text-gray-900">{getMetodoPagoTexto(order.metodo_pago)}</div>
                      </div>
                    </div>
                    {/* Botón Procesar Envío o gestión de etiqueta */}
                    {order.estado === 'en_preparacion' && enviosData[order.id_compra] && enviosData[order.id_compra].transport_order_number ? (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        <button
                          onClick={() => handleVerEtiqueta(enviosData[order.id_compra].transport_order_number)}
                          className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FaEye className="w-3 h-3 mr-2" />
                          Ver Etiqueta
                        </button>
                        <button
                          onClick={() => handleReimprimirEtiqueta(enviosData[order.id_compra].transport_order_number)}
                          className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FaPrint className="w-3 h-3 mr-2" />
                          Descargar Etiqueta
                        </button>
                        {enviosData[order.id_compra].barcode && (
                          <button
                            onClick={() => {
                              const barcode = enviosData[order.id_compra].barcode;
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
                          onClick={() => handleMarcarEnTransito(order)}
                          className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <FaTruck className="w-4 h-4 mr-2" />
                          Marcar como entregado al courier
                        </button>
                      </div>
                    ) : order.estado === 'en_preparacion' && (
                      <div className="mt-4 flex flex-col items-end gap-2">
                        <button
                          onClick={() => handleProcesarEnvio(order)}
                          disabled={processingShipment === order.id_compra}
                          className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingShipment === order.id_compra ? (
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
                      </div>
                    )}
                  </div>
                </div>
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
              onClick={() => {
                if (modalEtiqueta.url) window.URL.revokeObjectURL(modalEtiqueta.url);
                setModalEtiqueta({ open: false, url: null, mimeType: null, etiquetaData: null });
              }}
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