import { minioClient } from '../config/configMinio.js';

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise(resolve => setTimeout(() => resolve(null), ms))
  ]);
}

export async function getUrlImage(fileName, bucketName = 'gps', folder = 'productos') {
  if (!fileName) return null;

  try {
    const objectName = folder ? `${folder}/${fileName}` : fileName;
    const url = await withTimeout(
      minioClient.presignedGetObject(bucketName, objectName, 60 * 60),
      2000 // timeout en 2 segundos
    );
    if (!url) {
      console.warn(`Timeout al obtener la URL firmada para ${fileName}`);
    }
    return url;
  } catch (error) {
    console.error(`Error al generar URL firmada para ${fileName}:`, error);
    return null;
  }
}