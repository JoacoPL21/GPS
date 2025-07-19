import { Router } from "express"
import {
  getCategoriasController,
  getCategoriaByIdController,
  createCategoriaController,
  updateCategoriaController,
  deleteCategoriaController,
} from "../controller/categorias.controller.js"
import { authenticateJwt } from "../middlewares/authentication.middleware.js"
import { isAdmin } from "../middlewares/authorization.middleware.js"

const router = Router()

// Rutas para categorías
router.get("/", getCategoriasController)
router.get("/:id", getCategoriaByIdController)
router.post("/crear", authenticateJwt, isAdmin, createCategoriaController)
router.put("/:id", authenticateJwt, isAdmin, updateCategoriaController)
router.delete("/:id", authenticateJwt, isAdmin, deleteCategoriaController)

export default router
