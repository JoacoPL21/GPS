"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/routes.js";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import { cookieKey, HOST, PORT } from "./config/configENV.js";
import { connectDB } from "./config/configDB.js";
import { createProductos, createUser, createCategoria, createCompras, createCompra_Producto, createEnvios, createValoraciones, createDireccion } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import path from "path";
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes.js';
import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import valoracionesRoutes from './routes/valoraciones.routes.js';
import { minioClient } from './config/configMinio.js';

async function setupServer() {
  try {
    dotenv.config();
    const app = express();

    // Deshabilita el encabezado "x-powered-by" por seguridad
    app.disable("x-powered-by");

    // Configuración de CORS
    app.use(
      cors({
        credentials: true,
        origin: true, // Permitir todos los orígenes (puedes especificar uno específico aquí)
      }),
    );


    // Middlewares globales para procesar JSON y URL-encoded
    app.use(
      urlencoded({
        extended: true,
        limit: "1mb",
      }),
    );

    app.use(
      json({
        limit: "1mb",
      }),
    );

    app.use(cookieParser());
    app.use(morgan("dev"));

    // Configuración de la sesión
    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        },
      }),
    );

    // Configuración de Passport para autenticación
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup();

    // Otras rutas generales
    app.use("/api", indexRoutes);
    app.use(express.json());
    app.use('/api/payments', paymentRoutes);
    app.use("/api/productos", productosRoutes);
    app.use("/api/categorias", categoriasRoutes);
    app.use("/api/valoraciones", valoracionesRoutes);

    // Ruta de prueba para verificar la conexión a MinIO
    app.get('/api/minio/test', (req, res) => {
      minioClient.listBuckets((err, buckets) => {
        if (err) {
          return res.status(500).json({ message: 'No se pudo conectar a MinIO', error: err.message });
          }
      return res.status(200).json({ message: 'Conexión exitosa a MinIO', buckets });
      });
    });

    const uploadPath = path.resolve("src/uploads");

    // Servir archivos estáticos desde el directorio 'uploads'
    app.use("/api/uploads", express.static(uploadPath));

    // Servidor escuchando en el puerto configurado

    app.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer(), el error es: ", error);
  }
}

async function setupAPI() {
  try {
    await connectDB(); // Conexión a la base de datos
    await setupServer(); // Configuración del servidor
    await createDireccion();
    await createUser();
    await createCategoria(); // Creación de usuarios iniciales
    await createProductos();
    await createCompras();
    await createCompra_Producto();
    await createEnvios();
    await createValoraciones();
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error),
  );