import './App.css'

function Catalogo() {
    return (
        <div className="container">
        <header className="header">
            <h1>Artesanías en Madera</h1>
            <nav>
            <a href="#productos">Productos</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#contacto">Contacto</a>
            </nav>
        </header>
            
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
            <h3>Contacto</h3>
            <p>📞 +56 9 1234 5678</p>
            <p>📧
            </p>
        </section>
        </div>
    )
}
export default Catalogo;