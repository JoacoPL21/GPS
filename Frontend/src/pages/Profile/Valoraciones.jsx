import React, { useState } from 'react';
import { useProductosCompradosConValoracion } from '../../hooks/valoraciones/useProductosComprados.js';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

const Valoraciones = () => {
  const { pendientes, realizados, loading, error } = useProductosCompradosConValoracion();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Mis Valoraciones</h2>
        <p className="text-gray-500">Gestiona las valoraciones de tus productos comprados</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border-gray-400 p-6 flex items-center gap-3">
          <FaClock className="w-8 h-8 text-orange-500" />
          <div>
            <div className="text-2xl font-bold">{pendientes.length}</div>
            <p className="text-sm text-gray-500">Pendientes</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border-gray-400 p-6 flex items-center gap-3">
          <FaCheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <div className="text-2xl font-bold">{realizados.length}</div>
            <p className="text-sm text-gray-500">Realizadas</p>
          </div>
        </div>
      </div>

      {/* Tabs visuales con animación */}
      <div className="w-full bg-white mb-6 relative">
        <div className="grid grid-cols-2 border-gray-400 rounded-lg overflow-hidden relative">
          {/* Highlight animado sólido */}
          <div
            className="absolute top-0 left-0 h-full w-1/2 transition-transform duration-300 ease-in-out z-0 rounded-lg bg-[#A47048]"
            style={{
              transform: activeTab === 'pending' ? 'translateX(0%)' : 'translateX(100%)',
              transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
          <button
            className={`relative z-10 flex items-center justify-center gap-2 py-3 font-medium transition w-full ${activeTab === 'pending' ? 'text-white' : 'text-[#A47048]'}`}
            onClick={() => setActiveTab('pending')}
          >
            <FaClock className="w-4 h-4" /> Pendientes ({pendientes.length})
          </button>
          <button
            className={`relative z-10 flex items-center justify-center gap-2 py-3 font-medium transition w-full ${activeTab === 'completed' ? 'text-white' : 'text-[#A47048]'}`}
            onClick={() => setActiveTab('completed')}
          >
            <FaCheckCircle className="w-4 h-4" /> Realizadas ({realizados.length})
          </button>
        </div>
      </div>

      {/* Contenido de tabs */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">Cargando productos...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : activeTab === 'pending' ? (
        <div className="space-y-6">
          {pendientes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border-gray-400 p-6 text-center">
              <FaCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">¡Excelente!</p>
              <p className="text-gray-500">No tienes productos pendientes de valorar.</p>
            </div>
          ) : (
            pendientes.map((item) => (
              <div key={item.id_producto + '-' + item.id_compra} className="bg-white rounded-lg shadow-sm border-gray-400 p-6 flex flex-col md:flex-row gap-4">
                {/* Imagen del producto */}
                <div className="flex-shrink-0">
                  <img
                    src={item.imagen || item.imagen_producto || '/images/imagenotfound.png'}
                    alt={item.nombre_producto}
                    className="w-20 h-20 object-cover rounded-lg border-gray-400"
                  />
                </div>
                {/* Contenido principal */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{item.nombre_producto}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {item.categoria && <span className="bg-gray-100 rounded px-2 py-1">{item.categoria}</span>}
                        <span>•</span>
                        <span>Compra #{item.id_compra}</span>
                        {item.precio_unitario && <><span>•</span><span className="font-medium">${item.precio_unitario}</span></>}
                      </div>
                    </div>
                    <span className="inline-block px-3 py-1 text-xs rounded border border-orange-500 text-orange-600 font-medium">Pendiente</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FaCalendarAlt className="w-4 h-4" />
                    Comprado el {formatDate(item.fecha_compra)}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-gray-500">¿Qué te pareció este producto?</div>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 bg-[#A47048] text-white rounded hover:bg-[#8a5a36] font-medium transition-colors"
                        onClick={() => navigate(`/profile/valoraciones/valorar/${item.id_producto}`)}
                      >Escribir valoración</button>
                      <button
                        className="px-4 py-2 border border-[#A47048] text-[#A47048] rounded hover:bg-[#FFF8F0] font-medium transition-colors"
                        onClick={() => navigate(`/producto/${item.id_producto}`)}
                      >Ver producto</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {realizados.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <FaStar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Sin valoraciones</p>
              <p className="text-gray-500">Aún no has valorado ningún producto.</p>
            </div>
          ) : (
            realizados.map((review) => (
              <div key={review.id_producto + '-' + review.id_compra} className="bg-white rounded-lg shadow-sm border-gray-400 p-6 flex flex-col md:flex-row gap-4">
                {/* Imagen del producto */}
                <div className="flex-shrink-0">
                  <img
                    src={review.imagen || review.imagen_producto || '/images/imagenotfound.png'}
                    alt={review.nombre_producto}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
                {/* Contenido principal */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{review.nombre_producto}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {review.categoria && <span className="bg-gray-100 rounded px-2 py-1">{review.categoria}</span>}
                        <span>•</span>
                        <span>Compra #{review.id_compra}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 bg-[#A47048] text-white rounded hover:bg-[#8a5a36] font-medium transition-colors"
                        onClick={() => navigate(`/profile/valoraciones/valorar/${review.id_producto}`)}
                      >Editar reseña</button>
                      <button
                        className="px-4 py-2 border border-[#A47048] text-[#A47048] rounded hover:bg-[#FFF8F0] font-medium transition-colors"
                        onClick={() => navigate(`/producto/${review.id_producto}`)}
                      >Ver producto</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {renderStars(review.valoracion?.puntuacion || 0)}
                      <span className="ml-2 font-medium">{review.valoracion?.puntuacion || 0}/5</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FaCalendarAlt className="w-4 h-4" />
                      {formatDate(review.valoracion?.updatedAt || review.fecha_compra)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm leading-relaxed">{review.valoracion?.descripcion}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Valoraciones; 