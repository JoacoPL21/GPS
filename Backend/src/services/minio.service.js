import { minioClient } from '../config/configMinio.js';
// Función para manejar el tiempo de las imagenes en caso de que no haya vpn
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
      2000 
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

export async function postImage(fileName, fileBuffer, bucketName = 'gps', folder = 'productos') {
  if (!fileName || !fileBuffer) return null;

  try {
    const objectName = folder ? `${folder}/${fileName}` : fileName;
    await minioClient.putObject(bucketName, objectName, fileBuffer);
    return { success: true, message: 'Imagen subida correctamente' };
  } catch (error) {
    console.error(`Error al subir la imagen ${fileName}:`, error);
    return { success: false, message: 'Error al subir la imagen' };
  }
}