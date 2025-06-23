import React from "react";

const ProductoCard = ({ producto, onEditar, onEliminar }) => {
  return (
    <div className="border rounded-lg p-4 shadow flex flex-col gap-2 bg-white">
      <div>
        <h3 className="text-lg font-semibold">{producto.nombre}</h3>
        <p className="text-sm text-gray-600">{producto.descripcion}</p>
        <p className="text-sm">Precio: ${producto.precio}</p>
        <p className="text-sm">Stock: {producto.stock}</p>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onEditar(producto)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
        >
          Editar
        </button>
        <button
          onClick={() => onEliminar(producto.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductoCard;
