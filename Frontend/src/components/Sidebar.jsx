import '../styles/Sidebar.css';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaTags, FaShoppingCart, FaHeart, FaUser, FaCreditCard, FaChartBar, FaUsers, FaTruck, FaStore, FaCog, FaSignOutAlt, FaBars, FaShoppingBag } from 'react-icons/fa';
import { useState } from 'react';

const customerMenu = [
  {
    title: 'Explorar',
    items: [
      { title: 'Inicio', url: '/', icon: <FaBoxOpen /> },
      { title: 'Catálogo', url: '/catalogo', icon: <FaTags /> },
    ],
  },
];

const adminMenu = [
  {
    title: 'Gestión',
    items: [
      { title: 'Gestión de Productos', url: '/productos', icon: <FaBoxOpen /> },
      { title: 'Gestión de Envíos', url: '/dashboard/admin-compras', icon: <FaTruck /> },
    ],
  },
];

export default function Sidebar({ isOpen, toggle }) {
  const { authUser } = useAuth();
  const [role, setRole] = useState(authUser?.rol === 'admin' ? 'admin' : 'customer');
  // Si el usuario es admin, puede alternar entre ambos menús. Si es cliente, solo ve el de cliente.
  const isAdmin = authUser?.rol === 'admin';
  const menu = isAdmin ? (role === 'admin' ? adminMenu : customerMenu) : customerMenu;
  // Determinar el estado de autenticación y datos del usuario
  const isAuthenticated = !!authUser;
  const userName = isAuthenticated ? authUser.nombreCompleto || 'Usuario' : 'Invitado';
  const userEmail = isAuthenticated ? authUser.email || 'usuario@email.com' : 'invitado@email.com';

  return (
    <>
      <div className={`fixed left-0 w-64 bg-white border-r border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ top: '72px', height: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column' }}>
        <div className="flex-1 flex flex-col justify-between h-full">
          <nav className="px-4 py-8">
            {menu
              .filter(section => !(role === 'customer' && section.title === 'Configuración'))
              .map(section => (
                <div key={section.title} className="mb-6">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2 pl-2 tracking-wider">{section.title}</div>
                  <ul className="space-y-1">
                    {section.items.map(item => (
                      <li key={item.title}>
                        <Link to={item.url} onClick={toggle} className="flex items-center gap-3 px-3 py-2 rounded-lg !text-gray-700 hover:bg-[#f5e1d4] transition-colors">
                          <span className="text-2xl !text-[#a47148]">{item.icon}</span>
                          <span className="text-base">{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </nav>
          {isAuthenticated && (
            <Link to="/profile" className="border-t border-gray-100 px-6 py-4 flex items-center gap-3 bg-[#fff8f0] cursor-pointer hover:bg-[#f5e1d4] transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#a47148] text-white font-bold text-xl">
                <FaUser />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 leading-tight">{userName}</span>
                <span className="text-xs text-gray-500">{userEmail}</span>
              </div>
            </Link>
          )}
        </div>
        {isAdmin && (
          <div className="px-6 py-4 mt-auto">
            <div className="relative flex w-full bg-gray-100 rounded-lg h-10 p-1 transition-colors items-center">
              <span
                className="absolute top-0 left-0 h-full w-1/2 rounded-md bg-[#a47148] transition-all duration-300 z-0"
                style={{
                  transform: role === 'admin' ? 'translateX(100%)' : 'translateX(0%)',
                  transition: 'transform 0.3s cubic-bezier(.4,1.5,.5,1)',
                }}
              />
              <button
                onClick={() => setRole('customer')}
                className={`relative z-10 flex-1 h-full rounded-md text-sm transition-colors ${role === 'customer' ? 'text-white' : 'text-gray-700'}`}
                style={{ background: 'transparent' }}
              >
                Cliente
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`relative z-10 flex-1 h-full rounded-md text-sm transition-colors ${role === 'admin' ? 'text-white' : 'text-gray-700'}`}
                style={{ background: 'transparent' }}
              >
                Admin
              </button>
            </div>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-40 z-30" onClick={toggle} />
      )}
    </>
  );
}