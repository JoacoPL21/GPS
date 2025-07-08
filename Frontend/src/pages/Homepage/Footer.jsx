import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#a47148] text-amber-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-amber-100">Artesanías en Madera</h3>
            <p className="text-amber-300 mb-4">
              Especialistas en muebles de madera artesanales desde 1995. Calidad y tradición en cada pieza.
            </p>
            <div className="flex space-x-4">
              <div className="text-amber-300 hover:text-amber-50 hover:bg-amber-800 rounded-full p-2 cursor-pointer transition-colors">
                <span className="sr-only">Facebook</span>
                <div className="w-5 h-5 bg-current rounded"></div>
              </div>
              <div className="text-amber-300 hover:text-amber-50 hover:bg-amber-800 rounded-full p-2 cursor-pointer transition-colors">
                <span className="sr-only">Instagram</span>
                <div className="w-5 h-5 bg-current rounded"></div>
              </div>
              <div className="text-amber-300 hover:text-amber-50 hover:bg-amber-800 rounded-full p-2 cursor-pointer transition-colors">
                <span className="sr-only">Twitter</span>
                <div className="w-5 h-5 bg-current rounded"></div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber-100">Productos</h4>
            <ul className="space-y-2 text-amber-300">
              <li>
                <Link to="#" className="text-base font-medium !text-amber-300 !no-underline">
                  Mesas
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base font-medium !text-amber-300 !no-underline">
                  Sillas
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base font-medium !text-amber-300 !no-underline">
                  Estanterías
                </Link>
              </li>
              <li>
                <Link to="#" className="text-base font-medium !text-amber-300 !no-underline">
                  Escritorios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber-100">Servicio</h4>
            <ul className="space-y-2 text-amber-300">
              <li>
                <Link to="#" className="text-base font-medium !text-amber-300 !no-underline">
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
              <li>
                <Link to="#" className="text-base font-medium !text-amber-300 !no-underline">
                  Soporte
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber-100">Contacto</h4>
            <ul className="space-y-2 text-amber-300">
              <li>📍 Av. Artesanos 123, Ciudad</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>✉️ info@artesaniasenmadera.com</li>
              <li>🕒 Lun-Vie: 9AM-6PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-300">
          <p>&copy; {new Date().getFullYear()} Artesanías en Madera. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


