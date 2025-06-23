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
        success: "https://a223-190-211-41-93.ngrok-free.app/success",
        failure: "https://a223-190-211-41-93.ngrok-free.app/failure",
        pending: "https://a223-190-211-41-93.ngrok-free.app/pending"
      },
    };

    const response = await preference.create({ body });
    res.status(200).json({ id: response.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: error.message });
  }
};