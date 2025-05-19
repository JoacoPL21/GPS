import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFilePath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envFilePath });

const PORT = process.env.DB_PORT;
const HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_DATABASE;
export {
  PORT,
  HOST,
  DB_USER,
  PASSWORD,
  DATABASE,
};