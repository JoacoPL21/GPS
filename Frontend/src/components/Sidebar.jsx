import '../styles/Sidebar.css';

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
          <li><a href="#" onClick={toggle} className="sidebar_text hover:underline">Inicio</a></li>
          <li><a href="/catalogo" onClick={toggle} className="sidebar_text hover:underline">Catálogo</a></li>
          <li><a href="#nosotros" onClick={toggle} className="sidebar_text hover:underline">Nosotros</a></li>
          <li><a href="#contacto" onClick={toggle} className="sidebar_text hover:underline">Contacto</a></li>
          <li><a href="/login" onClick={toggle} className="sidebar_text hover:underline">Iniciar Sesión</a></li>
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
