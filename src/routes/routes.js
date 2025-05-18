import { Router } from 'express';
import { getAllUser } from '../controller/controller.js';

const router = Router();

router.get('/users', getAllUser);

export default router;
