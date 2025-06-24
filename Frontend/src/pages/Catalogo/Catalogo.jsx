import useProductosDispo from "../../hooks/productos/useProductosDispo";
import CardProducto from "../../components/CardCatalogo.jsx";
import { useCart } from "../../context/CartContext.jsx"; // ✅ Importa el contexto

const Catalogo = () => {
  const { productosDisponibles, loading } = useProductosDispo();
  const { addItemToCart } = useCart(); // ✅ Usa el contexto

  const handleAddToCart = (producto) => {
    if (!producto) return;
    
    const item = {
      id: producto.id_producto,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1, // Cantidad por defecto
      imagen: producto.imagen,
      categoria: producto.categoria,
      stock: producto.stock,
    };
    
    addItemToCart(item); // ✅ Agrega al carrito usando el contexto
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