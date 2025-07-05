import { Router } from "express";
import { getProductosDisponiblesController,getProductoByIdController, createProductoController, updateProductoController, deleteProductoController } from "../controller/productos.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
const router = Router();

router
  .get("/", getProductosDisponiblesController)
  .get("/:id_producto", getProductoByIdController)
  .post("/crear",authenticateJwt,isAdmin, createProductoController)
  .put('/:id_producto', updateProductoController)
  .delete('/:id_producto', deleteProductoController);
export default router;