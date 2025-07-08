import { Router } from 'express';
import authRoutes from "./auth.routes.js";
import userRoutes, { userRouter } from "./user.routes.js";
import productosRoutes from "./productos.routes.js";

const router = Router();

router
    .use('/auth', authRoutes)
    .use('/user', userRouter)  // Rutas de usuario autenticado
    .use('/users', userRoutes) // Rutas de admin (adminRouter)
    .use('/productos', productosRoutes)

export default router;
