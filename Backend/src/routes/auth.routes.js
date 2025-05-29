"use strict";
import { Router } from "express";
import { login, logout, register } from "../controller/auth.controller.js"
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .post("/login", login)
  .post("/register", authenticateJwt, isAdmin, register)
  .post("/logout", logout);

export default router;