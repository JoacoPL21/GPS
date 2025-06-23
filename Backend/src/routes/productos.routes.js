import { Router } from "express";
import { getProductosDisponiblesController,getProductoByIdController, createProductoController,updateProductoStockController, } from "../controller/productos.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
const router = Router();

router
  .get("/", getProductosDisponiblesController)
  .get("/:id_producto", getProductoByIdController)
  .patch("/:id_producto/stock", updateProductoStockController)
//SOLO ADMIN
router
 // .patch("/actualizar/:id_producto", updateProductoController)
  .post("/crear",authenticateJwt,isAdmin, createProductoController);
export default router;