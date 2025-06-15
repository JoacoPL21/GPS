// src/controller/webhook.controller.js
import { Payment } from 'mercadopago';
import mercadoPagoClient from '../config/mercadopago.js';
import { AppDataSource } from '../config/configDB.js';
import Transacciones from '../entity/Transacciones.js';

const payment = new Payment(mercadoPagoClient);

export const handleWebhook = async (req, res) => {
  try {
    console.log('📨 Webhook recibido:', req.body);
    
    const { type, data } = req.body;
    
    // Solo procesamos webhooks de pagos
    if (type === 'payment') {
      const paymentId = data.id;
      console.log('💳 Procesando pago ID:', paymentId);
      
      // Obtener el repositorio de transacciones
      const transaccionRepository = AppDataSource.getRepository(Transacciones);
      
      // Obtener información completa del pago desde MercadoPago
      const paymentInfo = await payment.get({ id: paymentId });
      console.log('📋 Info del pago:', {
        id: paymentInfo.id,
        status: paymentInfo.status,
        external_reference: paymentInfo.external_reference,
        amount: paymentInfo.transaction_amount
      });
      
      // Buscar si la transacción ya existe
      let transaccion = await transaccionRepository.findOne({
        where: { mercadopago_id: paymentId.toString() }
      });
      
      if (!transaccion) {
        console.log('✨ Creando nueva transacción...');
        
        // Crear nueva transacción
        transaccion = transaccionRepository.create({
          mercadopago_id: paymentId.toString(),
          external_reference: paymentInfo.external_reference,
          status: paymentInfo.status,
          payment_method: paymentInfo.payment_method_id,
          payment_type: paymentInfo.payment_type_id,
          transaction_amount: parseFloat(paymentInfo.transaction_amount),
          currency_id: paymentInfo.currency_id || 'CLP',
          payer_email: paymentInfo.payer?.email,
          installments: paymentInfo.installments || null,
          processing_mode: paymentInfo.processing_mode,
          // Campos de envío (si existen)
          shipping_id: paymentInfo.shipments?.[0]?.id?.toString() || null,
          shipping_status: paymentInfo.shipments?.[0]?.status || null,
          tracking_number: paymentInfo.shipments?.[0]?.tracking_number || null,
          shipping_address: paymentInfo.shipments?.[0]?.receiver_address || null,
          // Si tienes el ID del usuario, lo puedes obtener del external_reference
          // id_usuario: await getUserIdFromExternalReference(paymentInfo.external_reference)
        });
        
        await transaccionRepository.save(transaccion);
        console.log('✅ Transacción creada con ID:', transaccion.id);
        
      } else {
        console.log('🔄 Actualizando transacción existente...');
        
        // Actualizar transacción existente
        await transaccionRepository.update(
          { mercadopago_id: paymentId.toString() },
          {
            status: paymentInfo.status,
            payment_method: paymentInfo.payment_method_id,
            payment_type: paymentInfo.payment_type_id,
            shipping_id: paymentInfo.shipments?.[0]?.id?.toString() || null,
            shipping_status: paymentInfo.shipments?.[0]?.status || null,
            tracking_number: paymentInfo.shipments?.[0]?.tracking_number || null,
            shipping_address: paymentInfo.shipments?.[0]?.receiver_address || null,
            updatedAt: new Date()
          }
        );
        console.log('✅ Transacción actualizada');
      }
      
      // Si el pago fue aprobado, aquí puedes agregar lógica adicional
      if (paymentInfo.status === 'approved') {
        console.log('🎉 Pago aprobado! Ejecutando lógica post-pago...');
        
        // Ejemplo de lógica adicional que puedes implementar:
        // await updateOrderStatus(paymentInfo.external_reference, 'paid');
        // await updateProductStock(paymentInfo.external_reference);
        // await sendConfirmationEmail(paymentInfo.payer?.email);
        
        // Si tienes Mercado Envíos habilitado, crear el envío
        if (paymentInfo.shipments && paymentInfo.shipments.length > 0) {
          console.log('📦 Procesando información de envío...');
          // Aquí puedes agregar lógica específica para Mercado Envíos
        }
      }
      
      // Procesar otros estados
      if (paymentInfo.status === 'rejected') {
        console.log('❌ Pago rechazado');
        // await handleRejectedPayment(paymentInfo.external_reference);
      }
      
      if (paymentInfo.status === 'cancelled') {
        console.log('🚫 Pago cancelado');
        // await handleCancelledPayment(paymentInfo.external_reference);
      }
    }
    
    // Siempre responder OK a MercadoPago
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    console.error('Stack trace:', error.stack);
    // Aún así, responder OK para que MercadoPago no reintente
    res.status(200).send('OK');
  }
};

export const getTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaccionRepository = AppDataSource.getRepository(Transacciones);
    
    // Buscar por mercadopago_id o por external_reference
    const transaccion = await transaccionRepository.findOne({
      where: [
        { mercadopago_id: id },
        { external_reference: id }
      ],
      relations: ['usuario'] // Incluir datos del usuario si existe
    });
    
    if (!transaccion) {
      return res.status(404).json({ 
        error: 'Transacción no encontrada',
        id: id 
      });
    }
    
    res.json({
      id: transaccion.id,
      mercadopago_id: transaccion.mercadopago_id,
      external_reference: transaccion.external_reference,
      status: transaccion.status,
      amount: transaccion.transaction_amount,
      currency: transaccion.currency_id,
      payment_method: transaccion.payment_method,
      payment_type: transaccion.payment_type,
      installments: transaccion.installments,
      processing_mode: transaccion.processing_mode,
      payer_email: transaccion.payer_email,
      shipping_status: transaccion.shipping_status,
      tracking_number: transaccion.tracking_number,
      shipping_address: transaccion.shipping_address,
      usuario: transaccion.usuario ? {
        id: transaccion.usuario.id_usuario,
        nombre: transaccion.usuario.nombreCompleto,
        email: transaccion.usuario.email
      } : null,
      created_at: transaccion.createdAt,
      updated_at: transaccion.updatedAt
    });
  } catch (error) {
    console.error('❌ Error obteniendo transacción:', error);
    res.status(500).json({ error: error.message });
  }
};

// Función auxiliar para obtener el ID del usuario desde external_reference
// Puedes implementar esta función según tu lógica de negocio
async function getUserIdFromExternalReference(externalReference) {
  if (!externalReference) return null;
  
  // Ejemplo: si tu external_reference tiene formato "ORDER_123_USER_456"
  // const userIdMatch = externalReference.match(/USER_(\d+)/);
  // return userIdMatch ? parseInt(userIdMatch[1]) : null;
  
  return null; // Por ahora retorna null, implementa según tu necesidad
}