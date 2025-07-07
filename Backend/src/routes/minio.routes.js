import { Router } from "express";
import { generarUrl, generarPreFirmaUrl } from "../controller/minio.controller.js";

const router = Router();
router.post("/generar-url", generarUrl);
router.get("/generar-pre-firma-url/:image_url", generarPreFirmaUrl);

export default router;