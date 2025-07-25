"use client"
import { Dialog, Transition } from "@headlessui/react"
import { useCategorias } from "../hooks/productos/useCategorias";
import { Fragment, useEffect, useState } from "react"

const ProductoModal = ({ isOpen, onClose, onSubmit, form, onChange, errors, isEditing, submitting, uploadProgress = 0 }) => {

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Crear URL para preview de imagen
  useEffect(() => {
    if (form.imagen && form.imagen instanceof File) {
      // Imagen nueva seleccionada - mostrar preview del archivo
      const url = URL.createObjectURL(form.imagen);
      setImagePreviewUrl(url);
      
      // Cleanup function para liberar memoria
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (isEditing && form.imagen_url && !form.imagen) {
      // Modo edición con imagen existente y sin nueva imagen seleccionada
      setImagePreviewUrl(form.imagen_url);
    } else {
      // Si no hay imagen o no es un File, limpiar el preview
      if (imagePreviewUrl && !form.imagen_url) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(null);
    }
  }, [form.imagen, form.imagen_url, isEditing]);

  // Cleanup cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
      }
    }
  }, [isOpen]);


  const { categorias } = useCategorias();

  const getFieldIcon = (field) => {
    const icons = {
      nombre: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
      descripcion: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
      precio: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      stock: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      categoria: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      estado: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      imagen: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7h18M3 12h18m-9 5h9m-9 0a2 2 0 11-4 0 2 2 0 014 0zM3 7a2 2 0 11-4 0 2 2 0 014 0zM3 12a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      peso: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-3m3 3l3-3"
          />
        </svg>
      ),
      ancho: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
      alto: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      ),
      profundidad: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
    }
    return icons[field] || null
  }

  const getFieldLabel = (field) => {
    const labels = {
      nombre: "Nombre del producto",
      descripcion: "Descripción",
      precio: "Precio (CLP)",
      stock: "Cantidad en stock",
      categoria: "Categoría",
      estado: "Estado",
      imagen: "Imagen del producto",
      peso: "Peso (kg)",
      ancho: "Ancho (cm)",
      alto: "Alto (cm)",
      profundidad: "Profundidad (cm)",
    }
    return labels[field] || field
  }

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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                {/* Header del Modal */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        {isEditing ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <Dialog.Title className="text-2xl font-bold">
                          {isEditing ? "Editar Producto" : "Agregar Nuevo Producto"}
                        </Dialog.Title>
                        <p className="text-orange-100 text-sm">
                          {isEditing ? "Modifica la información del producto" : "Completa los datos del nuevo producto"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Contenido del Modal */}
                <div className="px-8 py-6">
                  <form onSubmit={onSubmit} className="space-y-6">
                    {/* Grid de campos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nombre */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getFieldLabel("nombre")} *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {getFieldIcon("nombre")}
                          </div>
                          <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={onChange}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                              errors.nombre
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 focus:border-orange-500"
                            }`}
                            placeholder="Ej: Mesa de madera artesanal"
                          />
                        </div>
                        {errors.nombre && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.nombre}
                          </p>
                        )}
                      </div>

                      {/* Descripción */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getFieldLabel("descripcion")}
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                            {getFieldIcon("descripcion")}
                          </div>
                          <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={onChange}
                            rows={3}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
                              errors.descripcion
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 focus:border-orange-500"
                            }`}
                            placeholder="Describe las características del producto..."
                          />
                        </div>
                        {errors.descripcion && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.descripcion}
                          </p>
                        )}
                      </div>

                      {/* Precio */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getFieldLabel("precio")} *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {getFieldIcon("precio")}
                          </div>
                          <input
                            type="number"
                            name="precio"
                            value={form.precio}
                            onChange={onChange}
                            min="0"
                            step="100"
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                              errors.precio
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 focus:border-orange-500"
                            }`}
                            placeholder="0"
                          />
                        </div>
                        {errors.precio && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.precio}
                          </p>
                        )}
                      </div>

                      {/* Stock */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getFieldLabel("stock")} *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {getFieldIcon("stock")}
                          </div>
                          <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={onChange}
                            min="0"
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                              errors.stock
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 focus:border-orange-500"
                            }`}
                            placeholder="0"
                          />
                        </div>
                        {errors.stock && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.stock}
                          </p>
                        )}
                      </div>

                      {/* Categoría */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getFieldLabel("categoria")} *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {getFieldIcon("categoria")}
                          </div>
                          <select
                            name="id_categoria"
                            value={form.id_categoria}
                            onChange={onChange}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white ${
                              errors.categoria
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 focus:border-orange-500"
                            }`}
                          >
                            <option value="">Selecciona una categoría</option>
                            {categorias.map((categorias, index) => (
                              <option key={categorias.id_categoria ?? `sin-id-${index}`} value={categorias.id_categoria}>
                                {categorias.nombre}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {errors.categoria && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.categoria}
                          </p>
                        )}
                      </div>

                      {/* Estado */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getFieldLabel("estado")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {getFieldIcon("estado")}
                          </div>
                          <select
                            name="estado"
                            value={form.estado}
                            onChange={onChange}
                            className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white border-gray-200 hover:border-gray-300 focus:border-orange-500"
                          >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* Imagen */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getFieldLabel("imagen")} {!isEditing && "*"}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {getFieldIcon("imagen")}
                          </div>
                          <input
                            type="file"
                            name="imagen"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={onChange}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                              errors.imagen
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 focus:border-orange-500"
                            }`}
                          />
                        </div>
                        
                        {/* Preview de imagen */}
                        {imagePreviewUrl && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                            <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={imagePreviewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1 right-1">
                                <button
                                  type="button"
                                  onClick={() => onChange({ target: { name: 'imagen', type: 'file', files: [] } })}
                                  className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {form.imagen && form.imagen instanceof File ? (
                                // Información de archivo nuevo
                                <>
                                  <p>📁 {form.imagen?.name || 'Sin nombre'}</p>
                                  <p>📊 {form.imagen?.size ? (form.imagen.size / 1024).toFixed(1) : '0'} KB</p>
                                </>
                              ) : (
                                // Información de imagen existente
                                <p>🖼️ Imagen actual del producto</p>
                              )}
                            </div>
                          </div>
                        )}

                        {errors.imagen && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.imagen}
                          </p>
                        )}
                        {isEditing && (
                          <p className="mt-2 text-sm text-gray-500">
                            Opcional: Sube una nueva imagen solo si quieres cambiar la actual.
                          </p>
                        )}
                      </div>

                      {/* Separador visual para dimensiones */}
                      <div className="md:col-span-2">
                        <div className="flex items-center my-4">
                          <div className="flex-grow border-t border-gray-300"></div>
                          <span className="flex-shrink mx-4 text-gray-500 font-medium">Dimensiones y Peso (Opcional)</span>
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                      </div>

                      {/* Peso */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getFieldLabel("peso")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {getFieldIcon("peso")}
                          </div>
                          <input
                            type="number"
                            name="peso"
                            value={form.peso || ''}
                            onChange={onChange}
                            min="0"
                            step="0.01"
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                              errors.peso
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 focus:border-orange-500"
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {errors.peso && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.peso}
                          </p>
                        )}
                      </div>

                      {/* Ancho */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getFieldLabel("ancho")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {getFieldIcon("ancho")}
                          </div>
                          <input
                            type="number"
                            name="ancho"
                            value={form.ancho || ''}
                            onChange={onChange}
                            min="0"
                            step="0.01"
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                              errors.ancho
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 focus:border-orange-500"
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {errors.ancho && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.ancho}
                          </p>
                        )}
                      </div>

                      {/* Alto */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getFieldLabel("alto")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {getFieldIcon("alto")}
                          </div>
                          <input
                            type="number"
                            name="alto"
                            value={form.alto || ''}
                            onChange={onChange}
                            min="0"
                            step="0.01"
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                              errors.alto
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 focus:border-orange-500"
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {errors.alto && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.alto}
                          </p>
                        )}
                      </div>

                      {/* Profundidad */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getFieldLabel("profundidad")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {getFieldIcon("profundidad")}
                          </div>
                          <input
                            type="number"
                            name="profundidad"
                            value={form.profundidad || ''}
                            onChange={onChange}
                            min="0"
                            step="0.01"
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                              errors.profundidad
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 focus:border-orange-500"
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {errors.profundidad && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.profundidad}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    {submitting && uploadProgress > 0 && form.imagen && form.imagen instanceof File && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Subiendo imagen...</span>
                          <span className="text-sm text-gray-500">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            {isEditing ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            )}
                            <span>{isEditing ? "Actualizar Producto" : "Crear Producto"}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ProductoModal
