"use client"

import { useAuth } from "../../context/AuthContext.jsx"
import { getUserDirecciones, deleteDireccion, updateUserProfile } from "../../services/user.service.js"
import swal from "sweetalert2"
import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import FormDireccionEnvio from "./DirectionForm.jsx"
import EditProfileModal from "../../components/EditProfileModal.jsx"
import { useProductosCompradosConValoracion } from "../../hooks/valoraciones/useProductosComprados.js"

const Profile = () => {
  const { authUser, updateUser } = useAuth()
  const [direcciones, setDirecciones] = useState([])
  const [isLoadingDirecciones, setIsLoadingDirecciones] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // Hook para obtener las valoraciones del usuario
  const { realizados } = useProductosCompradosConValoracion()

  // Función helper para obtener el ID del usuario (compatible con ambos formatos)
  const getUserId = (user) => user?.id || user?.id_usuario

  // Función para cargar direcciones
  const fetchDirecciones = useCallback(async () => {
    const userId = getUserId(authUser)
    if (!userId) {
      console.log("No hay ID de usuario disponible")
      return
    }

    setIsLoadingDirecciones(true)
    try {
      const response = await getUserDirecciones()

      if (response.status === "Success") {
        setDirecciones(response.data || [])
      } else {
        console.error("Error al obtener direcciones:", response.message)
        setDirecciones([])
      }
    } catch (error) {
      console.error("Error al obtener direcciones:", error)
      setDirecciones([])
    } finally {
      setIsLoadingDirecciones(false)
    }
  }, [authUser])

  // Función para eliminar una dirección
  const handleDeleteDireccion = async (direccionId) => {
    const result = await swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (!result.isConfirmed) return

    try {
      const response = await deleteDireccion(direccionId)
      if (response.status === "Success") {
        setDirecciones(direcciones.filter((direccion) => direccion.id_direccion !== direccionId))

        swal.fire({
          title: "¡Eliminada!",
          text: "Dirección eliminada correctamente.",
          icon: "success",
          confirmButtonColor: "#f97316",
          confirmButtonText: "Aceptar",
        })
      } else {
        swal.fire({
          title: "Error",
          text: response.message || "No se pudo eliminar la dirección",
          icon: "error",
          confirmButtonColor: "#f97316",
          confirmButtonText: "Aceptar",
        })
      }
    } catch (error) {
      console.error("Error al eliminar la dirección:", error)
      swal.fire({
        title: "Error",
        text: "Ocurrió un error al eliminar la dirección",
        icon: "error",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Aceptar",
      })
    }
  }

  // Función para actualizar perfil
  const handleProfileUpdate = async (updateData) => {
    try {
      const response = await updateUserProfile(updateData)
      if (response.status === "Success") {
        const updatedUserData = { ...authUser, ...updateData }
        updateUser(updatedUserData)

        swal.fire({
          title: "¡Perfil actualizado!",
          text: "Tu información ha sido actualizada correctamente.",
          icon: "success",
          confirmButtonColor: "#f97316",
          confirmButtonText: "Aceptar",
        })
      } else {
        swal.fire({
          title: "Error",
          text: response.message || "No se pudo actualizar el perfil",
          icon: "error",
          confirmButtonColor: "#f97316",
          confirmButtonText: "Aceptar",
        })
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      swal.fire({
        title: "Error",
        text: "Ocurrió un error al actualizar el perfil",
        icon: "error",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Aceptar",
      })
    }
  }

  // Función para agregar nueva dirección
  const handleDireccionAdded = (nuevaDireccion) => {
    setDirecciones((prev) => [...prev, nuevaDireccion])

    setTimeout(() => {
      fetchDirecciones()
    }, 500)
  }

  useEffect(() => {
    fetchDirecciones()
  }, [fetchDirecciones])

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U"
  }

  // Función para formatear la fecha de registro
  const formatFechaRegistro = (fechaString) => {
    if (!fechaString) return "No disponible"
    return new Date(fechaString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Mi Perfil</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Gestiona tu información personal y direcciones de envío para una experiencia de compra personalizada
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información del Usuario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header con gradiente sutil */}
              <div className="relative h-32 bg-orange-400 ">
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                    <span className="text-2xl font-bold text-orange-600">{getInitials(authUser?.nombreCompleto)}</span>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="pt-16 p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{authUser?.nombreCompleto || "Usuario"}</h2>
                  <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    ✓ Cuenta Activa
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                    <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">{authUser?.email || "No disponible"}</p>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Teléfono</p>
                      <p className="text-gray-900 font-medium">{authUser?.telefono || "No disponible"}</p>
                    </div>
                  </div>

                  {/* Valoraciones */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Valoraciones</p>
                      <p className="text-gray-900 font-medium">
                        {realizados?.length || 0} {realizados?.length === 1 ? 'valoración' : 'valoraciones'}
                      </p>
                    </div>
                  </div>

                  {/* Fecha de registro */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Miembro desde</p>
                      <p className="text-gray-900 font-medium">{formatFechaRegistro(authUser?.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full bg-orange-400 text-white px-6 py-3 rounded-xl hover:bg-orange-500 transition-colors flex items-center justify-center space-x-3 shadow-sm font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Editar Perfil</span>
                  </button>

                  <Link
                    to="/profile/mis-compras"
                    className="w-full bg-gray-400 !text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition-colors flex items-center justify-center space-x-3 shadow-sm font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span>Mis Compras</span>
                  </Link>

                  <Link
                    to="/profile/valoraciones"
                    className="w-full bg-yellow-400 !text-white px-6 py-3 rounded-xl hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-3 shadow-sm font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span>Mis Valoraciones</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Direcciones de Envío */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Direcciones de Envío</h2>
                    <p className="text-gray-600">Gestiona tus direcciones de entrega</p>
                  </div>

                  <div className="text-right">
                    <div className="bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
                      <p className="text-gray-600 text-sm font-medium">Direcciones</p>
                      <p className="text-gray-900 text-2xl font-bold">
                        {direcciones.length}
                        <span className="text-gray-500 text-lg">/3</span>
                      </p>
                    </div>
                    {direcciones.length >= 3 && <p className="text-orange-600 text-xs mt-1">Límite alcanzado</p>}
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                {isLoadingDirecciones ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
                      <svg className="animate-spin w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24">
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
                    </div>
                    <p className="text-gray-700 text-xl font-medium">Cargando direcciones...</p>
                  </div>
                ) : direcciones.length > 0 ? (
                  <div className="space-y-4">
                    {direcciones.map((direccion, index) => (
                      <div
                        key={direccion.id_direccion}
                        className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors group border border-gray-100"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center font-bold shadow-sm">
                              {index + 1}
                            </div>

                            <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
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

                            <span
                              className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${
                                direccion.tipo_de_direccion === "predeterminada"
                                  ? "bg-orange-100 text-orange-800 border-orange-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                              }`}
                            >
                              {direccion.tipo_de_direccion || "Dirección"}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteDireccion(direccion.id_direccion)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg shadow-sm"
                            title="Eliminar dirección"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-gray-500 font-medium">Dirección</p>
                            <p className="text-gray-900 font-medium">
                              {direccion.calle} {direccion.numero}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-500 font-medium">Comuna</p>
                            <p className="text-gray-900 font-medium">{direccion.comuna}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-500 font-medium">Región</p>
                            <p className="text-gray-900 font-medium">{direccion.region}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-500 font-medium">Código Postal</p>
                            <p className="text-gray-900 font-medium">{direccion.codigo_postal}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No hay direcciones registradas</h3>
                    <p className="text-gray-600">Agrega tu primera dirección de envío para comenzar</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de dirección */}
        <div className="mt-8">
          <FormDireccionEnvio
            onDireccionAdded={handleDireccionAdded}
            currentDirectionsCount={direcciones.length}
            maxDirections={3}
          />
        </div>

        {/* Modal para editar perfil */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userProfile={authUser}
          onProfileUpdated={handleProfileUpdate}
        />
      </div>
    </div>
  )
}

export default Profile
