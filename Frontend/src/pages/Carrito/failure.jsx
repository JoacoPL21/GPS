import React from 'react';
import { useNavigate } from 'react-router-dom';

const FailurePage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/5 bg-red-700 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">✕</div>
              <div className="text-xl font-semibold text-white">Error de pago</div>
            </div>
          </div>

          <div className="md:w-3/5 p-8 md:p-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
              ¡Ups! Algo salió mal...
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              No pudimos procesar tu pago. Intenta nuevamente o revisa tus datos.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleGoHome}
                className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-medium rounded-lg transition"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FailurePage;