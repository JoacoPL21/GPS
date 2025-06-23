import ContactSection from '../Contact/contact_us';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaHandSparkles, FaTree, FaTools, FaPalette } from 'react-icons/fa';

function Homepage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, src: "/images/picaro.jpg", alt: "Artesanía Típica" },
    { id: 2, src: "/images/tung.png", alt: "Juguete de Madera" },
    { id: 3, src: "/images/tralalero.jpg", alt: "Tralalero Decorativo" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Características de la tienda
  const features = [
    {
      icon: <FaHandSparkles className="text-3xl mb-2" style={{ color: "#FFF" }} />,
      title: "Artesanales"
    },
    {
      icon: <FaTree className="text-3xl mb-2" style={{ color: "#FFF" }} />,
      title: "Madera de Calidad"
    },
    {
      icon: <FaTools className="text-3xl mb-2" style={{ color: "#FFF" }} />,
      title: "Hechos a Mano"
    },
    {
      icon: <FaPalette className="text-3xl mb-2" style={{ color: "#FFF" }} />,
      title: "Personalizados"
    }
  ];

  return (
    <>
      {/* Carrusel */}
      <div className="relative w-full mb-8">
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Indicadores */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
          {slides.map((_, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                index === currentSlide ? "bg-yellow-600" : "bg-gray-300"
              }`}
              aria-current={index === currentSlide}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setCurrentSlide(index);
              }}
            ></div>
          ))}
        </div>

        {/* Control izquierdo */}
        <div
          role="button"
          tabIndex={0}
          className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={prevSlide}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") prevSlide();
          }}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-yellow-600">
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Anterior</span>
          </span>
        </div>

        {/* Control derecho */}
        <div
          role="button"
          tabIndex={0}
          className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={nextSlide}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") nextSlide();
          }}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-yellow-600">
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Siguiente</span>
          </span>
        </div>
      </div>
      

      {/* Sección de características */}
      <section className="features rounded-2xl min-w-full py-8 mb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-[#c9936f] py-10 rounded-lg shadow-sm hover:shadow-md hover:bg- transition-shadow"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Hero */}
      <section className="hero mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Hecho a mano con dedicación</h2>
        <p className="mb-4">
          Descubre nuestras piezas únicas de artesanía en madera.
        </p>
        <Link to="/catalogo">
          <div
            role="button"
            tabIndex={0}
            className="inline-block bg-[#a47148] text-white py-2 px-4 rounded hover:bg-[#8a5e3c] cursor-pointer"
          >
            Ver catálogo
          </div>
        </Link>
      </section>
      {/* Contacto */}
      <section id="contacto" className="contacto">
        <ContactSection />
      </section>
    </>
  );
}

export default Homepage;