import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Sling as Hamburger } from "hamburger-react";
import { useState, useEffect } from "react";
import "../styles/App.css";

function Root() {
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  return (
    <div className="full_navbar">
      <Sidebar isOpen={isOpen} toggle={() => setOpen(false)} />
      <header className="navbar_md sticky top-0 bg-white shadow z-40 p-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute left-4 z-30">
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
          <h1 className="text-xl font-bold">Maderas Lemaco</h1>
          <nav className="hidden md:flex absolute right-4 gap-4">
            {/* Puedes agregar aquí tus links globales */}
          </nav>
        </div>
      </header>
      <main className="main_content p-4">
        <Outlet />
      </main>
      <footer className="footer bg-gray-100 text-center py-4">
        © 2025 Artesanías en Madera. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default Root;