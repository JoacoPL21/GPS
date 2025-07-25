const InstruccionesModoSeleccion = ({ modoSeleccion }) => {
  if (!modoSeleccion) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-blue-800 text-sm">
          <strong>Modo selección activado:</strong> Haz clic en las tarjetas para seleccionarlas. Los botones de
          editar y eliminar están deshabilitados.
        </p>
      </div>
    </div>
  );
};

export default InstruccionesModoSeleccion;
