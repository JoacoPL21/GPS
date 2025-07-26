import { useState, useEffect } from 'react';
import { getAllComprasAdmin } from '../../services/compras.service';
import { getEnvioPorCompra, procesarEnvio, reimprimirEtiqueta } from '../../services/envios.service';
import axios from '../../services/root.service.js';

export const useAdminCompras = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [enviosData, setEnviosData] = useState({});
  const [processingShipment, setProcessingShipment] = useState(null);
  const [modalEtiqueta, setModalEtiqueta] = useState({ 
    open: false, 
    url: null, 
    mimeType: null, 
    etiquetaData: null 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompras = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllComprasAdmin();
      if (res.status === "Success") {
        setOrders(res.data || []);
      } else {
        setError('Error al cargar las compras');
      }
    } catch (error) {
      setError('Error al cargar las compras');
      console.error('Error fetching compras:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEnvioCompra = async (id_compra, forzarRecarga = false) => {
    if (enviosData[id_compra] && !forzarRecarga) return;
    try {
      const { data } = await getEnvioPorCompra(id_compra);
      if (data?.data) {
        setEnviosData(prev => ({ ...prev, [id_compra]: data.data }));
      }
    } catch (error) {
      console.error('Error loading shipment:', error);
    }
  };

  const handleProcesarEnvio = async (order) => {
    setProcessingShipment(order.id_compra);
    try {
      const serviceCode = "3";
      const destinationCoverage = "STGO";
      const { error } = await procesarEnvio(order.id_compra, serviceCode, destinationCoverage);
      if (error) {
        alert(error?.response?.data?.message || error);
      } else {
        alert('Orden de transporte creada exitosamente');
        await cargarEnvioCompra(order.id_compra, true);
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Error interno al procesar el envío');
    } finally {
      setProcessingShipment(null);
    }
  };

  const handleVerEtiqueta = async (transportOrderNumber) => {
    try {
      const response = await reimprimirEtiqueta(transportOrderNumber);
      if (response.error) {
        alert(`Error al obtener etiqueta: ${response.error}`);
      } else {
        const etiquetaData = response.data?.data || response.data;
        if (etiquetaData?.labelData) {
          const labelData = etiquetaData.labelData;
          let mimeType = 'image/jpeg';
          if (labelData.startsWith('/9j/')) mimeType = 'image/jpeg';
          else if (labelData.startsWith('iVBORw0KGgo')) mimeType = 'image/png';
          else if (labelData.startsWith('JVBERi0x')) mimeType = 'application/pdf';
          const byteCharacters = atob(labelData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          const url = window.URL.createObjectURL(blob);
          setModalEtiqueta({ open: true, url, mimeType, etiquetaData });
        } else {
          alert('No se encontraron datos de etiqueta en la respuesta');
        }
      }
    } catch {
      alert('Error interno al obtener la etiqueta');
    }
  };

  const handleReimprimirEtiqueta = async (transportOrderNumber) => {
    try {
      const response = await reimprimirEtiqueta(transportOrderNumber);
      if (response.error) {
        alert(`Error al reimprimir etiqueta: ${response.error}`);
      } else {
        const etiquetaData = response.data?.data || response.data;
        if (etiquetaData?.labelData) {
          const labelData = etiquetaData.labelData;
          let mimeType = 'image/jpeg';
          let fileExtension = 'jpg';
          if (labelData.startsWith('/9j/')) { mimeType = 'image/jpeg'; fileExtension = 'jpg'; }
          else if (labelData.startsWith('iVBORw0KGgo')) { mimeType = 'image/png'; fileExtension = 'png'; }
          else if (labelData.startsWith('JVBERi0x')) { mimeType = 'application/pdf'; fileExtension = 'pdf'; }
          const byteCharacters = atob(labelData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `etiqueta_${etiquetaData.transportOrderNumber || transportOrderNumber}_${etiquetaData.reference || 'GPS'}.${fileExtension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          alert('Etiqueta descargada exitosamente');
        } else {
          alert('Etiqueta reimpresa exitosamente, pero no se pudo generar el archivo de descarga');
        }
      }
    } catch {
      alert('Error interno al reimprimir la etiqueta');
    }
  };

  const handleMarcarEnTransito = async (order) => {
    try {
      await axios.patch(`/envios/compras/${order.id_compra}/estado-envio`, { estado_envio: 'en_transito' });
      alert('Compra marcada como entregada al courier (en tránsito)');
      setOrders((prev) => prev.map(o => o.id_compra === order.id_compra ? { ...o, estado: 'en_transito' } : o));
    } catch (error) {
      alert(error?.response?.data?.message || 'Error al actualizar el estado de envío');
    }
  };

  const closeModalEtiqueta = () => {
    if (modalEtiqueta.url) window.URL.revokeObjectURL(modalEtiqueta.url);
    setModalEtiqueta({ open: false, url: null, mimeType: null, etiquetaData: null });
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      orders.forEach(order => {
        cargarEnvioCompra(order.id_compra);
      });
    }
  }, [orders]);

  let filteredOrders = [...orders];
  if (search) {
    filteredOrders = filteredOrders.filter((order) =>
      order.cliente?.toLowerCase().includes(search.toLowerCase()) ||
      order.email?.toLowerCase().includes(search.toLowerCase()) ||
      String(order.id_compra).toLowerCase().includes(search.toLowerCase())
    );
  }
  if (filter !== "todas") {
    filteredOrders = filteredOrders.filter((order) => order.estado === filter);
  }

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompras = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const stats = {
    total: orders.length,
    enviadas: orders.filter((c) => c.estado === "en_transito").length,
    entregadas: orders.filter((c) => c.estado === "entregado").length,
    en_preparacion: orders.filter((c) => c.estado === "en_preparacion").length,
  };

  return {
    orders,
    search,
    filter,
    currentPage,
    itemsPerPage,
    enviosData,
    processingShipment,
    modalEtiqueta,
    loading,
    error,
    filteredOrders,
    currentCompras,
    totalPages,
    startIndex,
    endIndex,
    stats,
    setSearch,
    setFilter,
    handlePageChange,
    handleItemsPerPageChange,
    handleProcesarEnvio,
    handleVerEtiqueta,
    handleReimprimirEtiqueta,
    handleMarcarEnTransito,
    closeModalEtiqueta,
    fetchCompras,
  };
}; 