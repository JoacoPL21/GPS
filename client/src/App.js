import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>Artesanías de Madera</h1>
        <nav>
          <a href="#productos">Productos</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      <section className="hero">
        <h2>Bienvenido a nuestra tienda artesanal</h2>
        <p>Productos únicos, hechos a mano con amor y madera de calidad.</p>
      </section>

      <section className="productos" id="productos">
        <h2>Nuestros Productos</h2>
        <div className="producto-lista">
          <div className="producto">
            <img src="https://via.placeholder.com/200x200?text=Cuenco" alt="Cuenco artesanal" />
            <h3>Cuenco Artesanal</h3>
            <p>$25.00</p>
            <button>Agregar al carrito</button>
          </div>
          <div className="producto">
            <img src="https://via.placeholder.com/200x200?text=Juguete" alt="Juguete de madera" />
            <h3>Juguete de Madera</h3>
            <p>$18.00</p>
            <button>Agregar al carrito</button>
          </div>
          <div className="producto">
            <img src="https://via.placeholder.com/200x200?text=Caja" alt="Caja decorativa" />
            <h3>Caja Decorativa</h3>
            <p>$30.00</p>
            <button>Agregar al carrito</button>
          </div>
        </div>
      </section>

      <footer id="contacto">
        <h3>Contacto</h3>
        <p>Email: contacto@artesaniamadera.com</p>
        <p>Instagram: @artesaniamadera</p>
      </footer>
    </div>
  );
}

export default App;
