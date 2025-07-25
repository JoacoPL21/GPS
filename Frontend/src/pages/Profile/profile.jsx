"use client"

import { useAuth } from "../../context/AuthContext.jsx"
import { getUserDirecciones, deleteDireccion, updateUserProfile } from "../../services/user.service.js"
import swal from "sweetalert2"
import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import FormDireccionEnvio from "./DirectionForm.jsx"
import EditProfileModal from "../../components/EditProfileModal.jsx"

const Profile = () => {
  const { authUser, updateUser } = useAuth()
  const [direcciones, setDirecciones] = useState([])
  const [isLoadingDirecciones, setIsLoadingDirecciones] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  console.log("authUser", authUser);
  
  // Función helper para obtener el ID del usuario (compatible con ambos formatos)
  const getUserId = (user) => user?.id || user?.id_usuario;

  // Función para cargar direcciones
  const fetchDirecciones = useCallback(async () => {
    const userId = getUserId(authUser);
    if (!userId) {
      console.log("No hay ID de usuario disponible");
      return;
    }

    setIsLoadingDirecciones(true)
    try {
      const response = await getUserDirecciones()
      console.log("Respuesta de direcciones:", response);
      
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
    // Confirmar eliminación
    const result = await swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (!result.isConfirmed) return

    try {
      const response = await deleteDireccion(direccionId)
      if (response.status === "Success") {
        // Actualizar estado local
        setDirecciones(direcciones.filter((direccion) => direccion.id_direccion !== direccionId))

        swal.fire({
          title: "¡Eliminada!",
          text: "Dirección eliminada correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        })
      } else {
        swal.fire({
          title: "Error",
          text: response.message || "No se pudo eliminar la dirección",
          icon: "error",
          confirmButtonText: "Aceptar",
        })
      }
    } catch (error) {
      console.error("Error al eliminar la dirección:", error)
      swal.fire({
        title: "Error",
        text: "Ocurrió un error al eliminar la dirección",
        icon: "error",
        confirmButtonText: "Aceptar",
      })
    }
  }

  // Función para actualizar perfil
  const handleProfileUpdate = async (updateData) => {
    try {
      const response = await updateUserProfile(updateData)
      if (response.status === "Success") {
        // Actualizar el contexto de autenticación con los nuevos datos
        const updatedUserData = { ...authUser, ...updateData }
        updateUser(updatedUserData)
        
        swal.fire({
          title: "¡Perfil actualizado!",
          text: "Tu información ha sido actualizada correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        })
      } else {
        swal.fire({
          title: "Error",
          text: response.message || "No se pudo actualizar el perfil",
          icon: "error",
          confirmButtonText: "Aceptar",
        })
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      swal.fire({
        title: "Error",
        text: "Ocurrió un error al actualizar el perfil",
        icon: "error",
        confirmButtonText: "Aceptar",
      })
    }
  }

  // Función para agregar nueva dirección (callback para el formulario)
  const handleDireccionAdded = (nuevaDireccion) => {
    setDirecciones((prev) => [...prev, nuevaDireccion])
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

                {/* Botones de perfil */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
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
                  
                  {/* Enlace a Mis Compras */}
                  <Link
                    to="/mis-compras"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
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
              
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                {isLoadingDirecciones ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
                      <svg className="animate-spin w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <p className="text-amber-700 text-lg font-medium">Cargando direcciones...</p>
                  </div>
                ) : direcciones.length > 0 ? (
                  <div className="space-y-4">
                    {/* Lista de direcciones */}
                    <div className="grid gap-4">
                      {direcciones.map((direccion) => (
                        <div
                          key={direccion.id_direccion} // CAMBIO: era direccion.id
                          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 group border border-amber-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                                  direccion.tipo_de_direccion === "predeterminada"
                                    ? "bg-amber-100 text-amber-800 border-amber-200"
                                    : "bg-stone-100 text-stone-800 border-stone-200"
                                }`}
                              >
                                {direccion.tipo_de_direccion || "Dirección"}
                              </span>
                            </div>

                            {/* Botón eliminar individual */}
                            <button
                              onClick={() => handleDeleteDireccion(direccion.id_direccion)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg"
                              title="Eliminar dirección"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-amber-600 font-medium">Dirección</p>
                              <p className="text-amber-900">
                                {direccion.calle} {direccion.numero}
                              </p>
                            </div>
                            <div>
                              <p className="text-amber-600 font-medium">Comuna</p> 
                              <p className="text-amber-900">{direccion.comuna}</p>
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
          <FormDireccionEnvio onDireccionAdded={handleDireccionAdded} />
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