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
import { createProductos,createUser } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import path from "path";


async function setupServer() {
  try {
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

    const uploadPath = path.resolve("src/public/uploads");

    // Servir archivos estáticos desde el directorio 'uploads'
    app.use("/uploads", express.static(uploadPath));

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
    await createUser(); // Creación de usuarios iniciales
    await createProductos(); // Creación de horarios iniciales
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error),
  );