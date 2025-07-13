import { Client } from "minio";

export const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT) ,
    useSSL: process.env.MINIO_USE_SSL === "false",
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY 
    });

    minioClient.bucketExists('gps', (err, exists) => {
  if (err) {
    console.error('❌ No se pudo conectar a MinIO:', err.message);
    return;
  }
  
  if (exists) {
    console.log('✅ Conexión exitosa a MinIO. Bucket disponible.');
  } else {
    console.warn('⚠️ Conexión establecida pero el bucket no existe.');
  }
});