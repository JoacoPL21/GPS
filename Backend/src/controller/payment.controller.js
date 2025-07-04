import { Preference, Payment } from 'mercadopago';
import mercadoPagoClient from '../config/mercadopago.js';
import { PaymentService } from '../services/payment.service.js';
import { FRONTEND_URL } from '../config/configENV.js';
import crypto from 'crypto';

const preference = new Preference(mercadoPagoClient);

export const createPreference = async (req, res) => {
  try {
    const { items, external_reference } = req.body;

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
    const secret = process.env.MP_WEBHOOK_SECRET.trim();
    console.log('Webhook secret usado:', `"${secret}"`, secret.length);

    // 1. Extraer el evento del body
    const event = req.webhookBody;
    const isSandbox = event && event.live_mode === false;

    // Si es producción, validar la firma
    if (!isSandbox) {
      if (!signatureHeader || !secret) {
        console.error('Faltan cabeceras necesarias o secreto');
        return res.status(401).json({ error: 'Firma inválida' });
      }

      // Extraer ts (timestamp) y v1 (firma) del header
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

      // FIRMA CORREGIDA SEGÚN DOCUMENTACIÓN MP
      const signingData = `${payload}:${timestamp}`;
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(signingData)
        .digest('hex');

      // Debug
      console.log('Datos para firma:', signingData);
      console.log('Timestamp:', timestamp);
      console.log('Firma recibida:', signature);
      console.log('Firma generada:', generatedSignature);

      if (signature !== generatedSignature) {
        console.error('Firma inválida recibida:', signature, 'esperada:', generatedSignature);
        return res.status(401).json({ error: 'Firma inválida' });
      }
    } else {
      // Si es sandbox, solo loguea y continúa
      console.warn('[Sandbox] Ignorando validación de firma de webhook');
    }

    // 2. Procesar el evento
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
          preference_id: paymentData.preference_id || 'N/A' 
        };

        console.log('Guardando transacción:', transactionData);
        const paymentService = new PaymentService();
        await paymentService.saveTransaction(transactionData);

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
    const paymentService = new PaymentService();
    const transaction = await paymentService.getTransactionByPaymentId(paymentId);

    if (!transaction) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error al obtener transacción:', error);
    res.status(500).json({ error: error.message });
  }
};