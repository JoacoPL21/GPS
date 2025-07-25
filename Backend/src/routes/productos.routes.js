import { Router } from "express";
import { getProductosController ,getProductosDisponiblesController,getProductoByIdController, createProductoController, updateProductoController, deleteProductoController, restoreProductoController, getProductosEliminadosController, getProductosDestacadosController, toggleDestacadoController, getConteoDestacadosController,updateProductoStockController} from "../controller/productos.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import multer from 'multer';

const router = Router();

// Configuración de multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    console.log("🔍 Multer fileFilter - archivo recibido:", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.log("❌ Tipo de archivo no permitido:", file.mimetype);
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

router
  .get("/", getProductosDisponiblesController)
  .get("/all", getProductosController)
  .get("/destacados", getProductosDestacadosController)
  .get("/destacados/conteo", getConteoDestacadosController)
  .get("/:id_producto", getProductoByIdController)
  .put('/:id_producto/destacado', toggleDestacadoController)
  .delete('/:id_producto', deleteProductoController)
  .patch("/:id_producto/stock", updateProductoStockController)
  // Nuevas rutas para eliminación lógica
  .put('/:id_producto/restore', authenticateJwt, isAdmin, restoreProductoController)
  .get('/eliminados/all', authenticateJwt, isAdmin, getProductosEliminadosController)
  // Rutas para crear y actualizar productos solo admin (ORDEN CORREGIDO)
  .post("/crear", upload.single('imagen'), authenticateJwt, isAdmin, createProductoController)
  .put('/:id_producto', upload.single('imagen'), authenticateJwt, isAdmin, updateProductoController)
  // Ruta de debug para probar multer
  .post("/debug-upload", (req, res) => {
    console.log("🔧 === DEBUG UPLOAD ROUTE ===");
    console.log("📥 Body:", req.body);
    console.log("📁 File:", req.file);
    console.log("📋 Headers:", req.headers);
    res.json({
      message: "Debug upload",
      body: req.body,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        hasBuffer: !!req.file.buffer
      } : null,
      headers: req.headers
    });
  }, upload.single('imagen'));
export default router;