import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#a47148] text-amber-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-amber-100">Maderas Los Alamos</h3>
            <p className="text-amber-300 mb-4">
              Especialistas en muebles de madera artesanales. 
              <br />
              Calidad y tradición en cada pieza.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/madera.losalamos?rdid=QMZl0Aor9EG7txuI&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1JXn4SAbbr%2F#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-50 hover:bg-amber-800 rounded-full p-2 cursor-pointer transition-colors"
              >
                <span className="sr-only">Facebook</span>
                {/* Facebook SVG logo */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.408 24 22.674V1.326C24 .592 23.405 0 22.675 0"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <Link to="/catalogo" className="font-semibold mb-4 !text-amber-100">Productos</Link>
            <ul className="space-y-2 text-amber-300">
              <li>
                <Link to="#" className="text-base font-medium !text-amber-300 !no-underline">
                 Muebles
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base font-medium !text-amber-300 !no-underline">
                  Construcción
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base font-medium !text-amber-300 !no-underline">
                  Decoración
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber-100">Servicio</h4>
            <ul className="space-y-2 text-amber-300">
              <li>
                <Link to="/envios" className="text-base font-medium !text-amber-300 !no-underline">
                  Envíos
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base font-medium !text-amber-300 !no-underline">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base font-medium !text-amber-300 !no-underline">
                  Garantía
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber-100">Contacto</h4>
            <ul className="space-y-2 text-amber-300">
              <li>📍 Los Acacios 589 Villa San Pedro, Los Alamos</li>
              <li>📞 +569 86692555</li>
              <li>✉️  ventasmaderalosalamos@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-300">
          <p>&copy; {new Date().getFullYear()} Maderas Los Alamos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


