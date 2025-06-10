
import './../styles/App.css';
import { Link } from 'react-router-dom';
import { Sling as Hamburger } from 'hamburger-react';
import { useState, useEffect } from 'react'; // <-- importamos useEffect
import Sidebar from '../components/Sidebar';
import ContactSection from './Contact/contact_us'


function App() {
  const [isOpen, setOpen] = useState(false);
  // Evitar scroll al abrir el sidebar
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggle={() => setOpen(false)} />
      {/* Navbar sticky */}
      <header className="navbar_md sticky top-0 bg-white shadow z-40 p-4">
  <div className="relative flex items-center justify-center">
    {/* Botón hamburguesa siempre visible a la izquierda */}
    <div className="absolute left-4 z-30">
      <Hamburger toggled={isOpen} toggle={setOpen} />
    </div>

    {/* Título centrado */}
    <h1 className="text-xl font-bold">Maderas Lemaco</h1>

    {/* Menú oculto en pantallas pequeñas, visible a partir de md */}
    <nav className="hidden md:flex absolute right-4 gap-4">
      <Link to="/login" className="navbar_text">Iniciar Sesión</Link>
      <Link to="/cart" className="navbar_text">Carrito</Link>
      <Link to='/logout' className="navbar_text">Cerrar Sesión</Link>
    </nav>
  </div>
</header>
      {/* Contenido principal */}
      <main className="p-4">
        <section className="hero mb-8">
          <h2 className="text-2xl font-bold mb-2">Hecho a mano con dedicación</h2>
          <p className="mb-4">Descubre nuestras piezas únicas de artesanía en madera.</p>
          <button className="bg-[#a47148] text-white py-2 px-4 rounded hover:bg-[#8a5e3c]">
            Ver catálogo
          </button>
        </section>

        <section id="productos" className="productos mb-12">
          <h3 className="text-xl font-bold mb-4">Productos Destacados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="producto text-center">
              <img src="/images/picaro.jpg" alt="Producto 1" className="w-full h-64 object-cover" />
              <h4 className="mt-2 font-semibold">Artesanía Típica</h4>
              <p>$12.000 CLP</p>
            </div>
            <div className="producto text-center">
              <img src="/images/tung.png" alt="Producto 2" className="w-full h-64 object-cover" />
              <h4 className="mt-2 font-semibold">Juguete de Madera</h4>
              <p>$8.500 CLP</p>
            </div>
            <div className="producto text-center">
              <img src="/images/tralalero.jpg" alt="Producto 3" className="w-full h-64 object-cover" />
              <h4 className="mt-2 font-semibold">Tralalero Decorativo</h4>
              <p>$18.000 CLP</p>
            </div>
          </div>
        </section>

        <section id="nosotros" className="nosotros mb-12">
          <h3 className="text-xl font-bold mb-2">Sobre Nosotros</h3>
          <p>
            Somos una empresa familiar dedicada a la creación de artesanías con madera local chilena.
            Cada pieza es elaborada con amor y respeto por la naturaleza.
          </p>
        </section>

      <section id="contacto" className="contacto">
      <ContactSection />
      </section>
      </main>

      <footer className="footer bg-gray-100 text-center py-4">
        © 2025 Artesanías en Madera. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default App;
