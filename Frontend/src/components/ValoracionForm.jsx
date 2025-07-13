import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ValoracionForm = ({ 
  onSubmit, 
  valoracionExistente = null, 
  submitting = false,
  puedeValorar = false 
}) => {
  const { authUser } = useAuth();
  const [puntuacion, setPuntuacion] = useState(valoracionExistente?.puntuacion || 0);
  const [descripcion, setDescripcion] = useState(valoracionExistente?.descripcion || '');
  const [hover, setHover] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (puntuacion === 0) {
      alert('Por favor selecciona una puntuación');
      return;
    }

    if (descripcion.trim().length < 10) {
      alert('La descripción debe tener al menos 10 caracteres');
      return;
    }

    onSubmit({
      puntuacion,
      descripcion: descripcion.trim()
    });
  };

  if (!authUser) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 text-center">
          Debes iniciar sesión para poder valorar este producto
        </p>
      </div>
    );
  }

  if (!puedeValorar) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-center">
          Solo puedes valorar productos que hayas comprado
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {valoracionExistente ? 'Editar tu valoración' : 'Valora este producto'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Estrellas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Puntuación *
          </label>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <FaStar
                  key={index}
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    (hover || puntuacion) >= ratingValue
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                  onClick={() => setPuntuacion(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {puntuacion > 0 ? `${puntuacion} estrella${puntuacion > 1 ? 's' : ''}` : 'Selecciona una puntuación'}
          </p>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
            Tu opinión *
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Comparte tu experiencia con este producto..."
            required
            minLength={10}
            maxLength={500}
          />
          <p className="text-sm text-gray-500 mt-1">
            {descripcion.length}/500 caracteres (mínimo 10)
          </p>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || puntuacion === 0 || descripcion.trim().length < 10}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              submitting || puntuacion === 0 || descripcion.trim().length < 10
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            {submitting ? 'Enviando...' : valoracionExistente ? 'Actualizar valoración' : 'Enviar valoración'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ValoracionForm; 