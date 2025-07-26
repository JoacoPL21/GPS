import { Router } from 'express';
import authRoutes from "./auth.routes.js";
import userRoutes, { userRouter } from "./user.routes.js";
import productosRoutes from "./productos.routes.js";
import valoracionesRoutes from "./valoraciones.routes.js";
import enviosRoutes from "./envios.routes.js";

const router = Router();

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Backend conectado correctamente!', timestamp: new Date() });
});

router
    .use('/auth', authRoutes)
    .use('/user', userRouter)  // Rutas de usuario autenticado
    .use('/users', userRoutes) // Rutas de admin (adminRouter)
    .use('/productos', productosRoutes)
    .use('/valoraciones', valoracionesRoutes)
    .use('/envios', enviosRoutes)

export default router;
