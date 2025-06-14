import { Router } from "express";
import { getProductosDisponiblesController,getProductoByIdController, createProductoController } from "../controller/productos.controller.js";

const router = Router();
router
  .get("/", getProductosDisponiblesController)
  .get("/:id_producto", getProductoByIdController)
  .post("/crear", createProductoController);
export default router;