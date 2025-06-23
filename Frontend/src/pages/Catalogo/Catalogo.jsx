import { useCart } from '../../context/CartContext.jsx';
import useProductosDispo from "../../hooks/productos/useProductosDispo";
import CardProducto from "../../components/CardCatalogo.jsx";

const Catalogo = () => {
  const { productosDisponibles, loading } = useProductosDispo();
  const { addItemToCart } = useCart();
  console.log("Pruebas de pull request automatico")

  const handleAddToCart = (producto) => {
    addItemToCart(producto);
    console.log(`Producto ${producto.nombre} agregado al carrito`);
  };

  return (
    <div className="p-8 max-w-3xl ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">Cargando productos...</p>
        ) : productosDisponibles && productosDisponibles.length > 0 ? (
          productosDisponibles.map((producto) => (
            <CardProducto
              key={producto.id_producto}
              producto={producto}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No hay productos disponibles.</p>
        )}
      </div>  
    </div>
  );
};

export default Catalogo;
