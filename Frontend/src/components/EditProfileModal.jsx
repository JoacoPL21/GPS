import { useState } from 'react'

const EditProfileModal = ({ isOpen, onClose, userProfile, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    nombreCompleto: userProfile?.nombreCompleto || '',
    email: userProfile?.email || '',
    telefono: userProfile?.telefono || ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Filtrar solo los campos que han cambiado
      const updatedFields = {}
      Object.keys(formData).forEach(key => {
        if (formData[key] !== userProfile[key] && formData[key].trim() !== '') {
          updatedFields[key] = formData[key].trim()
        }
      })

      if (Object.keys(updatedFields).length === 0) {
        alert('No hay cambios para guardar')
        return
      }

      await onProfileUpdated(updatedFields)
      onClose()
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Editar Perfil</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-amber-200 transition-colors"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-amber-50"
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-amber-50"
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-amber-50"
              placeholder="Ingresa tu número de teléfono"
            />
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
