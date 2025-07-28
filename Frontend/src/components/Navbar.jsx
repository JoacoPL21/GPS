import { Sling as Hamburger } from "hamburger-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaBus,FaUserCircle, FaChevronUp, FaChevronDown, FaShoppingCart, FaShoppingBag, FaUser, FaSignOutAlt, FaStar, FaRegUser, FaSignInAlt, FaUserPlus, FaUserAlt, FaUserTie } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import MenuCarrito from "../pages/Carrito/CarritoFunction";

function Navbar({ isOpen, setOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openCarrito, setOpenCarrito] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar_md sticky top-0 bg-white shadow z-40 p-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute left-4 z-30">
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
        <Link to="/" className="cursor-pointer">
        <h1 className="text-xl font-bold text-amber-950">Maderas Los Álamos</h1>
        </Link>
        <nav className="hidden md:flex absolute right-4 gap-4 items-center">
          {/* Perfil con dropdown moderno */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="relative cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition border border-gray-200"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && setDropdownOpen(!dropdownOpen)
              }
            >
              <FaUser className="text-orange-400 text-2xl" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-black border border-orange-400 rounded-lg shadow-lg z-50 py-2">
                {!isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-xs text-gray-500 font-semibold">Cuenta</div>
                    <div className="border-t border-gray-100 my-1" />
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaSignInAlt className="text-orange-400" /> Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUserPlus className="text-orange-400" /> Registrarse
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 text-xs text-gray-500 font-semibold">Mi cuenta</div>
                    <div className="border-t border-gray-100 my-1" />
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaRegUser className="text-orange-400" /> Mi perfil
                    </Link>
                    <Link
                      to="/profile/mis-compras"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaShoppingBag className="text-orange-400" /> Mis Compras
                    </Link>
                    <Link
                      to="/profile/valoraciones"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaStar className="text-orange-400" /> Mis Valoraciones
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <Link
                      to="/logout"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaSignOutAlt className="text-orange-400" /> Cerrar Sesión
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="h-6 border-l border-orange-300 mx-2"></div>

          {/* Botón carrito */}
          <div
            className="relative cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition border border-gray-200"
            onClick={() => setOpenCarrito(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && setOpenCarrito(true)
            }
          >
            <FaShoppingCart className="text-orange-400 text-2xl" />
          </div>

          {/* Menú del carrito */}
          <MenuCarrito open={openCarrito} setOpen={setOpenCarrito} />
        </nav>
      </div>
    </header>
  );
}

export default Navbar;