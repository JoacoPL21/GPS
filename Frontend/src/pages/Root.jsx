import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import "../styles/App.css";
import Footer from "./Homepage/Footer"; 
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
    <div className="full_navbar flex flex-col min-h-screen bg-[#fff8f0]">
      <Sidebar isOpen={isOpen} toggle={() => setOpen(false)} />
      <Navbar isOpen={isOpen} setOpen={setOpen} />
      <main className="main_content p-4 flex-1">
        <Outlet />
      </main>
      <Footer /> 
    </div>
  );
}

export default Root;