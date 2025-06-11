import ContactSection from '../Contact/contact_us';

function Homepage() {
  return (
    <>
      <section className="hero mb-8">
        <h2 className="text-2xl font-bold mb-2">Hecho a mano con dedicación</h2>
        <p className="mb-4">Descubre nuestras piezas únicas de artesanía en madera.</p>
        <a href="/catalogo">
          <button className="bg-[#a47148] text-white py-2 px-4 rounded hover:bg-[#8a5e3c]">
            Ver catálogo
          </button>
        </a>
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
    </>
  );
}

export default Homepage;