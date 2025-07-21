const BannersNotificacion = ({ 
  advertenciaSincronizacion, 
  setAdvertenciaSincronizacion, 
  mostrarEliminados 
}) => {
  return (
    <>
      {/* Banner de información sobre sincronización */}
      {advertenciaSincronizacion && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Los datos pueden estar desactualizados. Si acabas de realizar cambios en otra ventana o dispositivo, 
                utiliza el botón <strong>Refrescar</strong> para sincronizar los datos.
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setAdvertenciaSincronizacion(false)}
                  className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-400 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner informativo para productos eliminados */}
      {mostrarEliminados && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Vista de productos eliminados:</strong> Estos productos han sido eliminados del inventario pero se mantienen para referencia histórica. 
                Puedes <strong>restaurar</strong> cualquier producto usando el botón verde, y será restaurado como <strong>'inactivo'</strong> para que puedas revisarlo y editarlo antes de publicarlo nuevamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BannersNotificacion;
