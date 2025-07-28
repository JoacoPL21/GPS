import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#a47148] to-[#8c5d3d] text-amber-50 py-16">
      <div className="container mx-auto px-6">
        {/* Sección principal */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Columna de la empresa */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-3 text-amber-100">
                Maderas Los Álamos
              </h3>
              <p className="text-amber-200 text-lg leading-relaxed max-w-md">
                  Especialistas en madera y artesanías desde la octava región.
                  <br />
                <span className="text-amber-300 font-medium">Calidad y piezas trabajadas a mano.</span>
              </p>
            </div>
            
            {/* Redes sociales */}
            <div className="flex items-center space-x-4">
              <span className="text-amber-200 font-medium">Síguenos:</span>
              <a
                href="https://www.facebook.com/madera.losalamos?rdid=QMZl0Aor9EG7txuI&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1JXn4SAbbr%2F#"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-amber-700/30 hover:bg-amber-600 rounded-full p-3 transition-all duration-300 hover:scale-110"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-amber-200 group-hover:text-white"
                >
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.408 24 22.674V1.326C24 .592 23.405 0 22.675 0"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna de servicios */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-100 border-b border-amber-700/50 pb-2">
              Nuestros Servicios
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/envios" 
                  className="text-amber-200 hover:text-amber-100 transition-colors duration-200 flex items-center group !text-amber-200 hover:!text-amber-100"
                >
                  <svg className="w-4 h-4 mr-2 text-amber-200 group-hover:text-amber-100 group-hover:translate-x-1 transition-all duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-amber-200 group-hover:text-amber-100">Envíos</span>
                </Link>
              </li>
              <li className="text-amber-200 flex items-center">
                <svg className="w-4 h-4 mr-2 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span className="text-amber-200">Devoluciones</span>
              </li>
              <li className="text-amber-200 flex items-center">
                <svg className="w-4 h-4 mr-2 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-amber-200">Garantía</span>
              </li>
            </ul>
          </div>

          {/* Columna de contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-100 border-b border-amber-700/50 pb-2">
              Contáctanos
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="bg-amber-700/30 rounded-full p-2 mt-0.5">
                  <svg className="w-4 h-4 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-amber-200 text-sm leading-relaxed">
                    Los Acacios 589<br />
                    Villa San Pedro, Los Álamos
                  </p>
                </div>
              </li>
              
              <li className="flex items-center space-x-3">
                <div className="bg-amber-700/30 rounded-full p-2">
                  <svg className="w-4 h-4 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <a 
                  href="tel:+56986692555" 
                  className="text-amber-200 hover:text-amber-100 transition-colors duration-200 !text-amber-200 hover:!text-amber-100"
                >
                  +569 86692555
                </a>
              </li>
              
              <li className="flex items-center space-x-3">
                <div className="bg-amber-700/30 rounded-full p-2">
                  <svg className="w-4 h-4 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <a 
                  href="mailto:ventasmaderalosalamos@gmail.com" 
                  className="text-amber-200 hover:text-amber-100 transition-colors duration-200 text-sm break-all !text-amber-200 hover:!text-amber-100"
                >
                  ventasmaderalosalamos@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria decorativa */}
        <div className="my-12">
          <div className="flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
            <div className="px-4">
              <svg className="w-6 h-6 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="text-center">
          <p className="text-amber-300/80 text-sm">
            &copy; {new Date().getFullYear()} <span className="font-medium text-amber-200">Maderas Los Álamos</span>. 
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;