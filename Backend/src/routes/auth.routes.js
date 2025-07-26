"use strict";
import { Router } from "express";
import { login, logout, register } from "../controller/auth.controller.js"
import { forgotPasswordController, resetPasswordController } from "../controller/passwordReset.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .post("/login", login)
  .post("/register", register)
  .post("/logout", logout)
  .post("/forgot-password", forgotPasswordController)
  .post("/reset-password", resetPasswordController);

export default router;