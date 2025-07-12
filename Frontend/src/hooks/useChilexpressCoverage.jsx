import { useState } from "react";

/**
 * Hook para consultar la cobertura Chilexpress de una comuna específica
 * @returns {Object} { loading, error, cobertura, checkCobertura }
 */
export function useChilexpressCoverage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cobertura, setCobertura] = useState(null);

  /**
   * Consulta la cobertura para una región y comuna usando tu backend
   * @param {string} regionCode
   * @param {string} comunaCode
   */
  const checkCobertura = async (regionCode, comunaCode) => {
    setLoading(true);
    setError(null);
    setCobertura(null);

    try {
      const url = `/api/chilexpress/cobertura?regionCode=${regionCode}&comunaCode=${comunaCode}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("No se pudo consultar la cobertura en Chilexpress");
      }

      const data = await response.json();
      setCobertura(data.cobertura ?? false);
    } catch (err) {
      setError(err.message ?? "Error desconocido consultando cobertura");
      setCobertura(false);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, cobertura, checkCobertura };
}