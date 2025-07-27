import React, { useState, useEffect } from 'react';
import { FaTimes, FaStar, FaStarHalfAlt, FaRegStar, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const ValoracionModal = ({ producto, valoracionExistente, isOpen, onClose, onSubmit, submitting }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [descripcion, setDescripcion] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (valoracionExistente) {
      setPuntuacion(valoracionExistente.puntuacion || 0);
      setDescripcion(valoracionExistente.descripcion || '');
    } else {
      setPuntuacion(0);
      setDescripcion('');
    }
    setErrors({});
  }, [valoracionExistente, isOpen]);

  const handleStarClick = (star) => {
    setPuntuacion(star);
    setErrors(prev => ({ ...prev, puntuacion: null }));
  };

  const handleStarHover = (star) => {
    setHoveredStar(star);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleDescripcionChange = (e) => {
    const value = e.target.value;
    setDescripcion(value);
    if (value.length > 0) {
      setErrors(prev => ({ ...prev, descripcion: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (puntuacion === 0) {
      newErrors.puntuacion = 'Debes seleccionar una puntuación';
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = 'Debes escribir una descripción';
    } else if (descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    } else if (descripcion.trim().length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        puntuacion,
        descripcion: descripcion.trim()
      });
    }
  };

  const renderStars = () => {
    const stars = [];
    const maxStars = 5;
    const currentRating = hoveredStar || puntuacion;

    for (let i = 1; i <= maxStars; i++) {
      const starClass = i <= currentRating ? 'text-yellow-400' : 'text-gray-300';
      const starIcon = i <= currentRating ? <FaStar /> : <FaRegStar />;

      stars.push(
        <button
          key={i}
          type="button"
          className={`text-2xl transition-colors duration-200 hover:scale-110 ${starClass}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
        >
          {starIcon}
        </button>
      );
    }

    return stars;
  };

  const getPuntuacionText = () => {
    if (puntuacion === 0) return 'Selecciona una puntuación';
    if (puntuacion === 1) return 'Muy malo';
    if (puntuacion === 2) return 'Malo';
    if (puntuacion === 3) return 'Regular';
    if (puntuacion === 4) return 'Bueno';
    if (puntuacion === 5) return 'Excelente';
    return '';
  };

  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src={producto.imagen || '/images/imagenotfound.png'}
                alt={producto.nombre_producto}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/images/imagenotfound.png';
                }}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {valoracionExistente ? 'Editar valoración' : 'Escribir valoración'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{producto.nombre_producto}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={submitting}
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Puntuación */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Puntuación *
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                {renderStars()}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {getPuntuacionText()}
              </span>
            </div>
            {errors.puntuacion && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <FaExclamationTriangle className="w-4 h-4" />
                <span>{errors.puntuacion}</span>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-3">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Tu opinión *
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={handleDescripcionChange}
              placeholder="Comparte tu experiencia con este producto. ¿Qué te gustó o no te gustó? ¿Recomendarías este producto a otros?"
              className={`w-full h-32 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#A47048] focus:border-transparent ${
                errors.descripcion ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={submitting}
            />
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>
                {descripcion.length}/500 caracteres
              </span>
              {errors.descripcion && (
                <div className="flex items-center space-x-2 text-red-600">
                  <FaExclamationTriangle className="w-4 h-4" />
                  <span>{errors.descripcion}</span>
                </div>
              )}
            </div>
          </div>

          {/* Consejos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Consejos para una buena valoración:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Describe tu experiencia personal con el producto</li>
              <li>• Menciona aspectos específicos que te gustaron o no</li>
              <li>• Incluye información sobre la calidad, durabilidad, etc.</li>
              <li>• Sé honesto y constructivo en tu feedback</li>
            </ul>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-[#A47048] text-white rounded-lg hover:bg-[#8a5a36] transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="w-4 h-4" />
                <span>{valoracionExistente ? 'Actualizar' : 'Publicar'} valoración</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValoracionModal; 