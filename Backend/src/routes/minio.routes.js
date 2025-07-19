import { Router } from "express";
import { getrUrlImagen,postImagen } from "../controller/minio.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import multer from 'multer';
const upload =multer();
const router = Router();

router.get("/imagen/:fileName", getrUrlImagen);
//solo admin
router.post("/imagen", upload.single('file'), postImagen);
export default router;