import { Router } from "express";
import { generarUrl,getrUrlImagen } from "../controller/minio.controller.js";

const router = Router();
router.post("/generar-url", generarUrl);
router.get("/obtener-url-imagen", generarUrl); 
export default router;