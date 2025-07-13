import { Router } from "express";
import { getProductosController ,getProductosDisponiblesController,getProductoByIdController, createProductoController, updateProductoController, deleteProductoController, getProductosDestacadosController, toggleDestacadoController, getConteoDestacadosController,updateProductoStockController} from "../controller/productos.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
const router = Router();

router
  .get("/", getProductosDisponiblesController)
  .get("/all", getProductosController)
  .get("/destacados", getProductosDestacadosController)
  .get("/destacados/conteo", getConteoDestacadosController)
  .get("/:id_producto", getProductoByIdController)
  .put('/:id_producto/destacado', toggleDestacadoController)
  .delete('/:id_producto', deleteProductoController)
  .patch("/:id_producto/stock", updateProductoStockController)
  // Rutas para crear y actualizar productos solo admin (ORDEN CORREGIDO)
  .post("/crear", authenticateJwt, isAdmin, createProductoController)
  .put('/:id_producto', authenticateJwt, isAdmin, updateProductoController);
export default router;