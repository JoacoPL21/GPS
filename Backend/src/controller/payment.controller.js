import { Preference, Payment } from 'mercadopago';
import mercadoPagoClient from '../config/mercadopago.js';
import { PaymentService } from '../services/payment.service.js';
import { CompraTemporalService } from "../services/compraTemporal.service.js";
import { FRONTEND_URL } from '../config/configENV.js';
import crypto from 'crypto';

const preference = new Preference(mercadoPagoClient);
const compraTemporalService = new CompraTemporalService();

export const createPreference = async (req, res) => {
  try {
    const { items, external_reference, shipping_info } = req.body;

    // Guardar temporalmente datos personales y productos
    await compraTemporalService.saveCompraTemporal(external_reference, items, shipping_info);

    const body = {
      items,
      external_reference,
      auto_return: "approved",
      back_urls: {
        success: `${FRONTEND_URL}/success`,
        failure: `${FRONTEND_URL}/failure`,
        pending: `${FRONTEND_URL}/pending`
      },
    };

    const response = await preference.create({ body });
    res.status(200).json({ id: response.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const signatureHeader = req.headers['x-signature'];
    const secret = process.env.MP_WEBHOOK_SECRET?.trim();
    const event = req.webhookBody;
    const isSandbox = event && event.live_mode === false;

    if (!isSandbox) {
      if (!signatureHeader || !secret) {
        console.error('Faltan cabeceras necesarias o secreto');
        return res.status(401).json({ error: 'Firma inválida' });
      }
      const signatureParts = signatureHeader.split(',');
      const tsPart = signatureParts.find(part => part.startsWith('ts='));
      const v1Part = signatureParts.find(part => part.startsWith('v1='));
      if (!tsPart || !v1Part) {
        console.error('Formato de firma inválido:', signatureHeader);
        return res.status(401).json({ error: 'Formato de firma inválido' });
      }
      const timestamp = tsPart.split('=')[1];
      const signature = v1Part.split('=')[1];
      const payload = req.rawBody;
      const signingData = `${payload}:${timestamp}`;
      const generatedSignature = crypto.createHmac('sha256', secret).update(signingData).digest('hex');
      if (signature !== generatedSignature) {
        console.error('Firma inválida recibida:', signature, 'esperada:', generatedSignature);
        return res.status(401).json({ error: 'Firma inválida' });
      }
    } else {
      console.warn('[Sandbox] Ignorando validación de firma de webhook');
    }

    console.log('Webhook recibido:', JSON.stringify(event, null, 2));

    if (event.type === 'payment') {
      const paymentId = event.data.id;
      const payment = new Payment(mercadoPagoClient);

      try {
        const paymentData = await payment.get({ id: paymentId });

        const transactionData = {
          payment_id: paymentData.id,
          status: paymentData.status,
          external_reference: paymentData.external_reference,
          amount: paymentData.transaction_amount,
          payment_type: paymentData.payment_type_id,
          merchant_order_id: paymentData.order?.id || 'N/A',
          preference_id: paymentData.preference_id || 'N/A',
          email: paymentData.payer?.email || "" 
        };

        // Recuperar productos y datosPersonales usando external_reference
        const temporalData = await compraTemporalService.getCompraTemporal(transactionData.external_reference);
        const productos = temporalData ? temporalData.productos : [];
        const datosPersonales = temporalData ? temporalData.datosPersonales : {};

        const paymentService = new PaymentService();
        await paymentService.saveTransaction(transactionData, productos, datosPersonales);

        // Eliminar registro temporal
        await compraTemporalService.deleteCompraTemporal(transactionData.external_reference);

      } catch (error) {
        console.error('Error obteniendo datos de pago:', error);
      }
    }

    res.status(200).send();
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;

    console.log('=== GET TRANSACTION DEBUG ===');
    console.log('Payment ID recibido:', paymentId);
    console.log('Timestamp:', new Date().toISOString());

    const paymentService = new PaymentService();
    let transaction = await paymentService.getTransactionByPaymentId(paymentId);

    if (transaction) {
      console.log('Compra encontrada en BD:', transaction);
      return res.status(200).json(transaction);
    }

    console.log('No encontrado en BD, consultando MercadoPago...');
    const payment = await mercadoPagoClient.payment.findById(paymentId);

    if (payment) {
      console.log('Pago encontrado en MercadoPago:', payment);

      const formattedTransaction = {
        payment_id: payment.id,
        external_reference: payment.external_reference,
        amount: payment.transaction_amount,
        status: payment.status,
        payment_type: payment.payment_type_id,
        merchant_order_id: payment.order?.id || payment.merchant_order_id,
        created_at: payment.date_created,
        collection_status: payment.collection_status,
        processing_mode: payment.processing_mode,
        site_id: payment.site_id
      };

      console.log('Respuesta formateada:', formattedTransaction);
      return res.status(200).json(formattedTransaction);
    }

    console.log('No se encontró el pago en MercadoPago');
    return res.status(404).json({
      error: 'Compra no encontrada',
      payment_id: paymentId
    });

  } catch (error) {
    console.error('Error al obtener compra:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
      payment_id: req.params.paymentId
    });
  }
};