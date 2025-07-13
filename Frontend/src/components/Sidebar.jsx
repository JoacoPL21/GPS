import '../styles/Sidebar.css';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta si es necesario
import { Link } from 'react-router-dom';



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
          {authUser?.rol === "admin" && (
            <h2 className="text-center text-lg font-bold text-gray-500">Cliente</h2>
          )}
          <li><Link to="/" onClick={toggle} className="sidebar_text hover:underline">Inicio</Link></li>
          <li><Link to="/catalogo" onClick={toggle} className="sidebar_text hover:underline">Catálogo</Link></li>
          <li><Link to="/#nosotros" onClick={toggle} className="sidebar_text hover:underline">Nosotros</Link></li>
          <li><Link to="/#contacto" onClick={toggle} className="sidebar_text hover:underline">Contacto</Link></li>
          {authUser?.rol === "admin" && (
            <h2 className="text-center text-lg font-bold mt-10 text-gray-500">Administración</h2>
          )}

          {authUser?.rol === "admin" && (
            <li>
              <Link to="/productos" onClick={toggle} className="sidebar_text hover:underline">Productos</Link>
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