import { Router } from "express";
import { getValoracionesPorProductoController, createValoracionController, updateValoracionController, createOrUpdateValoracionController } from "../controller/valoraciones.controller.js";
import { authenticateToken } from "../middlewares/authentication.middleware.js";

const router = Router();

// GET /api/valoraciones/producto/:id_producto
router.get("/producto/:id_producto", getValoracionesPorProductoController);

// POST /api/valoraciones/crear
router.post("/crear", authenticateToken, createValoracionController);

// PUT /api/valoraciones/actualizar
router.put("/actualizar", authenticateToken, updateValoracionController);

// POST /api/valoraciones/crear-o-actualizar (función más eficiente)
router.post("/crear-o-actualizar", authenticateToken, createOrUpdateValoracionController);

export default router; 