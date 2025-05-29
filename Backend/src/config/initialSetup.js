'use strict';
import chalk from 'chalk';
import { AppDataSource } from './configDB.js';
import Productos from '../entity/Productos.js';
import Usuarios from '../entity/usuario.entity.js';
import Categoria from '../entity/Categoria.js';
import { encryptPassword } from '../helpers/bcrypt.helper.js';

async function createUser() {
  try {
    const UserRepository = AppDataSource.getRepository(Usuarios);

    const count = await UserRepository.count();
    if (count > 0) {
      console.log(chalk.yellow("ℹ️  Usuarios ya existen. Se omite creación."));
      return;
    }

    await Promise.all([
      UserRepository.save(UserRepository.create({
        nombreCompleto: "Admin",
        email: "admin2025@gmail.com",
        telefono: "966433091",
        password: await encryptPassword("admin123"),
        rol: "admin",
      })),
      UserRepository.save(UserRepository.create({
        nombreCompleto: "Cliente",
        email: "cliente2025@gmail.com",
        telefono: "984764839",
        password: await encryptPassword("cliente123"),
        rol: "cliente",
      }))
    ]);

    console.log(chalk.green("✅ Usuarios creados exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear usuarios:", error));
  }
}
async function createCategoria() {
  try {
    const CategoriaRepository = AppDataSource.getRepository(Categoria);

    const count = await CategoriaRepository.count();
    if (count > 0) {
      console.log(chalk.yellow("ℹ️  Categorías ya existen. Se omite creación."));
      return;
    }

    await Promise.all([
      CategoriaRepository.save(CategoriaRepository.create({
        nombre: "Juguetes",
        descripcion: "Juguetes de madera para niños"
      })),
      CategoriaRepository.save(CategoriaRepository.create({
        nombre: "Decoración",
        descripcion: "Artículos decorativos de madera"
      })),
      CategoriaRepository.save(CategoriaRepository.create({
        nombre: "Artesanía",
        descripcion: "Piezas artesanales únicas"
      })),
    ]);

    console.log(chalk.green("✅ Categorías creadas exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear categorías:", error));
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
        estado: "disponible",
        id_categoria:1
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Tung",
        precio: 8500,
        stock: 20,
        descripcion: "Juguete de Madera",
        estado: "disponible",
        id_categoria:2
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Tralalero",
        precio: 18000,
        stock: 5,
        descripcion: "Tralalero Decorativo",
        estado: "disponible",
        id_categoria:3
      })),
    ]);

    console.log(chalk.green("✅ Productos creados exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear productos:", error));
  }
}

export { createUser,  createCategoria, createProductos, };