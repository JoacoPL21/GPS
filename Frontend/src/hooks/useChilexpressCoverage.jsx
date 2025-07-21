import { useState } from "react";

export function useChilexpressCoverage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cobertura, setCobertura] = useState(null);
  const [coberturaData, setCoberturaData] = useState(null);

  const checkCobertura = async (regionCode, comunaCode) => {
    setLoading(true);
    setError(null);
    setCobertura(null);
    setCoberturaData(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const url = `${apiUrl}/chilexpress/cobertura?regionCode=${regionCode}&comunaCode=${comunaCode}`;
      
      console.log('Consultando:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("No se pudo consultar la cobertura en Chilexpress");
      }

      const data = await response.json();
      setCobertura(data.cobertura ?? false);
      setCoberturaData(data.data || null);
      
      if (!data.cobertura && data.message) {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message ?? "Error desconocido consultando cobertura");
      setCobertura(false);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, cobertura, coberturaData, checkCobertura };
}