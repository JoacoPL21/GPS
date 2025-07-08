import { Router } from "express";
import { generarUrl,obtenerUrlImagen } from "../controller/minio.controller.js";

const router = Router();
router.post("/generar-url", generarUrl);
router.get("/obtener-url-imagen", obtenerUrlImagen); 
export default router;