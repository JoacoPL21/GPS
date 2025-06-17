import crypto from 'crypto';

const secret = process.env.MP_WEBHOOK_SECRET;

const body = {
  "id": 987654321,
  "type": "payment",
  "data": {
    "id": "987654321"
  }
};

const hmac = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(body))
  .digest('hex');

console.log(`sha256=${hmac}`);