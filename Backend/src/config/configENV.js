"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const envFilePath = path.resolve(_dirname, ".env");

dotenv.config({ path: envFilePath });

export const DB_PORT = process.env.DB_PORT;
export const DB_HOST = process.env.DB_HOST;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE;

export const WEB_PORT = process.env.PORT || 10000;  
export const WEB_HOST = process.env.HOST || '0.0.0.0';  

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const cookieKey = process.env.CookieKey; 

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const FRONTEND_URL = NODE_ENV === 'production'
  ? 'https://eccomerce-7vv67gc79-tyrf1ngs-projects.vercel.app'
  : 'http://localhost:5173';

export const MP_WEBHOOK_URL = NODE_ENV === 'production'
  ? 'https://gps-u04n.onrender.com/api/payments/webhook'
  : 'https://535b-190-5-38-87.ngrok-free.app/api/payments/webhook';

export const getBackendUrl = () =>
  NODE_ENV === 'production'
    ? 'https://gps-u04n.onrender.com'
    : 'http://localhost:10000'; 