"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const _filename = fileURLToPath(import.meta.url);

const _dirname = path.dirname(_filename);

const envFilePath = path.resolve(_dirname, ".env");

dotenv.config({ path: envFilePath });




export const PORT = process.env.DB_PORT;
export const HOST = process.env.DB_HOST;
export const USERNAME = process.env.DB_USERNAME;
export const PASSWORD = process.env.DB_PASSWORD;
export const DATABASE = process.env.DB_DATABASE;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const cookieKey = process.env.cookieKey;

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const FRONTEND_URL = NODE_ENV === 'production'
  ? 'https://tu-frontend-real.com'
  : 'http://localhost:5173';

export const MP_WEBHOOK_URL = NODE_ENV === 'production'
  ? 'https://tu-dominio-real.com/api/payments/webhook'
  : 'https://535b-190-5-38-87.ngrok-free.app/api/payments/webhook';

export const getBackendUrl = () => 
  NODE_ENV === 'production' 
    ? 'https://tu-backend-real.com' 
    : 'http://localhost:3000';