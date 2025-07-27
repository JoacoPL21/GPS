import { useState, useEffect } from "react";

export function useChilexpressData() {
  const [regiones, setRegiones] = useState([]);
  const [comunasPorRegion, setComunasPorRegion] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL=import.meta.env.VITE_BASE_URL;
  const fetchRegiones = async () => {
    try {
      setLoading(true);
      setError(null);
     
      const response = await fetch(`${API_URL}/chilexpress/regiones`);

      if (!response.ok) {
        throw new Error('Error al cargar regiones');
      }
      
      const data = await response.json();
      console.log('Respuesta de regiones:', data); // Debug
      
      // El backend devuelve { success: true, data: [...] }
      setRegiones(data.data || []);
    } catch (err) {
      console.error('Error en fetchRegiones:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComunasPorRegion = async (regionCode) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/chilexpress/areas-cobertura/${regionCode}`);

      if (!response.ok) {
        throw new Error('Error al cargar comunas');
      }
      
      const data = await response.json();
      console.log('Respuesta de comunas:', data); // Debug
      
      // El backend devuelve { success: true, data: [...] }
      const areasCobertura = data.data || [];
      
      // Agrupar por comuna (eliminar duplicados por diferentes queryMode)
      const comunasUnicas = areasCobertura.reduce((acc, area) => {
        if (!acc[area.ineCountyCode]) {
          acc[area.ineCountyCode] = {
            code: area.ineCountyCode,
            name: area.countyName,
            regionCode: area.regionCode
          };
        }
        return acc;
      }, {});
      
      setComunasPorRegion(prev => ({
        ...prev,
        [regionCode]: Object.values(comunasUnicas).sort((a, b) => a.name.localeCompare(b.name))
      }));
      
    } catch (err) {
      console.error('Error en fetchComunasPorRegion:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegiones();
  }, []);

  return {
    regiones,
    comunasPorRegion,
    loading,
    error,
    fetchComunasPorRegion
  };
}