import axios from './root.service.js';

// Crear orden de transporte
export const procesarEnvio = async (id_compra, serviceCode, destinationCoverage) => {
  try {
    const response = await axios.post(`/envios/procesar`, {
      id_compra,
      serviceCode,
      destinationCoverage
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error al procesar envío:', error);
    return { 
      data: null, 
      error: error.response?.data?.message || 'Error al procesar el envío' 
    };
  }
};

// Obtener tracking de un envío
export const getTracking = async (id_compra) => {
  try {
    const response = await axios.get(`/envios/tracking/${id_compra}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error al obtener tracking:', error);
    return { 
      data: null, 
      error: error.response?.data?.message || 'Error al obtener el seguimiento' 
    };
  }
};

// Obtener todos los envíos (admin)
export const getAllEnvios = async () => {
  try {
    const response = await axios.get(`/envios/admin/all`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error al obtener envíos:', error);
    return { 
      data: null, 
      error: error.response?.data?.message || 'Error al obtener los envíos' 
    };
  }
};

// Reimprimir etiqueta
export const reimprimirEtiqueta = async (transport_order_number) => {
  try {
    const response = await axios.post(`/envios/reimprimir-etiqueta`, {
      transport_order_number
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error al reimprimir etiqueta:', error);
    return { 
      data: null, 
      error: error.response?.data?.message || 'Error al reimprimir la etiqueta' 
    };
  }
};

// Obtener envío por compra
export const getEnvioPorCompra = async (id_compra) => {
  try {
    const response = await axios.get(`/envios/compra/${id_compra}`);
    return { data: response.data, error: null };
  } catch (error) {
    // No mostrar error en consola para 404s (envío no encontrado es normal)
    if (error.response?.status !== 404) {
      console.error('Error al obtener envío:', error);
    }
    return { 
      data: null, 
      error: error.response?.data?.message || 'Error al obtener el envío' 
    };
  }
}; 