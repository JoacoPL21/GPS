import { Router } from 'express';
import {
    createPreference,
    handleWebhook,
    getTransaction
} from '../controller/payment.controller.js';

const router = Router();

router.post('/create_preference', createPreference);
router.post('/webhook', handleWebhook); // Eliminar middleware duplicado
router.get('/transaction/:paymentId', getTransaction);

export default router;