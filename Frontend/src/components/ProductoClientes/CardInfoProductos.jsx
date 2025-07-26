import React from 'react';

const CardInfoProducto = ({ producto }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Características del Producto</h2>
          <p className="text-gray-600">Detalles técnicos y especificaciones</p>
        </div>

        <div className="mt-4 md:mt-0">
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Stock */}
        <Caracteristica
          iconPath="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          titulo="Stock"
          valor={`${producto.stock} unidades`}
        />

        {/* Precio */}
        <Caracteristica
          iconPath="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1 "
          titulo="Precio"
          valor={`$${producto.precio.toLocaleString()} CLP`}
        />

        {/* Estado */}
        <Caracteristica
          iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          titulo="Estado"
          valor={producto.stock > 0 ? "Disponible" : "Agotado"}
        />
        {/* Dimensiones */}
        <Caracteristica
          iconPath="M12 4v16m8-8H4m16 0a8 8 0 11-16 0 8 8 0 0116 0z"
          titulo="Dimensiones"
          valor={`${producto.alto} x ${producto.ancho} x ${producto.profundidad} cm`}
        />

      </div>
    </div>
    
  );
};

const Caracteristica = ({ iconPath, titulo, valor }) => (
  <div className="bg-[#f5eee7] p-6 rounded-xl text-center">
    <div className="w-12 h-12 bg-[#a47148] rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={iconPath}
        />
      </svg>
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">{titulo}</h3>
    <p className="text-[#a47148] font-medium">{valor}</p>
  </div>
)

export default CardInfoProducto;
