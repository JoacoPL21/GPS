"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/routes.js";
import session from "express-session";
import pgSession from "connect-pg-simple"; // Nuevo: almacén de sesiones para PostgreSQL
import passport from "passport";
import express, { json, urlencoded } from "express";
import { cookieKey, HOST, PORT } from "./config/configENV.js";
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
    
    // 1. Nuevo: Configura el almacén de sesiones para PostgreSQL
    const PgStore = pgSession(session);
    const sessionStore = new PgStore({
      conObject: {
        connectionString: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
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
        req.rawBody = req.body.toString('utf8');

        try {
          req.webhookBody = JSON.parse(req.rawBody);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          console.error('Raw body:', req.rawBody);
          req.webhookBody = {};
        }

        // Agregar log de los headers necesarios
        console.log('-------------------------------------');
        console.log(`[Webhook] ${new Date().toISOString()}`);
        console.log('Método:', req.method);
        console.log('URL:', req.originalUrl);
        console.log('Headers:', req.headers);
        console.log('X-Timestamp:', req.headers['x-timestamp']); // Nuevo log
        console.log('Body:', req.webhookBody);
        console.log('Raw Body:', req.rawBody);
        console.log('-------------------------------------');
        next();
      }
    );

    // Deshabilita el encabezado "x-powered-by" por seguridad
    app.disable("x-powered-by");

    // Configuración de CORS
    // Configuración de CORS mejorada
    app.use(
      cors({
        credentials: true,
        origin: [
          'http://localhost:5173',
          'https://eccomerce-80159rg7k-tyrf1ngs-projects.vercel.app',
          'https://*.vercel.app' // Permite todos los subdominios de Vercel
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
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

    // 3. Configuración CORREGIDA de la sesión
    app.use(
      session({
        secret: process.env.SESSION_SECRET || cookieKey, // Usa SESSION_SECRET si está definido
        store: sessionStore, // Usa el almacén PostgreSQL
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === 'production', // Debe ser true en producción
          httpOnly: true,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // none para CORS en producción
          maxAge: 24 * 60 * 60 * 1000 // 1 día
        },
      }),
    );

    // Configuración de Passport para autenticación
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup();

    // Otras rutas generales
    app.use("/api", indexRoutes);
    app.use('/api/payments', paymentRoutes);

    const uploadPath = path.resolve("src/uploads");

    // Servir archivos estáticos desde el directorio 'uploads'
    app.use("/uploads", express.static(uploadPath));

    // 4. Nuevo: Manejo de errores global
    app.use((err, req, res, next) => {
      console.error('Error global:', err.stack);
      res.status(500).json({ error: 'Algo salió mal' });
    });

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
    await createUser();
    await createCategoria(); // Creación de usuarios iniciales
    await createProductos();
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error),
  );