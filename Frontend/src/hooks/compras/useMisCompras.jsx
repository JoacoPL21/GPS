import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComprasUsuario } from '../../services/valoraciones.service';
import { getEnvioPorCompra } from '../../services/envios.service';

export const useMisCompras = () => {
  const { authUser } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enviosData, setEnviosData] = useState({});
  const [compraExpandida, setCompraExpandida] = useState(null);

  const cargarCompras = async () => {
    if (!authUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getComprasUsuario();
      if (error) {
        setError(error);
      } else {
        setCompras(data.data || []);
      }
    } catch (error) {
      setError('Error al cargar las compras');
      console.error('Error al cargar compras:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEnvioCompra = async (id_compra) => {
    if (enviosData[id_compra]) return; // Ya está cargado

    try {
      const { data, error } = await getEnvioPorCompra(id_compra);
      if (!error && data?.data) {
        setEnviosData(prev => ({
          ...prev,
          [id_compra]: data.data
        }));
      }
      // Si no hay envío (404), es normal, no hacer nada
    } catch (error) {
      // Error silencioso para 404s
      if (!error.message?.includes('404')) {
        console.error('Error al cargar envío:', error);
      }
    }
  };



  useEffect(() => {
    cargarCompras();
  }, [authUser]);

  useEffect(() => {
    if (compras.length > 0) {
      compras.forEach(compra => {
        if (compra.payment_status === 'approved' || compra.estado === 'approved') {
          cargarEnvioCompra(compra.id_compra || compra.id);
        }
      });
    }
  }, [compras]);

  return {
    compras,
    loading,
    error,
    enviosData,
    compraExpandida,
    setCompraExpandida,
    cargarCompras,
  };
}; 