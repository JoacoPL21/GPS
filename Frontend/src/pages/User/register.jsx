import { useState,useEffect, } from 'react';
import { Send } from 'lucide-react';
import { register } from '../../services/auth.service';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom';

const Register = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    telefono: '',
    direccion: {
      calle: '',
      numero: '',
      ciudad: '',
      region: '',
      codigo_postal: '',
      tipo_de_direccion: 'envio' // Valor por defecto
    }

  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

//manejo de la alerta de SweetAlert2
useEffect(() => {
  if(success) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Te has registrado correctamente",
      text: "Ahora puedes iniciar sesión",
      showConfirmButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#f59e0b", // Color del botón de confirmación

    });
    setSuccess(false); // Limpia el estado de éxito para evitar que se muestre la alerta nuevamente
    setTimeout(() => {
      navigate('/login'); // Redirige al usuario a la página de inicio de sesión después de mostrar la alerta
    }, 2000); // Espera 2 segundos antes de redirigir
  }
  // Limpia el estado de éxito después de mostrar la alerta
}, [success]);




  // Maneja los cambios en los campos del formulario (avisa sobre errores)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpia el error del campo correspondiente al cambiar su valor
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    
  };

  // Valida los campos del formulario y devuelve un objeto con los errores
  const validate = () => {
    const newErrors = {};
    if (!formData.nombreCompleto.trim()) newErrors.nombreCompleto = 'El nombre es obligatorio';
    //nombre minimo de 3 caracteres
    if (formData.nombreCompleto.trim().length < 3) newErrors.nombreCompleto = 'El nombre debe tener al menos 3 caracteres';
    //nombre maximo de 30 caracteres
    if (formData.nombreCompleto.trim().length > 30) newErrors.nombreCompleto = 'El nombre no puede tener más de 50 caracteres';
    //validar email
    // Expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // expresion regular para validar el formato del teléfono (9 digitos y solo numeros y que empiece con 9)
    const telefonoRegex = /^9[0-9]{8}$/;
    if (!formData.email.trim()) newErrors.email = 'El correo es obligatorio';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (formData.telefono.toString().length !== 9) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos';
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    if (!telefonoRegex.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos y comenzar con 9';
    }
    // Si hay algún error, se devuelve el objeto de errores
    return newErrors;
  };


  // Maneja el envío del formulario
  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    //si existe al menos un error, no se envía el formulario 
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Si no hay errores, se procede a enviar el formulario
    setSubmitting(true);
    console.log('Datos del formulario:', formData);
    try {
      const response = await register(formData);
      if (response.status === 'Success') {
        setSuccess(true);
        setFormData({
          nombreCompleto: '',
          email: '',
          password: '',
          telefono: '',
        
        });
        setErrors({});

        console.log('Registro exitoso:', response);
        

      
      } else {
        setErrors({ general: response.message || 'Error al registrar' });
        console.error('Error al registrar:', response.message);
      }
    } catch (error) {
      setErrors({ general: error.message || 'Error al registrar' });
      console.error('Error al registrar:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="">
    <div className="flex items-center justify-center h-[75vh]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-4xl pb-4 font-bold mb-6 text-center">Crear Cuenta</h2>
        <form onSubmit={handleRegister}>
          {/* Nombre Completo */}
          <div className="relative mb-6">
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleInputChange}
              placeholder=""
              required
              className={`peer w-full border-2 rounded-md px-3 pt-2 pb-3 text-sm bg-white text-gray-900 focus:outline-none focus:border-orange-500 transition-all
                ${errors.nombreCompleto ? "border-red-500" : "border-gray-400"}`}
            />
            <label
              htmlFor="nombreCompleto"
              className="absolute left-2 -top-2 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
                peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-500 transition-all duration-200 z-10"
            >
              Nombre Completo
            </label>
            {errors.nombreCompleto && (
              <p className="text-red-500 text-xs mt-1">{errors.nombreCompleto}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative mb-6">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder=""
              required
              className={`peer w-full border-2 rounded-md px-3 pt-2 pb-3 text-sm bg-white text-gray-900 focus:outline-none focus:border-orange-500 transition-all
                ${errors.email ? "border-red-500" : "border-gray-400"}`}
            />
            <label
              htmlFor="email"
              className="absolute left-2 -top-2 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
                peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-500 transition-all duration-200 z-10"
            >
              Correo Electrónico
            </label>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="relative mb-6">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder=""
              required
              className={`peer w-full border-2 rounded-md px-3 pt-2 pb-3 text-sm bg-white text-gray-900 focus:outline-none focus:border-orange-500 transition-all
                ${errors.password ? "border-red-500" : "border-gray-400"}`}
            />
            <label
              htmlFor="password"
              className="absolute left-2 -top-2.5 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
                peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-500 transition-all duration-200 z-10"
            >
              Contraseña
            </label>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="relative mb-6">
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              maxLength={9}
              placeholder=""
              required
              className={`peer w-full border-2 rounded-md px-3 pt-2 pb-3 text-sm bg-white text-gray-900 focus:outline-none focus:border-orange-500 transition-all
                ${errors.telefono ? "border-red-500" : "border-gray-400"}`}
            />
            <label
              htmlFor="telefono"
              className="absolute left-2 -top-2.5 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
                peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-500 transition-all duration-200 z-10"
            >
              Teléfono
            </label>
            {errors.telefono && (
              <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
            )}
          </div>

          {/* Mensaje de error general */}
          {errors.general && (
            <p className="text-red-500 text-xs mb-4">{errors.general}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-orange-400 transition-colors"
            disabled={submitting}
          >
            {submitting ? "Cargando..." : "Registrarse"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  </div>
);
};

export default Register;