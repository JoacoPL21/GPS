import { Preference } from 'mercadopago';
import mercadoPagoClient from '../config/mercadoPago.js';

const preference = new Preference(mercadoPagoClient);

export const createPreference = async (req, res) => {
  try {
    const { items, external_reference } = req.body;

    const body = {
      items,
      external_reference,
      auto_return: "approved",
      back_urls: {
        success: "https://fa2a-181-162-85-50.ngrok-free.app/success",
        failure: "https://yourdomain.com/failure",
        pending: "https://yourdomain.com/pending"
      },
    };

    const response = await preference.create({ body });
    res.status(200).json({ id: response.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: error.message });
  }
};