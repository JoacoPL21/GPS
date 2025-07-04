import { Router } from 'express';
import {
    createPreference,
    getTransaction
} from '../controller/payment.controller.js';

const router = Router();

router.post('/create_preference', createPreference);
router.get('/transaction/:paymentId', getTransaction);

export default router;