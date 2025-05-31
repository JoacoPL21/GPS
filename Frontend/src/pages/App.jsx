import './../styles/App.css'
import { Link } from 'react-router-dom'
import ContactSection from './Contact/contact_us'

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Artesanías en Madera</h1>
        <nav>
           <Link to="/productos">Productos</Link>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
          <Link to="/cart">Carrito</Link>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/register">Registrarse</Link>
        </nav>
      </header>

      <section className="hero">
        <h2>Hecho a mano con dedicación</h2>
        <p>Descubre nuestras piezas únicas de artesanía en madera.</p>
        <button>Ver catálogo</button>
      </section>

      <section id="productos" className="productos">
        <h3>Productos Destacados</h3>
        <div className="producto-lista">
          <div className="producto">
            <img src="/images/picaro.jpg" alt="Producto 1" className='image' />
            <h4>Artesania Tipica</h4>
            <p>$12.000 CLP</p>
          </div>
          <div className="producto">
            <img src="/images/tung.png" alt="Producto 2" className='image' />
            <h4>Juguete de Madera</h4>
            <p>$8.500 CLP</p>
          </div>
          <div className="producto">
            <img src="/images/tralalero.jpg" alt="Producto 3" className='image' />
            <h4>Tralalero Decorativo</h4>
            <p>$18.000 CLP</p>
          </div>
        </div>
      </section>

      <section id="nosotros" className="nosotros">
        <h3>Sobre Nosotros</h3>
        <p>
          Somos una empresa familiar dedicada a la creación de artesanías con madera local chilena.
          Cada pieza es elaborada con amor y respeto por la naturaleza.
        </p>
      </section>

      <section id="contacto" className="contacto">
      <ContactSection />
      </section>

      <footer className="footer">
        © 2025 Artesanías en Madera. Todos los derechos reservados.
      </footer>
    </div>
  )
}

export default App
