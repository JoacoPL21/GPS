import { formatearFecha, formatearPrecio, getEstadoTexto, getMetodoPagoTexto } from '../utils/formatters';

/**
 * Exporta datos de compras a formato CSV
 * @param {Array} data - Datos a exportar
 * @param {Object} options - Opciones de exportación
 * @returns {Promise<void>}
 */
export const exportToCSV = async (data, options = {}) => {
  const {
    filename = `export_${new Date().toISOString().split('T')[0]}.csv`,
    enviosData = {},
    includeShipping = true
  } = options;

  try {
    // Preparar datos para CSV
    const csvData = data.map(order => {
      const productos = (order.productos || []).map(p => 
        `${p.nombre || p.nombre_producto} (${p.cantidad} x ${formatearPrecio(p.precio || p.precio_unitario)})`
      ).join('; ');
      
      const envio = enviosData[order.id_compra || order.id];
      const infoEnvio = includeShipping && envio ? 
        `Orden: ${envio.transport_order_number || 'N/A'}, Estado: ${envio.current_status || 'N/A'}` : 
        'Sin procesar';

      return {
        'ID Compra': order.id_compra || order.id,
        'Fecha': formatearFecha(order.createdAt || order.fecha),
        'Cliente': order.cliente || 'N/A',
        'Email': order.email || 'N/A',
        'Teléfono': order.telefono || 'N/A',
        'Dirección': order.direccion || 'N/A',
        'Total': formatearPrecio(order.payment_amount || order.total),
        'Estado': getEstadoTexto(order.estado || order.payment_status),
        'Método de Pago': getMetodoPagoTexto(order.metodo_pago || order.payment_method),
        'ID de Pago': order.id_pago || 'N/A',
        'Productos': productos,
        'Información de Envío': infoEnvio,
        'Cantidad de Productos': (order.productos || []).length
      };
    });

    if (csvData.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    // Crear CSV
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escapar comillas y envolver en comillas si contiene coma o salto de línea
          const escapedValue = String(value).replace(/"/g, '""');
          return escapedValue.includes(',') || escapedValue.includes('\n') || escapedValue.includes('"') 
            ? `"${escapedValue}"` 
            : escapedValue;
        }).join(',')
      )
    ].join('\n');

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, count: csvData.length };
  } catch (error) {
    console.error('Error al exportar:', error);
    throw error;
  }
};

/**
 * Exporta todas las compras con filtros aplicados
 * @param {Array} orders - Lista de compras
 * @param {Object} filters - Filtros aplicados
 * @param {Object} enviosData - Datos de envíos
 * @returns {Promise<void>}
 */
export const exportAllCompras = async (orders, filters = {}, enviosData = {}) => {
  let dataToExport = [...orders];
  
  // Aplicar filtros de búsqueda
  if (filters.search) {
    dataToExport = dataToExport.filter((order) =>
      order.cliente?.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      String(order.id_compra || order.id).toLowerCase().includes(filters.search.toLowerCase())
    );
  }
  
  // Aplicar filtro de estado
  if (filters.filter && filters.filter !== "todas") {
    dataToExport = dataToExport.filter((order) => order.estado === filters.filter);
  }

  return exportToCSV(dataToExport, {
    filename: `compras_gps_${new Date().toISOString().split('T')[0]}.csv`,
    enviosData,
    includeShipping: true
  });
};

/**
 * Exporta solo las compras de la página actual
 * @param {Array} currentCompras - Compras de la página actual
 * @param {Object} enviosData - Datos de envíos
 * @returns {Promise<void>}
 */
export const exportCurrentCompras = async (currentCompras, enviosData = {}) => {
  return exportToCSV(currentCompras, {
    filename: `compras_gps_filtradas_${new Date().toISOString().split('T')[0]}.csv`,
    enviosData,
    includeShipping: true
  });
}; 