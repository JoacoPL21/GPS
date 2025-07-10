"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { getAllUsers, getUserProfile, registerDireccion, getDireccionByUserId, deleteDireccionByUserId } from "../controller/user.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

// Router para rutas de usuario autenticado (no requiere permisos de admin)
const userRouter = Router();
userRouter.use(authenticateJwt); // Middleware de autenticación

userRouter
    .get("/profile", getUserProfile)
    .post("/direccion", registerDireccion)
    .get("/direcciones", getDireccionByUserId)
    .delete("/direccion/:id", deleteDireccionByUserId);

// Router para rutas de administración (requiere permisos de admin)
const adminRouter = Router();
adminRouter.use(authenticateJwt); // Middleware de autenticación
adminRouter.use(isAdmin); // Middleware de autorización

adminRouter
    .get("/", getAllUsers);

// Exportar ambos routers
export { userRouter };
export default adminRouter;