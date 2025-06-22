import crypto from 'crypto';

const secret = process.env.MP_WEBHOOK_SECRET;

// Usa JSON.stringify para replicar el comportamiento de Express
const body = {
  id: "987654320",
  type: "payment",
  data: {
    id: "987654320"
  }
};

const rawBody = JSON.stringify(body); // Sin espacios ni saltos

const hmac = crypto
  .createHmac('sha256', secret)
  .update(rawBody)
  .digest('hex');

console.log("Cuerpo usado:", rawBody);
console.log("Firma HMAC: sha256=" + hmac);