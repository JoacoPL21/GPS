import { Router } from "express";
import { getProductosDisponiblesController } from "../controller/productos.controller.js";

const router = Router();
router
  .get("/", getProductosDisponiblesController);

export default router;