import { useState, useEffect } from "react";

export function useChilexpressData() {
  const [regiones, setRegiones] = useState([]);
  const [comunasPorRegion, setComunasPorRegion] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRegiones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/chilexpress/regiones`);
      
      if (!response.ok) {
        throw new Error('Error al cargar regiones');
      }
      
      const data = await response.json();
      setRegiones(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComunasPorRegion = async (regionCode) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/chilexpress/areas-cobertura/${regionCode}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar comunas');
      }
      
      const data = await response.json();
      
      // Agrupar por comuna (eliminar duplicados por diferentes queryMode)
      const comunasUnicas = data.data.reduce((acc, area) => {
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