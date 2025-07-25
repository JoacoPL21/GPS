import React, { useEffect, useState } from "react";
import { FaShoppingBag, FaCalendar, FaClock, FaDollarSign, FaUser, FaBox, FaTruck, FaSearch, FaDownload, FaChevronLeft, FaChevronRight, FaCheckCircle } from "react-icons/fa";
import { getAllComprasAdmin } from "../../services/compras.service";

export default function AdminCompras() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    async function fetchCompras() {
      const res = await getAllComprasAdmin();
      if (res.status === "Success") {
        setOrders(res.data || []);
      }
    }
    fetchCompras();
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Compras</h1>
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
                <option value="en_elaboracion">Pendientes</option>
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
    </div>
  );
} 