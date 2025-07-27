"use strict";
import { Router } from "express";
import { authenticateToken } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { 
    procesarEnvioController, 
    getTrackingController, 
    getAllEnviosController,
    reimprimirEtiquetaController,
    getEnvioPorCompraController
} from "../controller/envios.controller.js";
import { updateEstadoEnvioCompra } from "../controller/compras.controller.js";

const router = Router();

router.use(authenticateToken);

router.post("/procesar", isAdmin, procesarEnvioController);
router.get("/admin/all", isAdmin, getAllEnviosController);
router.post("/reimprimir-etiqueta", isAdmin, reimprimirEtiquetaController);
router.patch('/compras/:id_compra/estado-envio', isAdmin, updateEstadoEnvioCompra);

router.get("/tracking/:id_compra", getTrackingController);
router.get("/compra/:id_compra", getEnvioPorCompraController);

export default router; 