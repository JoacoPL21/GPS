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
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Lógica de paginación
  const totalPages = Math.ceil(compras.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompras = compras.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return {
    compras,
    loading,
    error,
    enviosData,
    compraExpandida,
    setCompraExpandida,
    cargarCompras,
    // Paginación
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    currentCompras,
    handlePageChange,
    handleItemsPerPageChange,
  };
}; 