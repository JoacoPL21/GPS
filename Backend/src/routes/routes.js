import { Router } from 'express';
import authRoutes from "./auth.routes.js";
import userRoutes, { userRouter } from "./user.routes.js";
import productosRoutes from "./productos.routes.js";
import chilexpressRoutes from "./chilexpress.js"; // AGREGAR ESTA LÍNEA

const router = Router();

router
    .use('/auth', authRoutes)
    .use('/user', userRouter)  // Rutas de usuario autenticado
    .use('/users', userRoutes) // Rutas de admin (adminRouter)
    .use('/productos', productosRoutes)
    .use('/chilexpress', chilexpressRoutes) // AGREGAR ESTA LÍNEA

export default router;
