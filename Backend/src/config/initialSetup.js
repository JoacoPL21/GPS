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
      return;
    }
    

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
        profundidad: 20,
        peso: 5
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
        profundidad: 15,
        peso: 3
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
        profundidad: 20,
        peso: 3
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
        profundidad: 60,
        peso: 15
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
        profundidad: 60,
        peso: 15
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
        profundidad: 20,
        peso: 30
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
        profundidad: 20,
        peso: 25
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
        profundidad: 15,
        peso: 0.5
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
        profundidad: 15,
        peso: 0.5
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
        peso: 13
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
        profundidad: 100,
        peso: 4
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
        profundidad: 100,
        peso: 13
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
        profundidad: 200,
        peso: 1
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
        profundidad: 2,
        peso: 0.5
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
        profundidad: 5,
        peso: 0.5
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
        profundidad: 40,
        peso: 5
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
        profundidad: 40,
        peso: 7,
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
        profundidad: 100,
        peso: 30
      })),
    ]);
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
        id_usuario: 2,
        payment_id: "41324185892",
        payment_status: "approved",
        payment_amount: 45000,
        payment_type: "debit_card",
        external_reference: "ORD-1753512926966",
        merchant_order: "32690836821",
        nombre: "Benjamin",
        apellido: "Ortiz",
        email: "benjamin@gmail.com",
        telefono: "966433091",
        direccion: "Av. Providencia 1234",
        region: "Metropolitana",
        ciudad: "Santiago",
        codigo_postal: "7500000",
        facturacion: "12345678-9",
        estado_envio: "entregado",
        total: 45000,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      })),
      ComprasRepository.save(ComprasRepository.create({
        id_usuario: 3,
        payment_id: "41324185893",
        payment_status: "approved",
        payment_amount: 120000,
        payment_type: "credit_card",
        external_reference: "ORD-1753512926967",
        merchant_order: "32690836822",
        nombre: "Joaquin",
        apellido: "Perez",
        email: "joaquin@gmail.com",
        telefono: "978294813",
        direccion: "Calle Las Condes 567",
        region: "Metropolitana",
        ciudad: "Las Condes",
        codigo_postal: "7550000",
        facturacion: "87654321-0",
        estado_envio: "en_transito",
        total: 120000,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-02-20')
      })),
      ComprasRepository.save(ComprasRepository.create({
        id_usuario: 4,
        payment_id: "41324185894",
        payment_status: "approved",
        payment_amount: 35000,
        payment_type: "debit_card",
        external_reference: "ORD-1753512926968",
        merchant_order: "32690836823",
        nombre: "Jonathan",
        apellido: "Olivares",
        email: "jonathan@gmail.com",
        telefono: "912345678",
        direccion: "Av. Vitacura 890",
        region: "Metropolitana",
        ciudad: "Vitacura",
        codigo_postal: "7630000",
        facturacion: "11223344-5",
        estado_envio: "en_preparacion",
        total: 35000,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10')
      })),
      ComprasRepository.save(ComprasRepository.create({
        id_usuario: 5,
        payment_id: "41324185895",
        payment_status: "approved",
        payment_amount: 80000,
        payment_type: "credit_card",
        external_reference: "ORD-1753512926969",
        merchant_order: "32690836824",
        nombre: "Pablo",
        apellido: "Sanchez",
        email: "pablo@gmail.com",
        telefono: "9987654321",
        direccion: "Calle Apoquindo 2345",
        region: "Metropolitana",
        ciudad: "Las Condes",
        codigo_postal: "7550000",
        facturacion: "55667788-9",
        estado_envio: "entregado",
        total: 80000,
        createdAt: new Date('2024-01-28'),
        updatedAt: new Date('2024-01-28')
      })),
      ComprasRepository.save(ComprasRepository.create({
        id_usuario: 6,
        payment_id: "41324185896",
        payment_status: "approved",
        payment_amount: 25000,
        payment_type: "debit_card",
        external_reference: "ORD-1753512926970",
        merchant_order: "32690836825",
        nombre: "Tomas",
        apellido: "Saez",
        email: "tomas@gmail.com",
        telefono: "912345678",
        direccion: "Av. Manquehue 123",
        region: "Metropolitana",
        ciudad: "Providencia",
        codigo_postal: "7500000",
        facturacion: "99887766-5",
        estado_envio: "en_transito",
        total: 25000,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      })),
    ]);
    ComprasRepository.save(ComprasRepository.create({
      id_usuario: 4,
      payment_id: "1324199366",
      payment_status: "approved",
      payment_amount: 40000.00,
      payment_type: "debit_card",
      external_reference: "ORD-1753657893409",
      merchant_order: "32749942716",
      nombre: "Benjamin",
      apellido: "Ortiz",
      email: "benjamin@gmail.com",
      telefono: "966433091",
      direccion: "Av. Providencia 1234",
      region: "Metropolitana",
      ciudad: "Santiago",
      codigo_postal: "7500000",
      estado_envio: "en_preparacion",
      total: 40000.00,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    })),
    ComprasRepository.save(ComprasRepository.create({
      id_usuario: 4,
      payment_id: "1324201336",
      payment_status: "approved",
      payment_amount: 75708.00,
      payment_type: "debit_card",
      external_reference: "ORD-1753657893409",
      merchant_order: "32749942716",
      nombre: "Benjamin",
      apellido: "Ortiz",
      email: "benjamin@gmail.com",
      telefono: "966433091",
      direccion: "Av. Providencia 1234",
      region: "Metropolitana",
      ciudad: "Santiago",
      codigo_postal: "7500000",
      estado_envio: "entregado",
      total: 75708.00,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    })),

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
      // Compra 1 - Benjamin Ortiz
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 1,
        id_producto: 1, // Jardinera
        cantidad: 1,
        precio_unitario: 20000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 1,
        id_producto: 2, // Macetero
        cantidad: 1,
        precio_unitario: 10000,
      })),
      // Compra 2 - Joaquin Perez
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 2,
        id_producto: 4, // Escaño
        cantidad: 1,
        precio_unitario: 120000,
      })),
      
      // Compra 3 - Jonathan Olivares
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 3,
        id_producto: 9, // Juguete de madera
        cantidad: 1,
        precio_unitario: 10000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 3,
        id_producto: 10, // Puzzle de madera
        cantidad: 1,
        precio_unitario: 15000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 3,
        id_producto: 18, // Marco de fotos
        cantidad: 1,
        precio_unitario: 4000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 3,
        id_producto: 19, // Reloj de pared
        cantidad: 1,
        precio_unitario: 6000,
      })),
      
      // Compra 4 - Pablo Sanchez
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 4,
        id_producto: 5, // Mesa de centro
        cantidad: 1,
        precio_unitario: 69000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 4,
        id_producto: 6, // Silla de madera
        cantidad: 1,
        precio_unitario: 25000,
      })),
      
      // Compra 5 - Tomas Saez
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 5,
        id_producto: 11, // Lotes de madera
        cantidad: 1,
        precio_unitario: 12000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 5,
        id_producto: 12, // Madera prensada
        cantidad: 1,
        precio_unitario: 8000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 5,
        id_producto: 13, // Tablero de madera
        cantidad: 1,
        precio_unitario: 5000,
      })),
      // Compra 0 - Presentacion
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 6,
        id_producto: 9, 
        cantidad: 2,
        precio_unitario: 15000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 6,
        id_producto: 2, 
        cantidad: 1,
        precio_unitario: 10000,
      })),
      Compra_ProductoRepository.save(Compra_ProductoRepository.create({
        id_compra: 7,
        id_producto: 13, 
        cantidad: 3,
        precio_unitario: 20000,
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
        estado: "entregado",
      })),
      EnviosRepository.save(EnviosRepository.create({
        id_compra: 2,
        estado: "en_transito",
      })),
      EnviosRepository.save(EnviosRepository.create({
        id_compra: 3,
        estado: "en_preparacion",
      })),
      EnviosRepository.save(EnviosRepository.create({
        id_compra: 4,
        estado: "entregado",
      })),
      EnviosRepository.save(EnviosRepository.create({
        id_compra: 5,
        estado: "en_transito",
      })),
      EnviosRepository.save(EnviosRepository.create({
        id_compra: 6,
        estado: "en_preparacion",
      })),
      EnviosRepository.save(EnviosRepository.create({
        id_compra: 7,
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
      // Valoraciones de Benjamin Ortiz (usuario 2)
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 2,
        id_producto: 1, // Jardinera
        puntuacion: 5,
        descripcion: "Excelente jardinera, perfecta para mi terraza. La madera es de muy buena calidad y el acabado es impecable. Muy recomendada!",
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      })),
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 2,
        id_producto: 2, // Macetero
        puntuacion: 4,
        descripcion: "Muy buen macetero, ideal para plantas pequeñas. El tamaño es perfecto y la madera se ve muy natural.",
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      })),
      
      // Valoraciones de Joaquin Perez (usuario 3)
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 3,
        id_producto: 4, // Escaño
        puntuacion: 5,
        descripcion: "El escaño es espectacular! Perfecto para mi jardín. Muy resistente y cómodo. La madera maciza se nota en la calidad.",
        createdAt: new Date('2024-02-25'),
        updatedAt: new Date('2024-02-25')
      })),
      
      // Valoraciones de Jonathan Olivares (usuario 4)
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 4,
        id_producto: 9, // Juguete de madera
        puntuacion: 5,
        descripcion: "A mi hijo le encantó el juguete! Es muy seguro y duradero. Perfecto para niños pequeños.",
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      })),
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 4,
        id_producto: 10, // Puzzle de madera
        puntuacion: 4,
        descripcion: "Muy buen puzzle, ayuda mucho al desarrollo cognitivo. Las piezas encajan perfectamente.",
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      })),
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 4,
        id_producto: 18, // Marco de fotos
        puntuacion: 3,
        descripcion: "El marco está bien, pero es un poco pequeño para mis fotos. La calidad de la madera es buena.",
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      })),
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 4,
        id_producto: 19, // Reloj de pared
        puntuacion: 4,
        descripcion: "Hermoso reloj de pared, muy elegante. Funciona perfectamente y se ve muy bien en mi sala.",
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      })),
      
      // Valoraciones de Pablo Sanchez (usuario 5)
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 5,
        id_producto: 5, // Mesa de centro
        puntuacion: 5,
        descripcion: "La mesa de centro es perfecta para mi sala. El diseño es elegante y la madera es de excelente calidad.",
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      })),
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 5,
        id_producto: 6, // Silla de madera
        puntuacion: 4,
        descripcion: "Muy buena silla, cómoda y resistente. Perfecta para el comedor.",
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      })),
      
      // Valoraciones de Tomas Saez (usuario 6)
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 6,
        id_producto: 11, // Lotes de madera
        puntuacion: 4,
        descripcion: "Excelente calidad de madera para mis proyectos de carpintería. Muy bien cortada y sin imperfecciones.",
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      })),
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 6,
        id_producto: 12, // Madera prensada
        puntuacion: 3,
        descripcion: "La madera prensada es buena para manualidades, aunque es un poco frágil para proyectos grandes.",
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      })),
      ValoracionesRepository.save(ValoracionesRepository.create({
        id_usuario: 6,
        id_producto: 13, // Tablero de madera
        puntuacion: 5,
        descripcion: "Perfecto tablero de madera para mis proyectos. Muy resistente y de excelente calidad.",
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
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