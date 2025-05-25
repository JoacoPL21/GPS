'use strict';
import chalk from 'chalk';
import { AppDataSource } from './configDB.js';
import User from '../entity/User.js';
import Productos from '../entity/Productos.js';

async function createUser() {
  try {
    const UserRepository = AppDataSource.getRepository(User);

    const count = await UserRepository.count();
    if (count > 0) {
      console.log(chalk.yellow("ℹ️  Cursos ya existen. Se omite creación."));
      return;
    }

    await Promise.all([
      UserRepository.save(UserRepository.create({
        name: "SkibidiDop",
        email: "skibidi@gmail.com"
      })),
      UserRepository.save(UserRepository.create({
        name: "Toilete",
        email: "toilete@gmail.com"
      })),
      UserRepository.save(UserRepository.create({
        name: "SigmaBoy",
        email: "sigmaboy@gmail.com"
      })),
    ]);

    console.log(chalk.green("✅ Usuarios creados exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear usuarios:", error));
  }
}

async function createProductos() {
  try {
    const ProductosRepository = AppDataSource.getRepository(Productos);

    const count = await ProductosRepository.count();
    if (count > 0) {
      console.log(chalk.yellow("ℹ️  Productos ya existen. Se omite creación."));
      return;
    }

    await Promise.all([
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Picaro",
        precio: 12000,
        stock: 10,
        descripcion: "Artesania Tipica",
        estado: "disponible"
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Tung",
        precio: 8500,
        stock: 20,
        descripcion: "Juguete de Madera",
        estado: "disponible"
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Tralalero",
        precio: 18000,
        stock: 5,
        descripcion: "Tralalero Decorativo",
        estado: "disponible"
      })),
    ]);

    console.log(chalk.green("✅ Productos creados exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear productos:", error));
  }
}
export { createUser, createProductos };