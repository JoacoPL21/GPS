import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProductosDispo from "../../hooks/productos/useProductosDispo";
import Carrito from '../Carrito/CarritoFunction'; 
import { useCarrito } from '../../components/CartProvider';

const Catalogo = () => {
  const { productosDisponibles, loading } = useProductosDispo();
  const { agregarAlCarrito } = useCarrito();
    console.log("productosDisponibles:", productosDisponibles); // <-- Agregado

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="header mb-10">
        <h1 className="text-4xl font-bold text-center text-gray-800">Artesanías de Madera</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">Cargando productos...</p>
        ) : productosDisponibles && productosDisponibles.length > 0 ? (
          productosDisponibles.map((producto) => (
            <div
              key={producto.id_producto}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center"
            >
              <Link to={`/producto/${producto.id}`} className="w-full">
                <img
                  src={`http://localhost:3000/uploads/${producto.imagen}`}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h2 className="text-lg font-semibold text-black text-center">{producto.nombre}</h2>
              </Link>
              <p className="text-gray-600 mt-2 mb-4">
                ${producto.precio != null ? producto.precio.toLocaleString() : 'Precio no disponible'}
              </p>
              <button
                onClick={() => agregarAlCarrito(producto)} // <-- agrega producto al carrito
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center transition-colors"
              >
                <ShoppingCart className="mr-2 w-4 h-4" /> Agregar
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No hay productos disponibles.</p>
        )}
      </div>

      <section id="nosotros" className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">Sobre Nosotros</h3>
        <p>
          Somos una empresa familiar dedicada a la creación de artesanías con madera local chilena.
          Cada pieza es elaborada con amor y respeto por la naturaleza.
        </p>
      </section>

      <section id="contacto">
        <h3 className="text-2xl font-semibold mb-2">Contacto</h3>
        <p>📞 +56 9 1234 5678</p>
        <p>📧 contacto@artesaniamadera.cl</p>
      </section>

      <Carrito /> {/* <-- Carrito flotante */}
    </div>
  );
};

export default Catalogo;