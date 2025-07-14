import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComprasUsuario } from '../../services/valoraciones.service';
import { FaShoppingBag, FaCalendar, FaDollarSign, FaStar, FaStarHalfAlt, FaBox, FaTruck } from 'react-icons/fa';
import ValoracionForm from '../../components/ValoracionForm';
import { useValoraciones } from '../../hooks/valoraciones/useValoraciones';

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

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'completada':
        return <FaBox className="w-4 h-4" />;
      case 'pendiente':
        return <FaTruck className="w-4 h-4" />;
      case 'en_proceso':
        return <FaTruck className="w-4 h-4" />;
      default:
        return <FaBox className="w-4 h-4" />;
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
    <div className="min-h-screen w-full max-w-6xl py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Compras</h1>
          <p className="text-gray-600">Historial de todas tus compras realizadas</p>
        </div>

        {compras.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <FaShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no tienes compras</h3>
            <p className="text-gray-600 mb-6">
              Cuando realices tu primera compra, aparecerá aquí tu historial.
            </p>
            <a
              href="/catalogo"
              className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <FaShoppingBag className="w-5 h-5 mr-2" />
              Ir al catálogo
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Resumen de compras */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de Compras</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{compras.length}</div>
                  <div className="text-sm text-gray-600">Compras realizadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {compras.filter(c => c.estado === 'completada').length}
                  </div>
                  <div className="text-sm text-gray-600">Completadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {compras.reduce((total, compra) => total + (compra.productos?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Productos comprados</div>
                </div>
              </div>
            </div>

            {/* Lista de compras agrupadas */}
            <div className="space-y-6">
              {compras.map((compra) => (
                <CompraCard 
                  key={compra.id_compra}
                  compra={compra}
                  formatearFecha={formatearFecha}
                  formatearPrecio={formatearPrecio}
                  getEstadoColor={getEstadoColor}
                  getEstadoIcon={getEstadoIcon}
                />
              ))}
            </div>
          </div>
        )}
      </div>
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
                 compra={compra}
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
const ProductoCompra = ({ producto, formatearPrecio, compra }) => {
  const {
    valoraciones,
    loading: loadingValoraciones,
    puedeValorar,
    valoracionUsuario,
    valoracionUsuarioLoading,
    submitting,
    promedioValoraciones,
    enviarValoracion
  } = useValoraciones(producto.id_producto);

  const handleSubmitValoracion = async (valoracionData) => {
    try {
      await enviarValoracion(valoracionData);
      alert(valoracionUsuario ? 'Valoración actualizada exitosamente' : 'Valoración enviada exitosamente');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Solo permitir valorar si la compra está completada
  const puedeValorarProducto = puedeValorar && compra.estado === 'completada';

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start space-x-4">
        {/* Imagen del producto */}
        <div className="flex-shrink-0">
          <img
            src={producto.imagen_producto || '/images/imagenotfound.png'}
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

          {/* Valoraciones */}
          <div className="mt-3">
            {loadingValoraciones ? (
              <div className="text-sm text-gray-500">Cargando valoraciones...</div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">
                      {star <= promedioValoraciones ? (
                        <FaStar className="w-4 h-4" />
                      ) : star - 0.5 <= promedioValoraciones ? (
                        <FaStarHalfAlt className="w-4 h-4" />
                      ) : (
                        <FaStar className="w-4 h-4 text-gray-300" />
                      )}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({promedioValoraciones.toFixed(1)})
                </span>
                <span className="text-sm text-gray-500">
                  ({valoraciones.length} valoraciones)
                </span>
              </div>
            )}
          </div>

          {/* Formulario de valoración */}
          {puedeValorarProducto && !valoracionUsuarioLoading && (
            <div className="mt-4">
              <ValoracionForm
                productoId={producto.id_producto}
                onSubmit={handleSubmitValoracion}
                valoracionExistente={valoracionUsuario}
                submitting={submitting}
                puedeValorar={puedeValorarProducto}
              />
            </div>
          )}
          {/* Indicador de carga para valoraciones del usuario */}
          {puedeValorarProducto && valoracionUsuarioLoading && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                <span className="text-sm text-gray-600">Cargando valoración...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisCompras; 