import { Sling as Hamburger } from "hamburger-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaChevronUp, FaChevronDown, FaShoppingCart } from "react-icons/fa";
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
        <h1 className="text-xl font-bold">Maderas Lemaco</h1>

        <nav className="hidden md:flex absolute right-4 gap-4 items-center">
          {/* Perfil con dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="button_login flex items-center gap-2 px-4 py-2 text-black rounded-lg hover:bg-gray-200 transition"
            >
              <FaUserCircle className="text-orange-400 text-xl" />
              <span className="font-medium">Perfil</span>
              {dropdownOpen ? (
                <FaChevronUp className="text-orange-400 text-sm" />
              ) : (
                <FaChevronDown className="text-orange-400 text-sm" />
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black border border-orange-400 rounded-lg shadow-lg z-50">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="navbar_text block px-4 py-2 hover:bg-gray-100 rounded-t-lg transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="navbar_text block px-4 py-2 hover:bg-gray-100 rounded-b-lg transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/logout"
                      className="navbar_text block px-4 py-2 hover:bg-gray-100 rounded transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Cerrar Sesión
                    </Link>
                    <Link
                      to="/profile"
                      className="navbar_text block px-4 py-2 hover:bg-gray-100 rounded transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Mi perfil
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
            <div className="h-6 border-l border-orange-300 mx-2"></div>


          {/* Botón carrito */}
          <div
            className="relative cursor-pointer p-2 text-orange-400 hover:text-orange-500 transition-colors"
            onClick={() => setOpenCarrito(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && setOpenCarrito(true)
            }
          >
            <FaShoppingCart className="text-2xl" />
          </div>

          {/* Menú del carrito */}
          <MenuCarrito open={openCarrito} setOpen={setOpenCarrito} />
        </nav>
      </div>
    </header>
  );
}

export default Navbar;