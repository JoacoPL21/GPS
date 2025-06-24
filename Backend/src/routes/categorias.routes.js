import { Router } from "express"
import {
  getCategoriasController,
  getCategoriaByIdController,
  createCategoriaController,
  updateCategoriaController,
  deleteCategoriaController,
} from "../controller/categorias.controller.js"

const router = Router()

// Rutas para categorías
router.get("/", getCategoriasController)
router.get("/:id", getCategoriaByIdController)
router.post("/crear", createCategoriaController)
router.put("/:id", updateCategoriaController)
router.delete("/:id", deleteCategoriaController)

export default router
