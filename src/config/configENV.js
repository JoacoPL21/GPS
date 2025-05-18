import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFilePath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envFilePath });

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const DB_USER = process.env.DB_USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

export {
  PORT,
  HOST,
  DB_USER,
  PASSWORD,
  DATABASE,
};