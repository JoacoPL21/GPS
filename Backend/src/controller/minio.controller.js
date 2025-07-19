import { getUrlImage, postImage } from "../services/minio.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import sharp from 'sharp';

export async function getrUrlImagen(req, res) {
    const { fileName } = req.params;

    if (!fileName) {
        return handleErrorClient(res, 400, 'El nombre del archivo es requerido');
    }

    try {
        const url = await getUrlImage(fileName);
        if (!url) {
            return handleErrorClient(res, 404, 'Archivo no encontrado');
        }
        return handleSuccess(res, 200, 'URL generada exitosamente', { url });
    } catch (error) {
        console.error('Error al generar la URL prefirmada:', error);
        return handleErrorServer(res, 500, 'Error al generar la URL prefirmada');
    }
}
export async function postImagen(fileBuffer, nombreProducto) {
    try {
       const nombreLimpio = nombreProducto.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
       const fileName = `${nombreLimpio}.webp`;

    const webpBuffer = await sharp(fileBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    const result = await postImage(fileName, webpBuffer);

    if (result.success) {
      return fileName; 
    } else {
      throw new Error(result.message || "No se pudo subir la imagen.");
    }
  } catch (err) {
    console.error("Error al subir imagen:", err);
    throw err;
  }
}

