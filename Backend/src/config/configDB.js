"use strict";
import { DataSource } from "typeorm";
import { 
  DB_DATABASE, 
  DB_USERNAME, 
  DB_HOST, 
  DB_PASSWORD 
} from "./configENV.js"; // Importa las variables con prefijo DB_

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST, // Usa DB_HOST directamente
  port: 5432,
  username: DB_USERNAME, // Usa DB_USERNAME
  password: DB_PASSWORD, // Usa DB_PASSWORD
  database: DB_DATABASE, // Usa DB_DATABASE
  entities: ["src/entity/**/*.js"],
  synchronize: true,
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos!");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}