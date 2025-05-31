import { useState,useEffect } from 'react';
import { Send } from 'lucide-react';
import { register } from '../../services/auth.service';
import Swal from 'sweetalert2';



const Register = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    telefono: ''
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
  }
}, [success]);




  // Maneja los cambios en los campos del formulario (avisa sobre errores)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
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
    return newErrors;
  };


  // Maneja el envío del formulario
  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess(false);
    const validationErrors = validate();
    //si existe al menos un error, no se envía el formulario 
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Si no hay errores, se procede a enviar el formulario
    setSubmitting(true);
    try {
      const response = await register(formData);
      console.log('Respuesta del registro:', response);
      if (response.status === 'Success') {
        setSuccess(true);
        setFormData({
          nombreCompleto: '',
          email: '',
          password: '',
          telefono: ''
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
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100 flex flex-col">
          <h2 className="text-4xl font-bold text-amber-900 mb-4 text-center">
            Crear Cuenta
          </h2>
          <p className="text-lg text-amber-700 mb-8 text-center">
            Regístrate para acceder a todas las funcionalidades.
          </p>
          <form onSubmit={handleRegister} className="space-y-6 flex flex-col flex-grow">
            <div>
              <label htmlFor="nombreCompleto" className="block text-sm font-medium text-amber-900 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${errors.nombreCompleto ? 'border-red-400' : 'border-amber-200'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors`}
                placeholder="Tu nombre"
              />
              {errors.nombreCompleto && <p className="text-red-600 text-sm mt-1">{errors.nombreCompleto}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-900 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-400' : 'border-amber-200'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors`}
                placeholder="ejemplo@gmail.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-900 mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${errors.password ? 'border-red-400' : 'border-amber-200'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors`}
                placeholder="Contraseña"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-amber-900 mb-2">
                Telefono *
              </label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                maxLength={9}
                className={`w-full px-4 py-3 border ${errors.telefono ? 'border-red-400' : 'border-amber-200'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors`}
                placeholder="123456789"
              />
              {errors.telefono && <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>}
            </div>
            <div className="mt-6 pt-6 border-t border-amber-200">
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 disabled:transform-none disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span>Cargando...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Registrarse</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-amber-700 text-sm">
              ¿Ya tienes una cuenta? <a href="/login" className="text-amber-900 font-semibold hover:underline">Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;