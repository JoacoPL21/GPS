import { useState, useEffect } from 'react';
import { getProductosCompradosConValoracion } from '../../services/user.service';

export function useProductosCompradosConValoracion() {
  const [pendientes, setPendientes] = useState([]);
  const [realizados, setRealizados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductosCompradosConValoracion();
        if (res.status === 'Success') {
          const productos = res.data || [];
          setPendientes(productos.filter(p => !p.valoracion));
          setRealizados(productos.filter(p => !!p.valoracion));
        } else {
          setError(res.message);
        }
      } catch {
        setError('Error al obtener productos comprados');
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  return { pendientes, realizados, loading, error };
} 