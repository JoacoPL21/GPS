import { Router } from "express";
import { getProductosDisponiblesController,getProductoByIdController, createProductoController, updateProductoController, deleteProductoController } from "../controller/productos.controller.js";

const router = Router();

router
  .get("/", getProductosDisponiblesController)
  .get("/:id_producto", getProductoByIdController)
  .post("/crear", createProductoController)
  .put('/:id_producto', updateProductoController)
  .delete('/:id_producto', deleteProductoController);
export default router;