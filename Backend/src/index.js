"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/routes.js";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import {
  cookieKey, WEB_HOST, WEB_PORT
} from "./config/configENV.js";
import { connectDB } from "./config/configDB.js";
import { createProductos, createUser, createCategoria, createValoraciones, createCompra_Producto, createEnvios, createCompras} from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes.js';
import bodyParser from 'body-parser';
import { handleWebhook } from './controller/payment.controller.js'; 
import chilexpressRoutes from './routes/chilexpress.js'; 
import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import minioRutes from "./routes/minio.routes.js";
import valoracionesRoutes from './routes/valoraciones.routes.js';
import { minioClient } from './config/configMinio.js';

async function setupServer() {
  try {
    dotenv.config();
    const app = express();

    // 2. Webhook de Mercado Pago
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
    
    app.use(
      cors({
        origin: true,
        credentials: true,
      }),
    );

    // Middlewares globales para procesar JSON y URL-encoded
    app.use(urlencoded({ extended: true, limit: "1mb" }));
    app.use(json({ limit: "1mb" }));

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
    // Passport
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup();


    app.use("/api", indexRoutes);
    

    app.use('/api/payments', paymentRoutes);
    app.use('/api/chilexpress', chilexpressRoutes);
    
 
    app.use("/api/productos", productosRoutes);
    app.use("/api/categorias", categoriasRoutes);
    app.use("/api/valoraciones", valoracionesRoutes);
    app.use("/api/minio", minioRutes);


    app.get('/api/minio/test', (req, res) => {
      minioClient.listBuckets((err, buckets) => {
        if (err) {
          return res.status(500).json({ message: 'No se pudo conectar a MinIO', error: err.message });
        }
        return res.status(200).json({ message: 'Conexión exitosa a MinIO', buckets });
      });
    });

   
    app.get("/", (req, res) => {
      res.send("Backend funcionando correctamente");
    });

    app.use((err, req, res, next) => {
      console.error('Error global:', err.stack);
      res.status(500).json({ error: 'Algo salió mal' });
    });

    
  
    // Configuración del puerto y host
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
    await createValoraciones();
    await createCompras();
    await createCompra_Producto();
    await createEnvios();
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) => console.log("Error en index.js -> setupAPI(), el error es: ", error));