import '../styles/Sidebar.css';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta si es necesario



export default function Sidebar({ isOpen, toggle }) {
  const { authUser } = useAuth(); // user.rol debe ser "admin" para mostrar el link

  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Sidebar */}
      <div
        className={`sidebar_sm fixed top-22 left-0 h-full w-64 bg-white text-white transform transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <ul className="p-6 space-y-4">
          <li><Link to="/" onClick={toggle} className="sidebar_text hover:underline">Inicio</Link></li>
          <li><Link to="/catalogo" onClick={toggle} className="sidebar_text hover:underline">Catálogo</Link></li>
          <li><Link to="/#nosotros" onClick={toggle} className="sidebar_text hover:underline">Nosotros</Link></li>
          <li><Link to="/#contacto" onClick={toggle} className="sidebar_text hover:underline">Contacto</Link></li>
          {!isAuthenticated && (
            <li>
              <Link to="/login" onClick={toggle} className="sidebar_text hover:underline">
                Iniciar Sesión
              </Link>
            </li>
          )}

          {authUser?.rol === "admin" && (
            <li>
              <a href="/productos" onClick={toggle} className="sidebar_text hover:underline">
                Productos
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* Fondo oscuro */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={toggle}
        />
      )}
    </>
  );
}