import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComprasUsuario } from '../../services/valoraciones.service';
import { getEnvioPorCompra, getTracking } from '../../services/envios.service';

export const useMisCompras = () => {
  const { authUser } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enviosData, setEnviosData] = useState({});
  const [compraExpandida, setCompraExpandida] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState({});

  // Cargar compras del usuario
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

  // Cargar información de envío para una compra
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

  // Actualizar tracking de un envío
  const actualizarTracking = async (id_compra) => {
    setLoadingTracking(prev => ({ ...prev, [id_compra]: true }));

    try {
      const { data, error } = await getTracking(id_compra);
      if (!error && data?.data) {
        setEnviosData(prev => ({
          ...prev,
          [id_compra]: data.data
        }));
        alert('Estado de envío actualizado');
      } else {
        // Si hay error, mostrar mensaje pero no es crítico
        alert(`No se pudo actualizar desde Chilexpress, pero aquí tienes la información actual del envío. ${error || ''}`);
      }
    } catch (error) {
      console.error('Error al actualizar tracking:', error);
      alert('Error al actualizar el estado del envío. La información mostrada es la última disponible.');
    } finally {
      setLoadingTracking(prev => ({ ...prev, [id_compra]: false }));
    }
  };

  // Cargar compras al montar el componente
  useEffect(() => {
    cargarCompras();
  }, [authUser]);

  // Cargar envíos para compras aprobadas
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
    // State
    compras,
    loading,
    error,
    enviosData,
    compraExpandida,
    loadingTracking,

    // Actions
    setCompraExpandida,
    actualizarTracking,
    cargarCompras,
  };
}; 