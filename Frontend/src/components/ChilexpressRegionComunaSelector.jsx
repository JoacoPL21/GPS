import { useState, useEffect } from "react";
import { useChilexpressData } from "../hooks/useChilexpressData";

export default function ChilexpressRegionComunaSelector({ 
  regionValue, 
  comunaValue, 
  onChange 
}) {
  const { regiones, comunasPorRegion, loading, error, fetchComunasPorRegion } = useChilexpressData();
  const [selectedRegion, setSelectedRegion] = useState(regionValue || "");
  const [selectedComuna, setSelectedComuna] = useState(comunaValue || "");

  // Cargar comunas cuando se selecciona una región
  useEffect(() => {
    if (selectedRegion && selectedRegion !== regionValue) {
      fetchComunasPorRegion(selectedRegion);
    }
  }, [selectedRegion]);

  // Sincronizar con valores externos
  useEffect(() => {
    if (regionValue !== selectedRegion) {
      setSelectedRegion(regionValue || "");
    }
  }, [regionValue]);

  useEffect(() => {
    if (comunaValue !== selectedComuna) {
      setSelectedComuna(comunaValue || "");
    }
  }, [comunaValue]);

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
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector de Región */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Región *
          </label>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50"
          >
            <option value="">Selecciona una región</option>
            {regiones.map((region) => (
              <option key={region.regionId} value={region.regionId}>
                {region.regionName}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Comuna */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comuna *
          </label>
          <select
            value={selectedComuna}
            onChange={handleComunaChange}
            disabled={loading || !selectedRegion}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50"
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
        </div>
      </div>

      {loading && (
        <div className="text-amber-700 text-sm">
          Cargando datos de Chilexpress...
        </div>
      )}
    </div>
  );
}