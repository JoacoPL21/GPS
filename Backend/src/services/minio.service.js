import { minioClient } from '../config/configMinio.js';

export async function getUrlImage(fileName, bucketName = 'gps', folder = 'productos') {
  if (!fileName) return null;

  try {
    const objectName = folder ? `${folder}/${fileName}` : fileName;
    const url = await minioClient.presignedGetObject(bucketName, objectName, 60 * 60); // 1 hora
    return url;
  } catch (error) {
    console.error(`Error al generar URL firmada para ${fileName}:`, error);
    return null;
  }
}