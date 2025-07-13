import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComprasUsuario } from '../../services/valoraciones.service';
import { FaShoppingBag, FaCalendar, FaDollarSign, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import ValoracionForm from '../../components/ValoracionForm';
import { useValoraciones } from '../../hooks/valoraciones/useValoraciones';

const MisCompras = () => {
  const { authUser } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productosComprados, setProductosComprados] = useState([]);

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
          
          // Extraer productos únicos de las compras
          const productosUnicos = new Map();
          data.data?.forEach(compra => {
            if (compra.productos) {
              compra.productos.forEach(producto => {
                if (!productosUnicos.has(producto.id_producto)) {
                  productosUnicos.set(producto.id_producto, {
                    ...producto,
                    fecha_compra: compra.createdAt,
                    id_compra: compra.id_compra
                  });
                }
              });
            }
          });
          
          setProductosComprados(Array.from(productosUnicos.values()));
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

  const handleValoracionEnviada = (idProducto) => {
    // Actualizar el estado local para reflejar que se envió una valoración
    console.log(`Valoración enviada para producto ${idProducto}`);
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
    <div className="min-h-screen max-w-full bg-gray-50 py-8">
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
                  <div className="text-2xl font-bold text-blue-600">{productosComprados.length}</div>
                  <div className="text-sm text-gray-600">Productos comprados</div>
                </div>
              </div>
            </div>

            {/* Productos comprados con valoraciones */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Productos Comprados</h2>
              
              {productosComprados.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No se encontraron productos en tus compras.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {productosComprados.map((producto) => (
                    <ProductoValoracion 
                      key={producto.id_producto}
                      producto={producto}
                      onValoracionEnviada={() => handleValoracionEnviada(producto.id_producto)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Historial de compras */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de Compras</h2>
              <div className="space-y-4">
                {compras.map((compra) => (
                  <div
                    key={compra.id_compra}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Compra #{compra.id_compra}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FaCalendar className="w-4 h-4 mr-1" />
                          {formatearFecha(compra.createdAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-lg font-semibold text-gray-900">
                          <FaDollarSign className="w-4 h-4 mr-1" />
                          {formatearPrecio(compra.total)}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          compra.estado === 'completada' 
                            ? 'bg-green-100 text-green-800'
                            : compra.estado === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {compra.estado}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Facturación: {compra.facturacion}</span>
                        <span>Estado: {compra.estado}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para mostrar un producto con su valoración
const ProductoValoracion = ({ producto, onValoracionEnviada }) => {
  const {
    valoraciones,
    loading: loadingValoraciones,
    puedeValorar,
    valoracionUsuario,
    submitting,
    promedioValoraciones,
    enviarValoracion
  } = useValoraciones(producto.id_producto);

  const handleSubmitValoracion = async (valoracionData) => {
    try {
      await enviarValoracion(valoracionData);
      alert(valoracionUsuario ? 'Valoración actualizada exitosamente' : 'Valoración enviada exitosamente');
      onValoracionEnviada();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start space-x-4">
        {/* Imagen del producto */}
        <div className="flex-shrink-0">
          <img
            src={producto.imagen_producto || '/placeholder-product.jpg'}
            alt={producto.nombre_producto}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>

        {/* Información del producto */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {producto.nombre_producto}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Comprado el {new Date(producto.fecha_compra).toLocaleDateString('es-CL')}
          </p>
          
          {/* Promedio de valoraciones */}
          {valoraciones.length > 0 && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(promedioValoraciones)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {promedioValoraciones.toFixed(1)} ({valoraciones.length} valoraciones)
              </span>
            </div>
          )}

          {/* Formulario de valoración */}
          {puedeValorar && (
            <div className="mt-4">
              <ValoracionForm
                onSubmit={handleSubmitValoracion}
                valoracionExistente={valoracionUsuario}
                submitting={submitting}
                puedeValorar={puedeValorar}
              />
            </div>
          )}

          {/* Mensaje si no puede valorar */}
          {!puedeValorar && !loadingValoraciones && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Ya has valorado este producto o no cumples los requisitos para valorarlo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisCompras; 