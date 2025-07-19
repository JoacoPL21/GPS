"use client"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState, useEffect } from "react"
import Swal from "sweetalert2"

const CategoriasModal = ({
  isOpen,
  onClose,
  categorias,
  onAddCategoria,
  onEditCategoria,
  onDeleteCategoria,
  loading,
}) => {
  
  const [form, setForm] = useState({ nombre: ""})
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
    if (form.nombre.trim().length < 2) newErrors.nombre = "Debe tener al menos 2 caracteres"
    if (form.nombre.trim().length > 50) newErrors.nombre = "No puede tener más de 50 caracteres"
    return newErrors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)

    try {
      let response
      if (editingId) {
        response = await onEditCategoria(editingId, form)
      } else {
        response = await onAddCategoria(form)
      }

      if (response.success) {
        const wasEditing = editingId !== null;
        
        // Mostrar mensaje de éxito
        Swal.fire(
          wasEditing ? "¡Actualizada!" : "¡Creada!",
          `La categoría ha sido ${wasEditing ? "actualizada" : "creada"}.`,
          "success",
        )
        
        // Resetear formulario inmediatamente para cerrar modal
        setForm({ nombre: ""})
        setEditingId(null)
        setErrors({})
        setSubmitting(false)
      } else {
        Swal.fire("Error", response.error || "No se pudo procesar la solicitud", "error")
      }
    } catch (error) {
      Swal.fire("Error", "Ha ocurrido un error inesperado", "error")
      setSubmitting(false)
    }
  }

  const handleEdit = (categoria) => {
    setForm({
      nombre: categoria.nombre,
    })
    setEditingId(categoria.id_categoria)
  }

  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará la categoría "${nombre}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      const response = await onDeleteCategoria(id)
      if (response.success) {
        Swal.fire("¡Eliminada!", "La categoría ha sido eliminada.", "success")
      } else {
        Swal.fire("Error", response.error || "No se pudo eliminar la categoría", "error")
      }
    }
  }

  const resetForm = () => {
    setForm({ nombre: ""})
    setEditingId(null)
    setErrors({})
  }

  useEffect(() => {
    // Solo actualizar el form si estamos editando y la categoría existe
    if (editingId && categorias.length > 0) {
      const cat = categorias.find((c) => c.id_categoria === editingId)
      if (cat && cat.nombre !== form.nombre) {
        setForm({ nombre: cat.nombre })
      }
    }
  }, [categorias, editingId, form.nombre])


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <div>
                        <Dialog.Title className="text-2xl font-bold">Gestionar Categorías</Dialog.Title>
                        <p className="text-blue-100 text-sm">Crea y administra las categorías de productos</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose()
                        resetForm()
                      }}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingId ? "Editar Categoría" : "Nueva Categoría"}
                      </h3>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                          <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.nombre ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                            }`}
                            placeholder="Ej: Artesanía"
                          />
                          {errors.nombre && <p className="mt-2 text-sm text-red-600">{errors.nombre}</p>}
                        </div>

                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all"
                          >
                            {submitting ? "Procesando..." : editingId ? "Actualizar" : "Crear"}
                          </button>

                          {editingId && (
                            <button
                              type="button"
                              onClick={resetForm}
                              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Lista de categorías */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Categorías Existentes ({categorias.length})
                      </h3>

                      <div className="max-h-96 overflow-y-auto space-y-3">
                        {loading ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Cargando...</p>
                          </div>
                        ) : categorias.length > 0 ? (
                          categorias.map((categoria) => (
                            <div
                              key={categoria.id_categoria}
                              className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800">{categoria.nombre}</h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {categoria.total_productos || 0} productos
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(categoria)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(categoria.id_categoria, categoria.nombre)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <svg
                              className="w-12 h-12 text-gray-300 mx-auto mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                            <p className="text-gray-600">No hay categorías creadas</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CategoriasModal
