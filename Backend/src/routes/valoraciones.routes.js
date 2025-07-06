import { Router } from "express";
import { getValoracionesPorProductoController } from "../controller/valoraciones.controller.js";

const router = Router();

// GET /api/valoraciones/producto/:id_producto
router.get("/producto/:id_producto", getValoracionesPorProductoController);

export default router; 