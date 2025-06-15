// src/routes/webhook.routes.js
import { Router } from 'express';
import { handleWebhook, getTransactionStatus } from '../controller/webhook.controller.js';

const router = Router();

// 📨 Endpoint para recibir notificaciones de MercadoPago
router.post('/', handleWebhook);

// 📋 Endpoint para consultar estado de una transacción
router.get('/transaction/:id', getTransactionStatus);

// 🧪 Endpoint de prueba para verificar que el webhook funciona
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Webhook endpoint funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

export default router;