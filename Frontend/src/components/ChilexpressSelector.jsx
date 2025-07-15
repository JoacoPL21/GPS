import { useState, useEffect } from "react";
import { useChilexpressData } from "../hooks/useChileexpressData.jsx"

export default function ChilexpressRegionComunaSelector({ 
  regionValue, 
  comunaValue, 
  onChange,
  regionError,
  comunaError 
}) {
  const { regiones, comunasPorRegion, loading, error, fetchComunasPorRegion } = useChilexpressData();
  const [selectedRegion, setSelectedRegion] = useState(regionValue || "");
  const [selectedComuna, setSelectedComuna] = useState(comunaValue || "");

  // Cargar comunas cuando se selecciona una región
  useEffect(() => {
    if (selectedRegion && selectedRegion !== regionValue) {
      fetchComunasPorRegion(selectedRegion);
    }
  }, [selectedRegion, fetchComunasPorRegion, regionValue]);

  // Sincronizar con valores externos
  useEffect(() => {
    if (regionValue !== selectedRegion) {
      setSelectedRegion(regionValue || "");
    }
  }, [regionValue, selectedRegion]);

  useEffect(() => {
    if (comunaValue !== selectedComuna) {
      setSelectedComuna(comunaValue || "");
    }
  }, [comunaValue, selectedComuna]);

  const handleRegionChange = (e) => {
    const regionCode = e.target.value;
    setSelectedRegion(regionCode);
    setSelectedComuna(""); // Reset comuna cuando cambia región
    
    if (onChange) {
      onChange({ region: regionCode, comuna: "" });
    }
    
    if (regionCode) {
      fetchComunasPorRegion(regionCode);
    }
  };

  const handleComunaChange = (e) => {
    const comunaCode = e.target.value;
    setSelectedComuna(comunaCode);
    
    if (onChange) {
      onChange({ region: selectedRegion, comuna: comunaCode });
    }
  };

  const comunasDisponibles = selectedRegion ? comunasPorRegion[selectedRegion] || [] : [];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Selector de Región */}
      <div className="group">
        <label className="block text-sm font-semibold text-amber-800 mb-2">
          Región
          <span className="text-red-600 ml-1">*</span>
        </label>
        <div className="relative">
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            disabled={loading}
            className={`w-full border-2 ${
              regionError ? 'border-red-500' : 'border-amber-200'
            } rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300 appearance-none bg-white disabled:opacity-50`}
          >
            <option value="">Selecciona una región</option>
            {regiones.map((region) => (
              <option key={region.regionId} value={region.regionId}>
                {region.regionName}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {regionError && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {regionError}
          </p>
        )}
      </div>

      {/* Selector de Comuna */}
      <div className="group">
        <label className="block text-sm font-semibold text-amber-800 mb-2">
          Comuna
          <span className="text-red-600 ml-1">*</span>
        </label>
        <div className="relative">
          <select
            value={selectedComuna}
            onChange={handleComunaChange}
            disabled={loading || !selectedRegion}
            className={`w-full border-2 ${
              comunaError ? 'border-red-500' : 'border-amber-200'
            } rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300 appearance-none bg-white disabled:opacity-50`}
          >
            <option value="">
              {!selectedRegion 
                ? "Selecciona una región primero" 
                : loading 
                  ? "Cargando comunas..." 
                  : "Selecciona una comuna"
              }
            </option>
            {comunasDisponibles.map((comuna) => (
              <option key={comuna.code} value={comuna.code}>
                {comuna.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {comunaError && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {comunaError}
          </p>
        )}
      </div>

      {/* Mensaje de error general */}
      {error && (
        <div className="col-span-2 text-red-500 text-sm p-3 bg-red-50 rounded-xl border border-red-200 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="col-span-2 text-amber-700 text-sm p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center">
          <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando datos de Chilexpress...
        </div>
      )}
    </div>
  );
}