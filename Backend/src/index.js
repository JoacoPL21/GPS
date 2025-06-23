"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/routes.js";
import session from "express-session";
import pgSession from "connect-pg-simple";
import passport from "passport";
import express, { json, urlencoded } from "express";
import { 
  cookieKey, 
  WEB_HOST, 
  WEB_PORT,  // Cambiado a WEB_PORT
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE
} from "./config/configENV.js";
import { connectDB } from "./config/configDB.js";
import { createProductos, createUser, createCategoria } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import path from "path";
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes.js';
import bodyParser from 'body-parser';

async function setupServer() {
  try {
    dotenv.config();
    const app = express();
    
    // 1. Configura el almacén de sesiones para PostgreSQL
    const PgStore = pgSession(session);
    const sessionStore = new PgStore({
      conObject: {
        connectionString: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      },
      createTableIfMissing: true,
      tableName: 'session',
    });

    // 2. Middleware para webhooks DEBE SER EL PRIMERO
    app.use(
      '/api/payments/webhook',
      bodyParser.raw({ type: 'application/json' }),
      (req, res, next) => {
        // ... (código existente)
      }
    );

    // Deshabilita el encabezado "x-powered-by" por seguridad
    app.disable("x-powered-by");

    // Configuración de CORS
    app.use(
      cors({
        credentials: true,
        origin: [
          'http://localhost:5173',
          'https://eccomerce-80159rg7k-tyrf1ngs-projects.vercel.app',
          'https://*.vercel.app'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
      })
    );

    // Middlewares globales para procesar JSON y URL-encoded
    app.use(urlencoded({ extended: true, limit: "1mb" }));
    app.use(json({ limit: "1mb" }));

    app.use(cookieParser());
    app.use(morgan("dev"));

    // 3. Configuración de la sesión
    app.use(
      session({
        secret: process.env.SESSION_SECRET || cookieKey,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 24 * 60 * 60 * 1000
        },
      })
    );

    // Configuración de Passport para autenticación
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup();

    // Otras rutas generales
    app.use("/api", indexRoutes);
    app.use('/api/payments', paymentRoutes);

    const uploadPath = path.resolve("src/uploads");
    app.use("/uploads", express.static(uploadPath));

    // 4. Ruta de prueba básica
    app.get("/", (req, res) => {
      res.send("Backend funcionando correctamente");
    });

    // 5. Manejo de errores global
    app.use((err, req, res, next) => {
      console.error('Error global:', err.stack);
      res.status(500).json({ error: 'Algo salió mal' });
    });

    // 6. Servidor escuchando en el puerto correcto para Render
    app.listen(WEB_PORT, WEB_HOST, () => {
      console.log(`=> Servidor corriendo en http://${WEB_HOST}:${WEB_PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer(), el error es: ", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();
    await setupServer();
    await createUser();
    await createCategoria();
    await createProductos();
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) => console.log("Error en index.js -> setupAPI(), el error es: ", error));