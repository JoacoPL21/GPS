import { Router } from "express";
import { getProductosController,getProductosDisponiblesController,getProductoByIdController, createProductoController, updateProductoController, deleteProductoController, getProductosDestacadosController, toggleDestacadoController, getConteoDestacadosController } from "../controller/productos.controller.js";

const router = Router();

router
  .get("/", getProductosDisponiblesController)
  .get("/all", getProductosController) 
  .get("/destacados", getProductosDestacadosController)
  .get("/destacados/conteo", getConteoDestacadosController)
  .get("/:id_producto", getProductoByIdController)
  .post("/crear", createProductoController)
  .put('/:id_producto', updateProductoController)
  .put('/:id_producto/destacado', toggleDestacadoController)
  .delete('/:id_producto', deleteProductoController);
export default router;