import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useProductosbyId from '../../hooks/productos/useProductosId';
import {useCart} from'../../context/CartContext.jsx';
const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

const Producto = () => {
  const { id_producto: id } = useParams();
  const { producto, loading } = useProductosbyId(id);
  const [cantidad, setCantidad] = useState(1);

  const {addItemToCart} = useCart();

  const handleClickAddToCart = (producto) => {
    if (!producto) return;
    const item = {
      id: producto.id_producto,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
      imagen: producto.imagen,
      categoria: producto.categoria,
      stock: producto.stock,
    };
    addItemToCart(item);
    setCantidad(1); // Reset cantidad after adding to cart

  };
    
  const aumentarCantidad = () => {
    if (producto && cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    }
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando producto...</p>;

  if (!producto) {
    return <p className="text-center mt-10">Producto no encontrado.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      
      <div>
        <img
          src={`${API_URL}/uploads/${producto.imagen}`}
          alt={producto.nombre}
          className="w-full h-[500px] object-cover rounded-2xl "
        />
      </div>
      <section className="hero mb-8 ">
      <div className="flex flex-col justify-start">
        <h1 className="text-6xl font-bold mb-4">{producto.nombre}</h1>
        <p className="text-3xl   mb-6">{producto.descripcion}</p>

        <div className="text-2xl font-bold text-green-700 mb-4">
          <p className="text-black-600 mb-6 font-semibold">
            {producto.precio.toLocaleString()} CLP
          </p>
        </div>
        <p className="text-black-600 mb-6 font-semibold">Categoría: {producto.categoria}</p>
        <p className="text-black-600 mb-6 font-semibold">Stock disponible: {producto.stock}</p>

        <div className="flex items-center mb-6">
          <span className="font-semibold ">Cantidad:</span>
          <div className="rounded-lg  px-3 py-1">
            <button
              onClick={disminuirCantidad}
              className="text-white font-bold px-2 text-lg"
            >
              -
            </button>
            <span className="px-4">{cantidad}</span>
            <button
              onClick={aumentarCantidad}
              className="text-white font-bold px-2 text-lg"
            >
              +
            </button>
            
          </div>
        </div>

        <button onClick={()=>{
          handleClickAddToCart(producto);
        }} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Agregar al carrito
        </button>
      </div>
      </section>
    </div>
  );
};

export default Producto;
