import { Preference } from 'mercadopago';
import mercadoPagoClient from '../config/mercadoPago.js';
import { PaymentService } from '../services/payment.service.js';

const preference = new Preference(mercadoPagoClient);

export const createPreference = async (req, res) => {
  try {
    const { items, external_reference } = req.body;

    const body = {
      items,
      external_reference,
      auto_return: "approved",
      back_urls: {
        success: "https://0629-190-5-38-87.ngrok-free.app/success",
        failure: "https://0629-190-5-38-87.ngrok-free.app/failure",
        pending: "https://0629-190-5-38-87.ngrok-free.app/pending"
      },
    };

    const response = await preference.create({ body });
    res.status(200).json({ id: response.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: error.message });
  }
};

// Nuevo controlador para webhook
export const handleWebhook = async (req, res) => {
  try {
    const { id, type } = req.body;
    
    if (type === 'payment') {
      const payment = new Payment(mercadoPagoClient);
      const paymentData = await payment.get({ id });
      
      const transactionData = {
        payment_id: paymentData.id,
        status: paymentData.status,
        external_reference: paymentData.external_reference,
        amount: paymentData.transaction_amount,
        payment_type: paymentData.payment_type_id,
        merchant_order_id: paymentData.order.id,
        preference_id: paymentData.preference_id
      };

      const paymentService = new PaymentService();
      await paymentService.saveTransaction(transactionData);
    }

    res.status(200).send();
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ error: error.message });
  }
};

// Nuevo controlador para obtener transacción por ID
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