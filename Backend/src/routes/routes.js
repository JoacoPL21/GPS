import { Router } from 'express';
import authRoutes from "./auth.routes.js";
import productosRoutes from "./productos.routes.js";


const router = Router();

router
    .use('/auth', authRoutes)
    .use('/productos', productosRoutes);

export default router;
