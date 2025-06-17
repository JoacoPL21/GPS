import { Sling as Hamburger } from "hamburger-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Navbar({ isOpen, setOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated } = useAuth();

  // Cierra el dropdown si se hace clic fuera
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
          {/* Botón Perfil con dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="button_login flex items-center gap-2 px-4 py-2  text-black rounded-lg hover:bg-gray-200 transition"
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

          {/* Otros enlaces */}
          <Link to="/cart" className="navbar_text">Carrito</Link>
          
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
