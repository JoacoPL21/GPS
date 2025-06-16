import { Router } from 'express';
import { createPreference } from '../controller/payment.controller.js';

const router = Router();

router.post('/create_preference', createPreference);

export default router;