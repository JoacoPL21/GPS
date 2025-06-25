"use client"

import { useAuth } from "../../context/AuthContext.jsx"
import { getDireccionesByUserId, deleteDireccionByUserId } from "../../services/user.service.js"
import swal from "sweetalert2"
import { useEffect, useState } from "react"
import FormDireccionEnvio from "./DirectionForm.jsx"

const Profile = () => {
  const { authUser } = useAuth()
  const id_usuario = authUser?.id_usuario || null
  const [direcciones, setDirecciones] = useState([])

  // Función para eliminar una dirección
  const handleDeleteDireccion = async (direccionId) => {
    try {
      const response = await deleteDireccionByUserId(direccionId)
      if (response.status === "Success") {
        setDirecciones(direcciones.filter((direccion) => direccion.id !== direccionId))
        swal.fire({
          title: "Éxito",
          text: "Dirección eliminada correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        })
      } else {
        console.error("Error al eliminar la dirección:", response.message)
      }
    } catch (error) {
      console.error("Error al eliminar la dirección:", error)
    }
  }

  useEffect(() => {
    const fetchDirecciones = async () => {
      if (id_usuario) {
        try {
          const response = await getDireccionesByUserId(id_usuario)
          if (response.status === "Success") {
            setDirecciones(response.data)
          } else {
            console.error("Error al obtener direcciones:", response.message)
          }
        } catch (error) {
          console.error("Error al obtener direcciones:", error)
        }
      }
    }

    fetchDirecciones()
  }, [id_usuario])

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Mi Perfil</h1>
          <p className="text-amber-700">Gestiona tu información personal y direcciones de envío</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información del Usuario */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-amber-100">
              {/* Header con gradiente maderoso */}
              <div className="relative h-32 bg-gradient-to-br from-amber-600 via-amber-700 to-orange-700">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 to-amber-900/20"></div>
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg flex items-center justify-center border-4 border-amber-50">
                    <span className="text-2xl font-bold text-white">{getInitials(authUser?.nombreCompleto)}</span>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="pt-16 p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-amber-900 mb-1">{authUser?.nombreCompleto || "Usuario"}</h2>
                  <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    Cuenta Activa
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors border border-amber-100">
                    <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-600">Email</p>
                      <p className="text-amber-900">{authUser?.email || "No disponible"}</p>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors border border-amber-100">
                    <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-600">Teléfono</p>
                      <p className="text-amber-900">{authUser?.telefono || "No disponible"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direcciones de Envío */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Direcciones de Envío</h2>
                    <p className="text-amber-100">Gestiona tus direcciones de entrega</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
                    <img src="/wood-svgrepo-com.svg" alt="Wood Logo" className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                {direcciones.length > 0 ? (
                  <div className="space-y-4">
                    {/* Botón eliminar */}
                    <div className="flex justify-end">
                      <button
                        className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        onClick={() => handleDeleteDireccion(id_usuario)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>Eliminar Dirección</span>
                      </button>
                    </div>

                    {/* Lista de direcciones */}
                    <div className="grid gap-4">
                      {direcciones.map((direccion, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 group border border-amber-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center">
                                <img src="/wood-svgrepo-com.svg" alt="Wood Logo" className="w-4 h-4" />
                              </div>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                                  direccion.tipo_de_direccion === "predeterminada"
                                    ? "bg-amber-100 text-amber-800 border-amber-200"
                                    : "bg-stone-100 text-stone-800 border-stone-200"
                                }`}
                              >
                                {direccion.tipo_de_direccion}
                              </span>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-amber-600 font-medium">Dirección</p>
                              <p className="text-amber-900">
                                {direccion.calle} {direccion.numero}
                              </p>
                            </div>
                            <div>
                              <p className="text-amber-600 font-medium">Ciudad</p>
                              <p className="text-amber-900">{direccion.ciudad}</p>
                            </div>
                            <div>
                              <p className="text-amber-600 font-medium">Región</p>
                              <p className="text-amber-900">{direccion.region}</p>
                            </div>
                            <div>
                              <p className="text-amber-600 font-medium">Código Postal</p>
                              <p className="text-amber-900">{direccion.codigo_postal}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
                      <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    </div>
                    <p className="text-amber-700 text-lg font-medium">No hay direcciones registradas</p>
                    <p className="text-amber-600 text-sm">Agrega tu primera dirección de envío</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de dirección */}
        <div className="mt-8">
          <FormDireccionEnvio />
        </div>
      </div>
    </div>
  )
}

export default Profile
