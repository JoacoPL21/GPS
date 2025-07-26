"use client"
import ChilexpressRegionComunaSelector from "../../components/ChilexpressSelector.jsx"
import { useState, useEffect } from "react"
import { registerDireccion } from "../../services/user.service.js"
import Swal from "sweetalert2"

const FormDireccionEnvio = ({ onDireccionAdded, currentDirectionsCount = 0, maxDirections = 3 }) => {
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({})
  const [form, setForm] = useState({
    calle: "",
    numero: "",
    comuna: "",
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
        confirmButtonColor: "#d97706",
        confirmButtonText: "Aceptar",
      })
      setSuccess(false)
    }
  }, [success])

  // Validación del formulario
  const validateForm = () => {
    const newError = {}
    if (!form.calle) newError.calle = "La calle es requerida"
    if (!form.numero) newError.numero = "El número es requerido"

    if (form.numero && !Number.isInteger(Number(form.numero))) {
      newError.numero = "El número debe ser un valor entero"
    }

    if (!form.comuna) newError.comuna = "La comuna es requerida"
    if (!form.region) newError.region = "La región es requerida"
    if (!form.codigo_postal) newError.codigo_postal = "El código postal es requerido"

    const postalCodePattern = /^\d{7}$/
    if (form.codigo_postal && !postalCodePattern.test(form.codigo_postal)) {
      newError.codigo_postal = "El código postal debe tener 7 dígitos"
    }

    return newError
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

  // Handler para el selector de región y comuna
  const handleRegionComunaChange = ({ region, comuna }) => {
    setForm((prevForm) => ({
      ...prevForm,
      region: region,
      comuna: comuna,
    }))

    // Limpiar errores relacionados
    setError((prevError) => ({
      ...prevError,
      region: "",
      comuna: "",
    }))
  }

  // Verificar si se alcanzó el límite
  const hasReachedLimit = currentDirectionsCount >= maxDirections

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar límite antes de enviar
    if (hasReachedLimit) {
      Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: `No puedes tener más de ${maxDirections} direcciones. Elimina una dirección existente antes de agregar una nueva.`,
        confirmButtonColor: "#d97706",
        confirmButtonText: "Entendido",
      })
      return
    }

    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors)
      return
    }

    setIsLoading(true)
    try {
      const response = await registerDireccion(form)

      if (response.status === "Success") {
        if (onDireccionAdded) {
          onDireccionAdded(response.data)
        }

        setForm({
          calle: "",
          numero: "",
          comuna: "",
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
          confirmButtonColor: "#d97706",
          confirmButtonText: "Aceptar",
        })
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al registrar la dirección. Por favor intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#d97706",
        confirmButtonText: "Aceptar",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200/50 overflow-hidden">
      {/* Header del formulario */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {hasReachedLimit ? "Límite Alcanzado" : "Agregar Nueva Dirección"}
            </h2>
            <p className="text-amber-100">
              {hasReachedLimit
                ? `Tienes ${currentDirectionsCount}/${maxDirections} direcciones registradas`
                : `Tienes ${currentDirectionsCount}/${maxDirections} direcciones registradas`}
            </p>
          </div>

          {/* Icono decorativo */}
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="p-8">
        {hasReachedLimit ? (
          // Mensaje cuando se alcanza el límite
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-200">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-amber-900 mb-3">Límite de direcciones alcanzado</h3>
            <p className="text-amber-700 mb-4 text-lg">
              Has registrado el máximo de {maxDirections} direcciones permitidas.
            </p>
            <p className="text-amber-600">Para agregar una nueva dirección, primero elimina una de las existentes.</p>
          </div>
        ) : (
          // Formulario normal cuando no se alcanza el límite
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" noValidate>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Calle */}
              <div className="group">
                <label className="block text-sm font-bold text-amber-800 mb-3">
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
                      error.calle ? "border-red-500 bg-red-50" : "border-amber-200 bg-white"
                    } rounded-2xl px-5 py-4 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300 group-hover:border-amber-300 text-amber-900 font-medium `}
                    placeholder="Ingresa el nombre de la calle"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
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
                {error.calle && (
                  <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {error.calle}
                  </p>
                )}
              </div>

              {/* Número */}
              <div className="group">
                <label className="block text-sm font-bold text-amber-800 mb-3">
                  Número
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="numero"
                  value={form.numero}
                  onChange={handleInputChange}
                  className={`w-full border-2 ${
                    error.numero ? "border-red-500 bg-red-50" : "border-amber-200 bg-white"
                  } rounded-2xl px-5 py-4 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300 group-hover:border-amber-300 text-amber-900 font-medium `}
                  placeholder="Número de la dirección"
                  required
                />
                {error.numero && (
                  <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {error.numero}
                  </p>
                )}
              </div>

              {/* Código Postal */}
              <div className="group">
                <label className="block text-sm font-bold text-amber-800 mb-3">
                  Código Postal
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="codigo_postal"
                  value={form.codigo_postal}
                  onChange={handleInputChange}
                  className={`w-full border-2 ${
                    error.codigo_postal ? "border-red-500 bg-red-50" : "border-amber-200 bg-white"
                  } rounded-2xl px-5 py-4 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300 group-hover:border-amber-300 text-amber-900 font-medium `}
                  placeholder="Código postal (7 dígitos)"
                  required
                />
                {error.codigo_postal && (
                  <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {error.codigo_postal}
                  </p>
                )}
              </div>

              {/* Tipo de dirección */}
              <div className="group">
                <label className="block text-sm font-bold text-amber-800 mb-3">Tipo de dirección</label>
                <div className="relative">
                  <select
                    name="tipo_de_direccion"
                    value={form.tipo_de_direccion}
                    onChange={handleInputChange}
                    className="w-full border-2 border-amber-200 rounded-2xl px-5 py-4 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300 group-hover:border-amber-300 appearance-none bg-white text-amber-900 font-medium"
                  >
                    <option value="predeterminada">Predeterminada</option>
                    <option value="opcional">Opcional</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Selector de Región y Comuna */}
            <div className="mt-8">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200">
                <h3 className="text-sm font-bold text-amber-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Ubicación del envío
                  <span className="text-red-600 ml-1">*</span>
                </h3>
                <ChilexpressRegionComunaSelector
                  regionValue={form.region}
                  comunaValue={form.comuna}
                  onChange={handleRegionComunaChange}
                  regionError={error.region}
                  comunaError={error.comuna}
                />
              </div>
            </div>

            {/* Botón de envío */}
            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center space-x-3 px-10 py-5 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${
                  isLoading
                    ? "bg-stone-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Guardar Dirección</span>
                  </>
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-800 mb-2">Información importante</p>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Selecciona la región y comuna donde quieres recibir tus pedidos. Esta información será utilizada
                    para calcular los costos de envío con Chilexpress y garantizar una entrega exitosa.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default FormDireccionEnvio
