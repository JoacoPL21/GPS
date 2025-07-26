// Frontend/src/pages/User/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/passwordReset.service.js';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validaciones
    if (!email.trim()) {
      setErrors({ email: 'El correo electrónico es obligatorio' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'El correo electrónico no es válido' });
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword(email);

      if (response.status === 'Success') {
        await Swal.fire({
          position: "center",
          icon: "success",
          title: "Solicitud enviada",
          text: response.message,
          showConfirmButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#a47148",
        });

        // Limpiar formulario
        setEmail('');
      } else {
        setErrors({ general: response.message });
      }
    } catch (error) {
      setErrors({ general: 'Error inesperado. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eee7] to-[#f0e6dd] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-gray-600">
              No te preocupes, te enviaremos un enlace para restablecerla
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

            {/* Campo de email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className={`peer w-full border-2 rounded-xl px-4 pt-4 pb-2 text-sm bg-white text-gray-900 focus:outline-none focus:border-[#a47148] transition-all
                  ${errors.email ? "border-red-500" : "border-gray-300"}`}
                disabled={loading}
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-2.5 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                  peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#a47148] transition-all duration-200"
              >
                Correo Electrónico
              </label>
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">{errors.email}</p>
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
                  Enviando...
                </div>
              ) : (
                'Enviar enlace de recuperación'
              )}
            </button>
          </form>

          {/* Enlaces */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              ¿Recordaste tu contraseña?{" "}
              <Link 
                to="/login" 
                className="text-[#a47148] hover:text-[#8c5d3d] font-medium hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link 
                to="/register" 
                className="text-[#a47148] hover:text-[#8c5d3d] font-medium hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;