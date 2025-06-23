import '../styles/Sidebar.css';
import { Link } from 'react-router-dom';


export default function Sidebar({ isOpen, toggle }) {
  return (
    <>
      {/* Sidebar */}
      <div
        className={`sidebar_sm fixed top-22 left-0 h-full w-64 bg-white text-white transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ul className="p-6 space-y-4">
          <li><Link to="/" onClick={toggle} className="sidebar_text hover:underline">Inicio</Link></li>
          <li><Link to="/catalogo" onClick={toggle} className="sidebar_text hover:underline">Catálogo</Link></li>
          <li><Link to="/#nosotros" onClick={toggle} className="sidebar_text hover:underline">Nosotros</Link></li>
          <li><Link to="/#contacto" onClick={toggle} className="sidebar_text hover:underline">Contacto</Link></li>
          <li><Link to="/login" onClick={toggle} className="sidebar_text hover:underline">Iniciar Sesión</Link></li>
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