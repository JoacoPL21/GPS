// Frontend/src/pages/User/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../services/passwordReset.service.js';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (!urlToken) {
      Swal.fire({
        icon: 'error',
        title: 'Token inválido',
        text: 'El enlace de recuperación no es válido o ha expirado.',
        confirmButtonColor: '#a47148'
      }).then(() => {
        navigate('/login');
      });
    } else {
      setToken(urlToken);
    }
  }, [searchParams, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Validación en tiempo real para confirmación de contraseña
    if (name === 'confirmPassword' && value !== formData.newPassword) {
      setErrors({
        ...errors,
        confirmPassword: 'Las contraseñas no coinciden'
      });
    } else if (name === 'confirmPassword' && value === formData.newPassword) {
      setErrors({
        ...errors,
        confirmPassword: ''
      });
    }

    if (name === 'newPassword' && formData.confirmPassword && value !== formData.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: 'Las contraseñas no coinciden'
      });
    } else if (name === 'newPassword' && formData.confirmPassword && value === formData.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'La nueva contraseña es obligatoria';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    } else if (formData.newPassword.length > 20) {
      newErrors.newPassword = 'La contraseña no puede tener más de 20 caracteres';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Debes confirmar tu nueva contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, formData.newPassword);

      if (response.status === 'Success') {
        await Swal.fire({
          position: "center",
          icon: "success",
          title: "Contraseña restablecida",
          text: response.message,
          showConfirmButton: true,
          confirmButtonText: "Ir al login",
          confirmButtonColor: "#a47148",
        });

        navigate('/login');
      } else {
        setErrors({ general: response.message });
      }
    } catch (error) {
      setErrors({ general: 'Error inesperado. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5eee7] to-[#f0e6dd] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#a47148] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eee7] to-[#f0e6dd] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Crear nueva contraseña
            </h2>
            <p className="text-gray-600">
              Ingresa tu nueva contraseña segura
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Nueva contraseña */}
            <div className="relative">
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder=""
                className={`peer w-full border-2 rounded-xl px-4 pt-4 pb-2 text-sm bg-white text-gray-900 focus:outline-none focus:border-[#a47148] transition-all
                  ${errors.newPassword ? "border-red-500" : "border-gray-300"}`}
                disabled={loading}
              />
              <label
                htmlFor="newPassword"
                className="absolute left-3 -top-2.5 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                  peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#a47148] transition-all duration-200"
              >
                Nueva Contraseña
              </label>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-2">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder=""
                className={`peer w-full border-2 rounded-xl px-4 pt-4 pb-2 text-sm bg-white text-gray-900 focus:outline-none focus:border-[#a47148] transition-all
                  ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                disabled={loading}
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-3 -top-2.5 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                  peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#a47148] transition-all duration-200"
              >
                Confirmar Nueva Contraseña
              </label>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-2">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#a47148] hover:bg-[#8c5d3d] hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Restableciendo...
                </div>
              ) : (
                'Restablecer contraseña'
              )}
            </button>
          </form>

          {/* Enlace de vuelta */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-[#a47148] hover:text-[#8c5d3d] font-medium hover:underline text-sm"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;