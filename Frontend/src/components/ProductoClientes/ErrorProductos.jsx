import React from 'react';

const ErrorProductos = ({ message = "Ocurrió un error", onRetry }) => {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#a47148] to-[#8c5d3d] hover:from-[#946746] hover:to-[#7e5137] text-white transition-transform hover:scale-105 hover:shadow-lg"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorProductos;