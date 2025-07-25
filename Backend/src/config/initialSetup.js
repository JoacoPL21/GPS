'use strict';
import chalk from 'chalk';
import { AppDataSource } from './configDB.js';
import Productos from '../entity/productos.entity.js';
import Usuarios from '../entity/usuario.entity.js';
import Categoria from '../entity/categoria.entity.js';
import Valoraciones from '../entity/valoraciones.entity.js';
import Compra from '../entity/compra.entity.js';
import CompraProducto from '../entity/compra_producto.entity.js';
import Envio from '../entity/envio.entity.js';
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
        nombreCompleto: "Benjamin Ortiz",
        email: "benjamin@gmail.com",
        telefono: "966433091",
        password: await encryptPassword("benja123"),
        rol: "cliente",

      })),
      UserRepository.save(UserRepository.create({
        nombreCompleto: "Joaquin Perez",
        email: "joaquin@gmail.com",
        telefono: "978294813",
        password: await encryptPassword("joaquin123"),
        rol: "cliente",
        
      })),
         UserRepository.save(UserRepository.create({
        nombreCompleto: "Jonathan Olivares",
        email: "jonathan@gmail.com",
        telefono: "912345678",
        password: await encryptPassword("jonathan123"),
        rol: "cliente",
        
      })),
         UserRepository.save(UserRepository.create({
        nombreCompleto: "Pablo Sanchez",
        email: "pablo@gmail.com",
        telefono: "9987654321",
        password: await encryptPassword("pablo123"),
        rol: "cliente",
        
      })),
         UserRepository.save(UserRepository.create({
        nombreCompleto: "Tomas Saez",
        email: "tomas@gmail.com",
        telefono: "912345678",
        password: await encryptPassword("tomas123"),
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
        nombre: "Muebles",
        descripcion: "Muebles de madera artesanales"
      })),
      CategoriaRepository.save(CategoriaRepository.create({
        nombre: "Construcción",
        descripcion: "Materiales de madera para construcción"
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
      
      // Log de productos existentes para debug
      console.log('🔍 [createProductos] Listando productos existentes para debug:');
      const productosExistentes = await ProductosRepository.find();
      productosExistentes.forEach(producto => {
        console.log(`🔍 [createProductos] Producto ID: ${producto.id_producto}, Nombre: ${producto.nombre}, Estado: ${producto.estado}`);
      });
      
      return;
    }
    
    console.log('🔧 [createProductos] Creando productos iniciales...');
    const productosCreados = await Promise.all([
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Jardinera",
        precio: 20000,
        prom_valoraciones: 3,
        stock: 10,
        descripcion: "Ideal para plantas y decorar tu hogar con estilo ya sea en interiores o exteriores.",
        estado: "activo",
        image_url: "jardinera.jpg",
        id_categoria:2,
        alto: 30,
        ancho: 60,
        profundidad: 20
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Macetero",
        precio: 10000,
        prom_valoraciones: 3,
        stock: 10,
        descripcion: "Macetero de madera para plantas pequeñas.",
        estado: "activo",
        image_url: "macetero.webp",
        id_categoria:2,
        alto: 30,
        ancho: 15,
        profundidad: 15
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Medallero",
        precio: 25000,
        prom_valoraciones: 3,
        stock: 10,
        descripcion: "Estante para medallas, ideal para exhibir tus logros deportivos.",
        estado: "activo",
        image_url: "medallero.webp",
        id_categoria:2,
        alto: 30,
        ancho: 2,
        profundidad: 20
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Escaño",
        precio: 120000,
        prom_valoraciones: 5,
        stock: 20,
        descripcion: "Escaño de madera maciza, perfecto para exteriores. Resistente y duradero.",
        estado: "activo",
        image_url:"escaño.webp",
        id_categoria:3,
        alto: 50,
        ancho: 60,
        profundidad: 60
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Mesa de centro",
        precio: 69000,
        stock: 5,
        descripcion: "Mesa de centro de madera, ideal para tu sala de estar.",
        estado: "activo",
        image_url:"mesacentro.webp",
        id_categoria:3,
        alto: 30,
        ancho: 60,
        profundidad: 60
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Silla de madera",
        precio: 25000,
        stock: 20,
        descripcion: "Silla de madera para comedor.",
        estado: "activo",
        image_url:"silla_de_madera.webp",
        id_categoria:3,
        alto: 30,
        ancho: 60,
        profundidad: 60
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Estantería",
        precio: 50000,
        stock: 3,
        descripcion: "Estantería de madera para libros y decoración.",
        estado: "activo",
        image_url:"estanteria.webp",
        id_categoria:3,
        alto: 30,
        ancho: 60,
        profundidad: 20
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Escritorio",
        precio: 60000,
        stock: 10,
        descripcion: "Escritorio de madera para oficina o estudio.",
        estado: "activo",
        image_url:"escritorio.webp",
        id_categoria:3,
        alto: 75,
        ancho: 60,
        profundidad: 20
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Juguete de madera",
        precio: 10000,
        prom_valoraciones: 4,
        stock: 10,
        descripcion: "Juguete de madera para niños, seguro y divertido.",
        estado: "activo",
        image_url: "juguete_de_madera.webp",
        id_categoria:1,
        alto: 15,
        ancho: 15,
        profundidad: 15
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Puzzle de madera",
        precio: 15000,
        prom_valoraciones: 4,
        stock: 15,
        descripcion: "Puzzle de madera para desarrollar habilidades cognitivas.",
        estado: "activo",
        image_url: "puzzle_de_madera.webp",
        id_categoria:1,
        alto: 15,
        ancho: 15,
        profundidad: 15
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Lotes de Madera",
        precio: 12000,
        prom_valoraciones: 4,
        stock: 20,
        descripcion: "Lotes de madera para construir.",
        estado: "activo",
        image_url: "lotes_de_madera.webp",
        id_categoria:4,
        alto: 4,
        ancho: 15,
        profundidad: 100,
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Madera prensada",
        precio: 8000,
        prom_valoraciones: 4,
        stock: 30,
        descripcion: "Madera prensada para construcción y manualidades.",
        estado: "activo",
        image_url: "madera_prensada.webp",
        id_categoria:4,
        alto: 4,
        ancho: 15,
        profundidad: 100
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Tablero de madera",
        precio: 15000,
        prom_valoraciones: 4,
        stock: 25,
        descripcion: "Tablero de madera para proyectos de carpintería.",
        estado: "activo",
        image_url: "tablero_de_madera.webp",
        id_categoria:4,
        alto: 4,
        ancho: 15,
        profundidad: 100
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Viga de madera",
        precio: 30000,
        prom_valoraciones: 4,
        stock: 10,
        descripcion: "Viga de madera para construcción.",
        estado: "activo",
        image_url: "viga_de_madera.webp",
        id_categoria:4,
        alto: 10,
        ancho: 15,
        profundidad: 200
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Bandeja de madera",
        precio: 15000,
        prom_valoraciones: 4,
        stock: 10,
        descripcion: "Bandeja de madera para servir o decorar.",
        estado: "activo",
        image_url: "bandeja_de_madera.webp",
        id_categoria:2,
        alto: 5,
        ancho: 30,
        profundidad: 40
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Marco de fotos",
        precio: 4000,
        prom_valoraciones: 4,
        stock: 15,
        descripcion: "Marco de fotos de madera para tus recuerdos.",
        estado: "activo",
        image_url: "marco_de_fotos.webp",
        id_categoria:2,
        alto: 20,
        ancho: 15,
        profundidad: 2
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Reloj de pared",
        precio: 25000,
        prom_valoraciones: 4,
        stock: 5,
        descripcion: "Reloj de pared de madera, elegante y funcional.",
        estado: "activo",
        image_url: "reloj_de_pared.webp",
        id_categoria:2,
        alto: 30,
        ancho: 30,
        profundidad: 5
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Cajón organizador",
        precio: 20000,
        prom_valoraciones: 4,
        stock: 10,
        descripcion: "Cajón organizador de madera para mantener todo en orden.",
        estado: "activo",
        image_url: "cajon_organizador.webp",
        id_categoria:2,
        alto: 20,
        ancho: 30,
        profundidad: 40
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Banco de madera",
        precio: 80000,
        prom_valoraciones: 4,
        stock: 10,
        descripcion: "Banco de madera para jardín o patio.",
        estado: "activo",
        image_url: "banco_de_madera.webp",
        id_categoria:3,
        alto: 45,
        ancho: 120,
        profundidad: 40
      })),
      ProductosRepository.save(ProductosRepository.create({
        nombre: "Sofá de madera",
        precio: 250000,
        prom_valoraciones: 4,
        stock: 5,
        descripcion: "Sofá de madera con cojines, ideal para sala de estar.",
        estado: "activo",
        image_url: "sofa_de_madera.webp",
        id_categoria:3,
        alto: 90,
        ancho: 200,
        profundidad: 100
      })),
    ]);
    console.log('🔧 [createProductos] Productos creados con IDs:');
    productosCreados.forEach(producto => {
      console.log(`🔧 [createProductos] Producto creado - ID: ${producto.id_producto}, Nombre: ${producto.nombre}`);
    });
    
    console.log(chalk.green("✅ Productos creados exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear productos:", error));
  }
}

async function createCompras() {
  try {
    const ComprasRepository = AppDataSource.getRepository(Compra);

    const count = await ComprasRepository.count();
    if (count > 0) {
      console.log(chalk.yellow("ℹ️  Compras ya existen. Se omite creación."));
      return;
    }

    await Promise.all([
      ComprasRepository.save(ComprasRepository.create({
        id_usuario: 1,
        payment_status: "approved",
        payment_amount: 12000,
        nombre: "Usuario Test",
        apellido: "Apellido Test",
        email: "test@example.com",
        telefono: "123456789",
        direccion: "Dirección Test",
        region: "Región Test",
        ciudad: "Ciudad Test",
        codigo_postal: "12345",
        facturacion: "1234567890",
        estado_envio: "entregado",
        total: 12000,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      ComprasRepository.save(ComprasRepository.create({
        id_usuario: 1,
        facturacion: "1234567890",
        estado_envio: "en_elaboracion",
        total: 12000,
        createdAt: new Date(),
        updatedAt: new Date(),
        payment_status: "approved",
        payment_amount: 15000,
        nombre: "Usuario Test 2",
        apellido: "Apellido Test 2",
        email: "test2@example.com",
        telefono: "987654321",
        direccion: "Dirección Test 2",
        region: "Región Test 2",
        ciudad: "Ciudad Test 2",
        codigo_postal: "54321"
      })),
      ComprasRepository.save(ComprasRepository.create({
        id_usuario: 1,
        payment_status: "pending",
        payment_amount: 8000,
        nombre: "Usuario Test 3",
        apellido: "Apellido Test 3",
        email: "test3@example.com",
        telefono: "555666777",
        direccion: "Dirección Test 3",
        region: "Región Test 3",
        ciudad: "Ciudad Test 3",
        codigo_postal: "11111",
        facturacion: "1234567890",
        estado_envio: "en_transito",
        total: 12000,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
    ]);

    console.log(chalk.green("✅ Compras creadas exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear compras:", error));
  }
}

async function createCompra_Producto() {
  try {
    const Compra_ProductoRepository = AppDataSource.getRepository(CompraProducto);

    const count = await Compra_ProductoRepository.count();
    if (count > 0) {
      console.log(chalk.yellow("ℹ️  Compra_Producto ya existen. Se omite creación."));
      return;
    }

    await Promise.all([
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 1,
        id_producto: 1,
        cantidad: 1,
        precio_unitario: 10000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 1,
        id_producto: 2,
        precio_unitario: 20000,
        cantidad: 2,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 1,
        id_producto: 3,
        cantidad: 1,
        precio_unitario: 30000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 2,
        id_producto: 4,
        cantidad: 1,
        precio_unitario: 30000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 3,
        id_producto: 1,
        cantidad: 1,
        precio_unitario: 30000,
      })),
    ]);

    console.log(chalk.green("✅ Compra_Producto creadas exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear Compra_Producto:", error));
  }
}

async function createEnvios() {
  try {
    const EnviosRepository = AppDataSource.getRepository(Envio);

    const count = await EnviosRepository.count();
    if (count > 0) {
      console.log(chalk.yellow("ℹ️  Envios ya existen. Se omite creación."));
      return;
    }

    await Promise.all([
      EnviosRepository.save(EnviosRepository.create({
        id_compra: 1,
        estado: "pendiente",
      })),
      EnviosRepository.save(EnviosRepository.create({
        id_compra: 2,
        estado: "en_transito",
      })),
      EnviosRepository.save(EnviosRepository.create({
        id_compra: 3,
        estado: "entregado",
      })),
    ]);

    console.log(chalk.green("✅ Envios creadas exitosamente."));
  } catch (error) {
    console.error(chalk.red("❌ Error al crear Envios:", error));
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

export { 
  createUser, 
  createCategoria, 
  createProductos, 
  createCompras,
  createCompra_Producto,
  createEnvios,
  createValoraciones 
};