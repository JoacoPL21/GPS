import { Router } from "express";
import { getProductosDisponiblesController, createProductoController } from "../controller/productos.controller.js";

const router = Router();
router
  .get("/", getProductosDisponiblesController)
  .post("/crear", createProductoController);
export default router;