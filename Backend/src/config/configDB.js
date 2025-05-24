// configDB.js
import { DataSource } from "typeorm";
import { DATABASE, DB_USER, HOST, PASSWORD, PORT } from "./configENV.js";
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AppDataSource = new DataSource({
    type: "postgres",
    host: HOST,
    port: PORT,
    username: DB_USER,
    password: PASSWORD,
    database: DATABASE,
    synchronize: true,
    logging: false,
    schema: "public",
    entities: [path.join(__dirname, '../entity/**/*.js')],
});

export async function connectDB() {
    try {
        await AppDataSource.initialize();
        console.log(chalk.green("🔗 Conectado a la base de datos"));
    } catch (error) {
        console.error(chalk.red("❌ Error al conectar a la base de datos", error));
    }
}

export { AppDataSource };