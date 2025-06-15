import { Router } from 'express';
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import productosRoutes from "./productos.routes.js";
import webhookRoutes from "./webhook.routes.js";

const router = Router();

router
    .use('/auth', authRoutes)
    .use('/users', userRoutes)
    .use('/productos', productosRoutes)
    .use('/webhooks', webhookRoutes);



export default router;
