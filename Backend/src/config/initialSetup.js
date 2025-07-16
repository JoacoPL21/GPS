'use strict';
import chalk from 'chalk';
import { AppDataSource } from './configDB.js';
import Productos from '../entity/productos.entity.js';
import Usuarios from '../entity/usuario.entity.js';
import Categoria from '../entity/categoria.entity.js';
import Valoraciones from '../entity/valoraciones.entity.js';
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
        nombre: "Jardinera",
        precio: 79990,
        prom_valoraciones: 3,
        stock: 10,
        descripcion: "Esta es una descripcion de prueba.",
        estado: "activo",
        image_url: "jardinera.jpg",
        id_categoria:3
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Macetero",
        precio: 9990,
        prom_valoraciones: 3,
        stock: 10,
        descripcion: "Esta es una descripcion de prueba.",
        estado: "activo",
        image_url: "macetero.webp",
        id_categoria:3
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Medallero",
        precio: 29990,
        prom_valoraciones: 3,
        stock: 10,
        descripcion: "Esta es una descripcion de prueba.",
        estado: "activo",
        image_url: "medallero.webp",
        id_categoria:2
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Escaño",
        precio: 119990,
        prom_valoraciones: 5,
        stock: 20,
        descripcion: "Esta es una descripcion de prueba.",
        estado: "activo",
        image_url:"escaño.webp",
        id_categoria:2
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Mesa de centro",
        precio: 69990,
        stock: 5,
        descripcion: "Esta es una descripcion de prueba.",
        estado: "activo",
        image_url:"mesacentro.webp",
        id_categoria:2
      })),
    ]);
    console.log(chalk.green("✅ Productos creados exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear productos:", error));
  }
}

async function createValoraciones() {
  try {
    const ValoracionesRepository = AppDataSource.getRepository(Valoraciones);
    const count = await ValoracionesRepository.count();
    if (count > 0) {
      console.log(chalk.yellow("ℹ️  Valoraciones ya existen. Se omite creación."));
      return;
    }
    await Promise.all([
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 1,
        id_producto: 1,
        puntuacion: 5,
        descripcion: "Excelente producto",
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 1,
        id_producto: 2,
        puntuacion: 4,
        descripcion: "Buen producto",
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 1,
        id_producto: 3,
        puntuacion: 3,
        descripcion: "Producto regular",
        createdAt: new Date(),
        updatedAt: new Date()
      })),
    ]);
    console.log(chalk.green("✅ Valoraciones creadas exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear Valoraciones:", error));
  }
}

export { createUser, createCategoria, createProductos, createValoraciones };