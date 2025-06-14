import { MercadoPagoConfig } from 'mercadopago';

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 } // opcional
});

export default mercadoPagoClient;