"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { getAllUsers } from "../controller/user.controller.js";

const router = Router();

// Middlewares aplicados a TODAS las rutas de este router
router.use(authenticateJwt);  // ✅ Middleware de autenticación
router.use(isAdmin);          // ✅ Middleware de autorización (admin)

// Rutas específicas
router.get("/", getAllUsers);

export default router;