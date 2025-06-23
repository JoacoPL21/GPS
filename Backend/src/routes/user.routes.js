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

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/", getAllUsers)
  .post("/direccion", registerDireccion)
  .get("/direccion/:id", getDireccionByUserId)
  .delete("/direccion/:id",deleteDireccionByUserId);
export default router;