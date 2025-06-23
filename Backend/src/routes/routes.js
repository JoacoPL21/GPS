import { Router } from 'express';
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import productosRoutes from "./productos.routes.js";


const router = Router();

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Backend conectado correctamente!', timestamp: new Date() });
});

router
    .use('/auth', authRoutes)
    .use('/users', userRoutes)
    .use('/productos', productosRoutes);


export default router;
