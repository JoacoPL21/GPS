export const formatearFecha = (fechaString) => {
  try {
    const fecha = new Date(fechaString);
    
    
    if (isNaN(fecha.getTime())) {
      throw new Error('Fecha inválida');
    }
    
    return fecha.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha no disponible';
  }
};


export const formatearPrecio = (precio) => {
  // Manejar valores undefined, null o no numéricos
  const valor = parseFloat(precio);
  if (isNaN(valor)) {
    return '$0';
  }
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(valor);
};


export const getEstadoColor = (estado) => {
  switch (estado) {
    case 'completada':
    case 'entregado':
      return 'bg-green-100 text-green-800';
    case 'pendiente':
    case 'en_preparacion':
      return 'bg-yellow-100 text-yellow-800';
    case 'en_proceso':
    case 'en_transito':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


export const getEstadoPagoColor = (estado) => {
  switch (estado) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getEstadoPagoTexto = (estado) => {
  switch (estado) {
    case 'approved':
      return 'Pagado';
    case 'pending':
      return 'Pendiente';
    case 'rejected':
      return 'Rechazado';
    default:
      return 'Desconocido';
  }
};


export const getEstadoTexto = (estado) => {
  switch (estado) {
    case 'en_preparacion':
      return 'En preparación';
    case 'en_transito':
      return 'En tránsito';
    case 'entregado':
      return 'Entregado';
    default:
      return estado || 'Pendiente';
  }
};


export const getMetodoPagoTexto = (metodo) => {
  switch (metodo) {
    case 'credit_card':
      return 'Tarjeta de Crédito';
    case 'debit_card':
      return 'Tarjeta de Débito';
    default:
      return 'N/A';
  }
};


export const getEstadoEnvioInfo = (envio) => {
  if (!envio) {
    return {
      texto: 'Sin procesar',
      color: 'text-gray-500',
      icono: 'FaInfoCircle',
      descripcion: 'El envío aún no ha sido procesado'
    };
  }

  if (envio.transport_order_number) {
    return {
      texto: envio.current_status || 'En proceso',
      color: 'text-blue-600',
      icono: 'FaTruck',
      descripcion: envio.current_location || 'En tránsito',
      transportOrder: envio.transport_order_number
    };
  }

  return {
    texto: 'Preparando envío',
    color: 'text-yellow-600',
    icono: 'FaBox',
    descripcion: 'Preparando paquete para despacho'
  };
}; 