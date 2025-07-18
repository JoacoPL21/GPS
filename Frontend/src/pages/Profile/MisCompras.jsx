import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComprasUsuario } from '../../services/valoraciones.service';
import { FaShoppingBag, FaCalendar, FaDollarSign, FaStar, FaStarHalfAlt, FaBox, FaTruck } from 'react-icons/fa';
import ValoracionForm from '../../components/ValoracionForm';

const MisCompras = () => {
  const { authUser } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          {compras.map((compra) => (
            <div key={compra.id_compra} className="bg-white rounded-lg shadow-sm border-gray-400 p-6 flex flex-col gap-4">
              {/* Header de la compra */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-900">Compra #{compra.id_compra}</span>
                  <span className={`inline-block px-3 py-1 text-xs rounded border font-medium ${getEstadoColor(compra.estado)}`}>{compra.estado}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <FaCalendar className="w-4 h-4 mr-1" />
                  {formatearFecha(compra.createdAt)}
                  <FaDollarSign className="w-4 h-4 ml-4 mr-1" />
                  {formatearPrecio(compra.total)}
                </div>
              </div>
              {/* Productos resumen */}
              <div className="flex flex-wrap gap-4">
                {(compra.productos || []).slice(0, 3).map((producto) => (
                  <div key={producto.id_producto} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 flex-1 min-w-[220px]">
                    <img
                      src={producto.imagen || producto.imagen_producto || '/images/imagenotfound.png'}
                      alt={producto.nombre_producto}
                      className="w-16 h-16 object-cover rounded-lg border-gray-300"
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
              {/* Botón de detalles */}
              <div className="flex justify-end mt-2">
                <button
                  className="px-4 py-2 bg-[#A47048] text-white rounded hover:bg-[#8a5a36] font-medium transition-colors"
                  // onClick={() => navigate(`/profile/mis-compras/${compra.id_compra}`)}
                >
                  Ver más detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente para mostrar una compra individual con sus productos
const CompraCard = ({ compra, formatearFecha, formatearPrecio, getEstadoColor, getEstadoIcon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header de la compra */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Compra #{compra.id_compra}
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(compra.estado)}`}>
                {getEstadoIcon(compra.estado)}
                <span className="ml-1 capitalize">{compra.estado}</span>
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FaCalendar className="w-4 h-4 mr-2" />
              {formatearFecha(compra.createdAt)}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-2xl font-bold text-gray-900">
              <FaDollarSign className="w-5 h-5 mr-1" />
              {formatearPrecio(compra.total)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {compra.productos?.length || 0} producto{compra.productos?.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Información adicional de la compra */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Facturación:</span> {compra.facturacion}
          </div>
          <div>
            <span className="font-medium">Método de pago:</span> {compra.metodo_pago || 'No especificado'}
          </div>
        </div>
      </div>

      {/* Productos de la compra */}
      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Productos de esta compra</h4>
        
        {compra.productos && compra.productos.length > 0 ? (
          <div className="space-y-4">
                         {compra.productos.map((producto) => (
               <ProductoCompra 
                 key={`${compra.id_compra}-${producto.id_producto}`}
                 producto={producto}
                 formatearPrecio={formatearPrecio}
               />
             ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <p>No se encontraron productos en esta compra.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para mostrar un producto individual dentro de una compra
const ProductoCompra = ({ producto, formatearPrecio }) => {
  // Mostrar solo información básica del producto, sin valoraciones
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start space-x-4">
        {/* Imagen del producto */}
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
        {/* Información del producto */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="text-lg font-semibold text-gray-900 mb-1">
                {producto.nombre_producto}
              </h5>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <span>Cantidad: {producto.cantidad}</span>
                <span>Precio unitario: {formatearPrecio(producto.precio_unitario)}</span>
                <span>Total: {formatearPrecio(producto.precio_unitario * producto.cantidad)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisCompras; 