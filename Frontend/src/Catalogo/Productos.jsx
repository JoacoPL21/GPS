
import { ShoppingCart } from 'lucide-react';
const productosDisponibles = [
    {
        id: 1,
        nombre: 'Caja tallada a mano',
        precio: 15000,
        imagen: '/images/picaro.jpg',
    },
    {
        id: 2,
        nombre: 'Escultura de roble',
        precio: 25000,
        imagen: '/images/tung.png',
    },
    {
        id: 3,
        nombre: 'Cuenco rústico',
        precio: 12000,
        imagen: '/images/tralalero.jpg',
    },
];


export default function Productos() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
        <header className="header">
           <h1 className="text-3xl font-bold mb-6 text-center">Artesanías de Madera</h1>
            <nav>
            <a href="#productos">Productos</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#contacto">Contacto</a>
            </nav>
        </header>
        
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {productosDisponibles.map((producto) => (
          <div
            key={producto.id}
            className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center"
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
            <h2 className="text-xl font-semibold">{producto.nombre}</h2>
            <p className="text-gray-600 mb-4">${producto.precio.toLocaleString()}</p>
                <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center transition-colors"
            >
              <ShoppingCart className="mr-2 w-4 h-4" /> Agregar
            </button>
          </div>
        ))}
      </div>   
  
        <section id="nosotros" className="nosotros">
            <h3>Sobre Nosotros</h3>
            <p>
            Somos una empresa familiar dedicada a la creación de artesanías con madera local chilena.
            Cada pieza es elaborada con amor y respeto por la naturaleza.
            </p>
        </section>
    
        <section id="contacto" className="contacto">
            <h3>Contacto</h3>
            <p>📞 +56 9 1234 5678</p>
            <p>📧
            </p>
        </section>
        </div>
    )
}
