import { useParams } from 'react-router-dom';

const productosDisponibles = [
  {
    id: 1,
    nombre: 'Indio picaro',
    precio: 15000,
    stock: 10,
    categora: 'Artesanía',
    imagen: '/images/picaro.jpg',
    descripcion: 'Hecha a mano con madera de raulí.',
  },
  {
    id: 2,
    nombre: 'Escultura de roble',
    precio: 25000,
    stock: 5,
    categora: 'Escultura',
    imagen: '/images/tung.png',
    descripcion: 'Escultura de madera de roble, con acabado natural.',
  },
  {
    id: 3,
    nombre: 'Cuenco rústico',
    precio: 12000,
    stock: 8,
    categora: 'Decoración',
    imagen: '/images/tralalero.jpg',
    descripcion: 'Cuenco rústico para decoración o uso doméstico.',
  },
];

export default function ProductoInfo() {
  const { id } = useParams();
  const producto = productosDisponibles.find(p => p.id === parseInt(id));

  if (!producto) {
    return <p className="text-center mt-10">Producto no encontrado.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Imagen grande */}
      <div>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
        />
      </div>

      {/* Información del producto */}
      <div className="flex flex-col justify-start">
        <h1 className="text-4xl font-bold mb-4">{producto.nombre}</h1>
        <p className="text-gray-700 mb-6">{producto.descripcion}</p>
        
        <div className="text-2xl font-bold text-green-700 mb-4">
          ${producto.precio.toLocaleString()}
        </div>
        <p className="text-black-600 mb-6 font-semibold">Categoría: {producto.categora}</p>
        <p className="text-black-600 mb-6 font-semibold">Stock disponible: {producto.stock}</p>

        <div className="flex items-center gap-4 mb-6">
          <span className="font-semibold">Cantidad:</span>
          <div className="flex items-center  rounded-lg px-3 py-1">
            <button className="text-white font-bold px-2">-</button>
            <span className="px-4">1</span>
            <button className="text-white font-bold px-2">+</button>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
