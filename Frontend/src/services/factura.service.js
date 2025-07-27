import { formatearFecha, formatearPrecio, getMetodoPagoTexto } from '../utils/formatters';

export const generarFacturaPDF = async (compra) => {
  try {
    // Importar jsPDF dinámicamente
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const idCompra = compra.id_compra || compra.id;
    
    // Configuración de la página
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    
    // Título de la factura
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA', pageWidth / 2, 30, { align: 'center' });
    
    // Información de la empresa
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('SERVICIOS DE CONSTRUCCION GERARDO SANCHEZ ROJAS E.I.R.L.', margin, 50);
    doc.text('RUT: 76.118.582-9', margin, 60);
    doc.text('Dirección: LOS ACACIOS 589 VILLA SAN PEDRO LOS ALAMOS', margin, 70);
    doc.text('Teléfono: +56 2 2345 6789', margin, 80);
    doc.text('Email: contacto@gps.cl', margin, 90);
    
    // Información del cliente
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL CLIENTE:', margin, 110);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const clienteNombre = compra.cliente || `${compra.nombre || ''} ${compra.apellido || ''}`.trim() || 'Cliente';
    doc.text(`Nombre: ${clienteNombre}`, margin, 120);
    doc.text(`Email: ${compra.email || 'N/A'}`, margin, 130);
    doc.text(`Teléfono: ${compra.telefono || 'N/A'}`, margin, 140);
    
    if (compra.direccion) {
      doc.text(`Dirección: ${compra.direccion}`, margin, 150);
      const ciudadRegion = [compra.ciudad, compra.region].filter(Boolean).join(', ');
      if (ciudadRegion) {
        doc.text(`Ciudad/Región: ${ciudadRegion}`, margin, 160);
      }
      if (compra.codigo_postal) {
        doc.text(`Código Postal: ${compra.codigo_postal}`, margin, 170);
      }
    }
    
    // Información de la factura
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DE LA FACTURA:', margin, 190);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Número de Factura: #${idCompra}`, margin, 200);
    doc.text(`Fecha: ${formatearFecha(compra.createdAt || compra.fecha)}`, margin, 210);
    doc.text(`Método de Pago: ${getMetodoPagoTexto(compra.payment_method || compra.metodo_pago)}`, margin, 220);
    doc.text(`ID de Pago: ${compra.payment_id || compra.id_pago || compra.external_reference || 'N/A'}`, margin, 230);
    
    // Tabla de productos
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PRODUCTOS:', margin, 250);
    
    // Encabezados de la tabla
    const tableY = 260;
    const colX = [margin, margin + 80, margin + 110, margin + 140];
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Producto', colX[0], tableY);
    doc.text('Cant.', colX[1], tableY);
    doc.text('Precio', colX[2], tableY);
    doc.text('Total', colX[3], tableY);
    
    // Línea separadora
    doc.line(margin, tableY + 5, pageWidth - margin, tableY + 5);
    
    // Productos
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let currentY = tableY + 15;
    
    (compra.productos || []).forEach((producto) => {
      const nombre = producto.nombre || producto.nombre_producto || 'Producto';
      const cantidad = producto.cantidad || 1;
      const precio = producto.precio_unitario || producto.precio || 0;
      const total = cantidad * precio;
      
      // Verificar si necesitamos una nueva página
      if (currentY > 250) {
        doc.addPage();
        currentY = 30;
      }
      
      // Nombre del producto (puede ser largo, lo truncamos)
      const nombreTruncado = nombre.length > 25 ? nombre.substring(0, 22) + '...' : nombre;
      doc.text(nombreTruncado, colX[0], currentY);
      doc.text(cantidad.toString(), colX[1], currentY);
      doc.text(formatearPrecio(precio), colX[2], currentY);
      doc.text(formatearPrecio(total), colX[3], currentY);
      
      currentY += 8;
    });
    
    // Línea separadora final
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
    
    // Total
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const totalCompra = compra.payment_amount || compra.total || 0;
    doc.text(`TOTAL: ${formatearPrecio(totalCompra)}`, margin + 110, currentY + 15);
    
    // Pie de página
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Gracias por su compra', pageWidth / 2, doc.internal.pageSize.height - 20, { align: 'center' });
    doc.text('SERVICIOS DE CONSTRUCCION GERARDO SANCHEZ ROJAS E.I.R.L.', pageWidth / 2, doc.internal.pageSize.height - 15, { align: 'center' });
    
    // Descargar el PDF
    const filename = `factura_${idCompra}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error al generar factura:', error);
    throw new Error('Error al generar la factura PDF');
  }
};

export const generarFacturaTexto = async (compra) => {
  try {
    const idCompra = compra.id_compra || compra.id;
    const clienteNombre = compra.cliente || `${compra.nombre || ''} ${compra.apellido || ''}`.trim() || 'Cliente';
    
    const facturaContent = `
FACTURA SERVICIOS DE CONSTRUCCION GERARDO SANCHEZ ROJAS E.I.R.L.
===============================================================

INFORMACIÓN DE LA EMPRESA:
SERVICIOS DE CONSTRUCCION GERARDO SANCHEZ ROJAS E.I.R.L.
RUT: 76.118.582-9
Dirección: LOS ACACIOS 589 VILLA SAN PEDRO LOS ALAMOS
Teléfono: +56 2 2345 6789
Email: contacto@gps.cl

DATOS DEL CLIENTE:
Nombre: ${clienteNombre}
Email: ${compra.email || 'N/A'}
Teléfono: ${compra.telefono || 'N/A'}
${compra.direccion ? `Dirección: ${compra.direccion}` : ''}
${compra.ciudad || compra.region ? `Ciudad/Región: ${[compra.ciudad, compra.region].filter(Boolean).join(', ')}` : ''}
${compra.codigo_postal ? `Código Postal: ${compra.codigo_postal}` : ''}

INFORMACIÓN DE LA FACTURA:
Número de Factura: #${idCompra}
Fecha: ${formatearFecha(compra.createdAt || compra.fecha)}
Método de Pago: ${getMetodoPagoTexto(compra.payment_method || compra.metodo_pago)}
ID de Pago: ${compra.payment_id || compra.id_pago || compra.external_reference || 'N/A'}

PRODUCTOS:
${(compra.productos || []).map((producto, index) => {
  const nombre = producto.nombre || producto.nombre_producto || 'Producto';
  const cantidad = producto.cantidad || 1;
  const precio = producto.precio_unitario || producto.precio || 0;
  const total = cantidad * precio;
  return `${index + 1}. ${nombre} - Cantidad: ${cantidad} - Precio: ${formatearPrecio(precio)} - Total: ${formatearPrecio(total)}`;
}).join('\n')}

TOTAL: ${formatearPrecio(compra.payment_amount || compra.total || 0)}

Gracias por su compra
SERVICIOS DE CONSTRUCCION GERARDO SANCHEZ ROJAS E.I.R.L.
    `.trim();
    
    // Crear y descargar archivo de texto
    const blob = new Blob([facturaContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `factura_${idCompra}_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return { success: true, filename: `factura_${idCompra}_${new Date().toISOString().split('T')[0]}.txt` };
  } catch (error) {
    console.error('Error al generar factura de texto:', error);
    throw new Error('Error al generar la factura de texto');
  }
}; 