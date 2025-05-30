import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/5 bg-yellow-900 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-9xl font-bold text-white mb-2">404</div>
              <div className="text-2xl font-semibold text-white">Página no encontrada</div>
            </div>
          </div>
          
          <div className="md:w-3/5 p-8 md:p-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
                ¡Ups! Algo falta...
              </h1>
              
              <div className="mb-8">
                <p className="text-lg text-gray-600 mb-4">
                  Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                <p className="text-lg text-gray-600">
                  Mientras tanto, aquí hay algunas cosas que puedes hacer:
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                <div 
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-yellow-800 hover:bg-yellow-900 rounded-lg shadow-md transition duration-300 cursor-pointer"
                  onClick={handleGoHome}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  Volver al inicio
                </div>
                
                <div 
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-yellow-800 hover:bg-yellow-900 rounded-lg shadow transition duration-300 cursor-pointer"
                  onClick={handleGoBack}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Volver atrás
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-600 mb-3">¿Necesitas ayuda? Contáctanos:</p>
                <div className="flex justify-center gap-4">
                  <p  className="text-yellow-800 hover:text-yellow-900 transition">
                    <svg className="w-6 h-6 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    soporte@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;