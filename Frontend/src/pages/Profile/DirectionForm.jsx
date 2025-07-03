import { useState,useEffect } from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import { registerDireccion } from "../../services/user.service.js";
import Swal from "sweetalert2";
const FormDireccionEnvio=()=> {
  const { authUser } = useAuth();
  const [success,setSuccess] = useState(false);
  const [form, setForm] = useState({
    id_usuario: authUser?.id_usuario || "",
    calle: "",
    numero: "",
    ciudad: "",
    region: "",
    codigo_postal: "",
    tipo_de_direccion: "predeterminada",
  });

  useEffect(() => {
    if(success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Dirección registrada exitosamente",
        text: "Tu dirección de envío ha sido guardada.",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
        
      });
      setSuccess(false);
    }
  }, [success]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async ( data) => {
    try {
      const response = await registerDireccion(data);
      if (response.status === "Success") {
        setSuccess(true);
        setForm({
          id_usuario: authUser?.id_usuario || "",
          calle: "",
          numero: "",
          ciudad: "",
          region: "",
          codigo_postal: "",
          tipo_de_direccion: "predeterminada",
        });
      } else {
        console.error("Error al registrar la dirección:", response.message);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
 }

  return (
    <form
      onSubmit={
        (e) => {
          e.preventDefault();
          handleSubmit(form);
      }
        }
      className="max-w-xl w-full mx-auto mt-12 p-6 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Dirección de Envío</h2>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Calle</label>
        <input
          type="text"
          name="calle"
          value={form.calle}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1.5"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Número</label>
        <input
          type="text"
          name="numero"
          value={form.numero}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1.5"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Ciudad</label>
        <input
          type="text"
          name="ciudad"
          value={form.ciudad}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1.5"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Región</label>
        <input
          type="text"
          name="region"
          value={form.region}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1.5"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Código Postal</label>
        <input
          type="text"
          name="codigo_postal"
          value={form.codigo_postal}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1.5"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Tipo de dirección</label>
        <select
          name="tipo_de_direccion"
          value={form.tipo_de_direccion}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1.5"
        >
          <option value="predeterminada">Predeterminada</option>
          <option value="opcional">Opcional</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        Guardar dirección
      </button>
    </form>
  );
}

export default FormDireccionEnvio;


