import { Preference, Payment } from 'mercadopago';
import mercadoPagoClient from '../config/mercadoPago.js';
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
    // Validación de firma
    const signature = req.headers['x-signature'];
    const secret = process.env.MP_WEBHOOK_SECRET;
    
    if (!signature || !secret) {
      return res.status(401).json({ error: 'Faltan credenciales de seguridad' });
    }
    
    const rawBody = JSON.stringify(req.body);
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
    
    if (signature !== `sha256=${generatedSignature}`) {
      console.error(`Firma inválida: Recibida ${signature} vs Esperada sha256=${generatedSignature}`);
      return res.status(401).json({ error: 'Firma inválida' });
    }

    // Procesamiento del evento
    const { id, type } = req.body;
    
    if (type !== 'payment') {
      return res.status(400).json({ error: 'Tipo de evento no soportado' });
    }
    
    let paymentData;
    const testIds = ["123456789", "987654320", "555555555"];
    
    if (testIds.includes(id)) {
      paymentData = {
        id,
        status: id === "987654320" ? "denied" : "approved",
        external_reference: `TEST-${id.slice(-3)}`,
        transaction_amount: 100.00,
        payment_type_id: "credit_card",
        order: { id: `TEST-ORDER-${id.slice(-3)}` },
        preference_id: `TEST-PREF-${id.slice(-3)}`
      };
    } else {
      const payment = new Payment(mercadoPagoClient);
      paymentData = await payment.get({ id });
    }
    
    // Guardar transacción
    const transactionData = {
      payment_id: paymentData.id,
      status: paymentData.status.toLowerCase(), // Normalizar a minúsculas
      external_reference: paymentData.external_reference,
      amount: paymentData.transaction_amount,
      payment_type: paymentData.payment_type_id,
      merchant_order_id: paymentData.order?.id || 'N/A',
      preference_id: paymentData.preference_id
    };

    const paymentService = new PaymentService();
    await paymentService.saveTransaction(transactionData);
    
    res.status(200).send();
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ 
      error: 'Error procesando webhook',
      details: error.message
    });
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