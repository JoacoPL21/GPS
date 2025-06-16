import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProductosDispo from "../../hooks/productos/useProductosDispo";
const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';
console.log(API_URL);
import { useCart } from '../../context/CartContext.jsx';

const Catalogo = () => {
const { productosDisponibles, loading } = useProductosDispo();
//desestructuramos el contexto del carrito
const { addItemToCart } = useCart();

const handleAddToCart = (producto) => {
  addItemToCart(producto);
  // Aquí podrías mostrar una notificación o mensaje de éxito
  console.log(`Producto ${producto.nombre} agregado al carrito`);
}


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">Cargando productos...</p>
        ) : productosDisponibles && productosDisponibles.length > 0 ? (
          productosDisponibles.map((producto) => (
            
            <div
              key={producto.id_producto}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center"
            >
              <Link to={`/producto/${producto.id_producto}`} className="w-full">
                <img
                  src={`${API_URL}/uploads/${producto.imagen}`}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h2 className="text-lg font-semibold text-black text-center">{producto.nombre}</h2>
              </Link>
              <p className="text-gray-600 mt-2 mb-4">
                ${producto.precio != null ? producto.precio.toLocaleString() : 'Precio no disponible'}
              </p>
              <button onClick={() => handleAddToCart(producto)}  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center transition-colors">
                <ShoppingCart className="mr-2 w-4 h-4" /> Agregar
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No hay productos disponibles.</p>
        )}
      </div>


    </div>
  );
};

export default Catalogo;