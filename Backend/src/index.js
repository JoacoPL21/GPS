import express from 'express';
import morgan from 'morgan';
import routes from './routes/routes.js';
import cors from 'cors';
import { connectDB } from './config/configDB.js';
import { createUser, createProductos } from './config/initialSetup.js';

const app = express();
app.use(express.json());

app.use(cors());
app.use(morgan('dev'));
app.use(routes);

async function initialSetup() {
  try {
    console.log('1. Iniciando conexión a DB...');
    await connectDB();
    console.log('2. Conexión exitosa. Creando datos iniciales...');
    await createUser(); 
    await createProductos();
    console.log('3. Datos creados. Iniciando servidor...');
    
    app.listen(1214, () => {
      console.log('🚀 Servidor corriendo en el puerto 1214');
    });
  } catch (error) {
    console.error('❌ Error en la configuración inicial:', error);
  }
}

initialSetup();