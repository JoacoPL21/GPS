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
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE
} from "./config/configENV.js";
import { connectDB } from "./config/configDB.js";
// COMBINAR AMBAS IMPORTACIONES
import { createProductos, createUser, createCategoria, createValoraciones } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import path from "path";
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes.js';
// MANTENER TUS IMPORTACIONES (pagos y chilexpress)
import bodyParser from 'body-parser';
import { handleWebhook } from './controller/payment.controller.js'; 
import chilexpressRoutes from './routes/chilexpress.js'; 
// MANTENER IMPORTACIONES DE TUS COMPAÑEROS (productos, minIO, etc.)
import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import minioRutes from "./routes/minio.routes.js";
import valoracionesRoutes from './routes/valoraciones.routes.js';
import { minioClient } from './config/configMinio.js';

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

    // 2. Webhook de Mercado Pago: SOLO aquí aplica bodyParser.raw
    app.post(
      '/api/payments/webhook',
      bodyParser.raw({ type: 'application/json' }),
      (req, res, next) => {
        req.rawBody = req.body.toString('utf8');
        try {
          req.webhookBody = JSON.parse(req.rawBody);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          req.webhookBody = {};
        }
        console.log('-------------------------------------');
        console.log(`[Webhook] ${new Date().toISOString()}`);
        console.log('Método:', req.method);
        console.log('URL:', req.originalUrl);
        console.log('Headers:', req.headers);
        // HEXADECIMAL Y BYTES
        console.log('Raw Body (utf8):', req.rawBody);
        console.log('Raw Body (hex):', Buffer.from(req.rawBody).toString('hex'));
        console.log('Raw Body (bytes):', Buffer.from(req.rawBody));
        console.log('-------------------------------------');
        next();
      },
      handleWebhook
    );

    // Deshabilita el encabezado "x-powered-by" por seguridad
    app.disable("x-powered-by");

    // Configuración CORS igual que antes
    const allowedOrigins = [
      'http://localhost:5173',
      'https://eccomerce-tyrf1ngs-projects.vercel.app',
      'https://eccomerce-frontend.vercel.app',
      'https://eccomerce-cf7q5i33e-tyrf1ngs-projects.vercel.app'
    ];
    const vercelPreviewPattern = /^https:\/\/eccomerce-[a-z0-9]+-tyrf1ngs-projects\.vercel\.app$/;
    const corsMiddleware = cors({
      credentials: true,
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        if (vercelPreviewPattern.test(origin)) return callback(null, true);
        console.warn('Origen bloqueado por CORS:', origin);
        callback(null, false);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });
    app.use(corsMiddleware);
    app.options('*', corsMiddleware);
    app.use((req, res, next) => {
      if (req.method === 'OPTIONS') return next();
      next();
    });

    // Middlewares globales para procesar JSON y URL-encoded
    app.use(urlencoded({ extended: true, limit: "1mb" }));
    app.use(json({ limit: "1mb" }));

    app.use(cookieParser());
    app.use(morgan("dev"));

    // 3. Configuración de la sesión (solo para rutas no OPTIONS)
    const sessionMiddleware = session({
      secret: process.env.SESSION_SECRET || cookieKey,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
      }
    });
    app.use((req, res, next) => {
      if (req.method === 'OPTIONS') return next();
      sessionMiddleware(req, res, next);
    });

    // Passport
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup();

    // COMBINAR TODAS LAS RUTAS
    app.use("/api", indexRoutes);
    
    // TUS RUTAS (pagos y chilexpress)
    app.use('/api/payments', paymentRoutes);
    app.use('/api/chilexpress', chilexpressRoutes);
    
    // RUTAS DE TUS COMPAÑEROS (productos, categorías, etc.)
    app.use("/api/productos", productosRoutes);
    app.use("/api/categorias", categoriasRoutes);
    app.use("/api/valoraciones", valoracionesRoutes);
    app.use("/api/minio", minioRutes);

    // TU CONFIGURACIÓN DE UPLOADS
    const uploadPath = path.resolve("src/uploads");
    app.use("/api/uploads", express.static(uploadPath));

    // RUTA DE PRUEBA MINÍO DE TUS COMPAÑEROS
    app.get('/api/minio/test', (req, res) => {
      minioClient.listBuckets((err, buckets) => {
        if (err) {
          return res.status(500).json({ message: 'No se pudo conectar a MinIO', error: err.message });
        }
        return res.status(200).json({ message: 'Conexión exitosa a MinIO', buckets });
      });
    });

    // TU RUTA DE PRUEBA
    app.get("/", (req, res) => {
      res.send("Backend funcionando correctamente");
    });

    // TU MANEJO DE ERRORES
    app.use((err, req, res, next) => {
      console.error('Error global:', err.stack);
      res.status(500).json({ error: 'Algo salió mal' });
    });

    // USAR TUS VARIABLES DE CONFIGURACIÓN
    app.listen(DB_PORT, DB_HOST, () => {
      console.log(`=> Servidor corriendo en http://${DB_HOST}:${DB_PORT}/api`);
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
    await createValoraciones();
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) => console.log("Error en index.js -> setupAPI(), el error es: ", error));