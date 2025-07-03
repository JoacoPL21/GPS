"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  getAllUsers,
  registerDireccion,
  getDireccionByUserId,
  deleteDireccionByUserId
} from "../controller/user.controller.js";

const router = Router();

// Middleware aplicado a TODAS las rutas (solo autenticación)
router.use(authenticateJwt);

// Ruta específica que requiere admin (obtener todos los usuarios)
router.get("/", isAdmin, getAllUsers);

// Rutas de direcciones (accesibles para usuarios normales)
router
  .post("/direccion", registerDireccion)
  .get("/direccion/:id", getDireccionByUserId)
  .delete("/direccion/:id", deleteDireccionByUserId);

export default router;