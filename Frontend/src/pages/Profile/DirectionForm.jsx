"use client"

import { useState, useEffect } from "react"
import { registerDireccion } from "../../services/user.service.js"
import Swal from "sweetalert2"

// En el componente FormDireccionEnvio, agregar el prop onDireccionAdded
const FormDireccionEnvio = ({ onDireccionAdded }) => {
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    calle: "",
    numero: "",
    ciudad: "",
    region: "",
    codigo_postal: "",
    tipo_de_direccion: "predeterminada",
  })

  useEffect(() => {
    if (success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Dirección registrada exitosamente",
        text: "Tu dirección de envío ha sido guardada.",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      })
      setSuccess(false)
    }
  }, [success])



//validacion del formulario
const validateForm = () => {
  const newError = {}
  if (!form.calle) newError.calle = "La calle es requerida";
  if (!form.numero) newError.numero = "El número es requerido";
  //si numero no es un numero entero
  if (form.numero && !Number.isInteger(Number(form.numero))) {
    newError.numero = "El número debe ser un valor entero";
  }
  if (!form.ciudad) newError.ciudad = "La ciudad es requerida";
  if (!form.region) newError.region = "La región es requerida";
  if (!form.codigo_postal) newError.codigo_postal = "El código postal es requerido";
  // Validación del código postal
  const postalCodePattern = /^\d{7}$/;
  if (form.codigo_postal && !postalCodePattern.test(form.codigo_postal)) {
    newError.codigo_postal = "El codigo postal debe ser correcto";
  }
  return newError;
}



  // Manejo de cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
    if (error[name]) {
      setError((prevError) => ({
        ...prevError,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors)
      return
    }

    // Validar que todos los campos requeridos estén completos
    if (!form.calle || !form.numero || !form.ciudad || !form.region || !form.codigo_postal) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor completa todos los campos requeridos.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log('Enviando datos de dirección:', form)
      const response = await registerDireccion(form)
      console.log('Respuesta del servidor:', response)
      
      if (response.status === "Success") {
        // Notificar al componente padre que se agregó una nueva dirección
        if (onDireccionAdded) {
          onDireccionAdded(response.data)
        }

        // Limpiar formulario y mostrar éxito
        setForm({
          calle: "",
          numero: "",
          ciudad: "",
          region: "",
          codigo_postal: "",
          tipo_de_direccion: "predeterminada",
        })
        
        setSuccess(true)
      } else {
        console.error("Error al registrar la dirección:", response.message)
        Swal.fire({
          title: "Error",
          text: response.message || "No se pudo registrar la dirección",
          icon: "error",
          confirmButtonText: "Aceptar",
        })
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al registrar la dirección. Por favor intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-amber-100">
      {/* Header del formulario */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <img src="/wood-svgrepo-com.svg" alt="Wood Logo" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Nueva Dirección</h2>
            <p className="text-amber-100">Agrega una nueva dirección de envío</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="p-6"
        autoComplete="off"
        noValidate
        
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calle */}
          <div className="group">
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              Calle
              <span className="text-red-600 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="calle"
                value={form.calle}
                onChange={handleInputChange}
                className={`w-full border-2 ${
                  error.calle ? 'border-red-500' : 'border-amber-200'
                } rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300 bg-white`}
                placeholder="Ingresa el nombre de la calle"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
            </div>
            {/* AGREGAR ESTE BLOQUE DE ERROR */}
            {error.calle && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error.calle}
              </p>
            )}
          </div>

          {/* Número */}
          <div className="group">
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              Número
              <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              type="text"
              name="numero"
              value={form.numero}
              onChange={handleInputChange}
              className={`w-full border-2 ${
                error.numero ? 'border-red-500' : 'border-amber-200'
              } rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300 bg-white`}
              placeholder="Número de la dirección"
              required
            />
            {/* AGREGAR ESTE BLOQUE DE ERROR */}
            {error.numero && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error.numero}
              </p>
            )}
          </div>

          {/* Ciudad */}
          <div className="group">
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              Ciudad
              <span className="text-red-600 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="ciudad"
                value={form.ciudad}
                onChange={handleInputChange}
                className={`w-full border-2 ${
                  error.ciudad ? 'border-red-500' : 'border-amber-200'
                } rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300 bg-white`}
                placeholder="Ciudad"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
            {/* AGREGAR ESTE BLOQUE DE ERROR */}
            {error.ciudad && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error.ciudad}
              </p>
            )}
          </div>

          {/* Región */}
          <div className="group">
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              Región
              <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              type="text"
              name="region"
              value={form.region}
              onChange={handleInputChange}
              className={`w-full border-2 ${
                error.region ? 'border-red-500' : 'border-amber-200'
              } rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300 bg-white`}
              placeholder="Región o estado"
              required
            />
            {/* AGREGAR ESTE BLOQUE DE ERROR */}
            {error.region && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error.region}
              </p>
            )}
          </div>

          {/* Código Postal */}
          <div className="group">
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              Código Postal
              <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              type="text"
              name="codigo_postal"
              value={form.codigo_postal}
              onChange={handleInputChange}
              className={`w-full border-2 ${
                error.codigo_postal ? 'border-red-500' : 'border-amber-200'
              } rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300 bg-white`}
              placeholder="Código postal"
              required
            />
            {/* AGREGAR ESTE BLOQUE DE ERROR */}
            {error.codigo_postal && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error.codigo_postal}
              </p>
            )}
          </div>

          {/* Tipo de dirección */}
          <div className="group">
            <label className="block text-sm font-semibold text-amber-800 mb-2">Tipo de dirección</label>
            <div className="relative">
              <select
                name="tipo_de_direccion"
                value={form.tipo_de_direccion}
                onChange={handleInputChange}
                className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300 appearance-none bg-white"
              >
                <option value="predeterminada">Predeterminada</option>
                <option value="opcional">Opcional</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
              isLoading
                ? "bg-stone-400 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Guardar Dirección</span>
              </>
            )}
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800 mb-1">Información importante</p>
              <p className="text-sm text-amber-700">
                Asegúrate de que todos los datos sean correctos. Esta información será utilizada para el envío de tus
                pedidos artesanales.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FormDireccionEnvio
