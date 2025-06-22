
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

const CardCatalogo = ({ producto, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
      <Link to={`/producto/${producto.id_producto}`} className="w-full">
        <img
          src={`${API_URL}/uploads/${producto.imagen}`}
          alt={producto.nombre}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
        <h2 className="text-lg font-semibold text-black text-center">
          {producto.nombre}
        </h2>
      </Link>
      <p className="text-gray-600 mt-2 mb-4">
        ${producto.precio != null ? producto.precio.toLocaleString() : 'Precio no disponible'}
      </p>
      <button
        onClick={() => onAddToCart(producto)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center transition-colors"
      >
        <ShoppingCart className="mr-2 w-4 h-4" /> Agregar
      </button>
    </div>
  );
};

export default CardCatalogo;
