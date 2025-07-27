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
          const nombreLimpio = nombreProducto
              .trim()
              .toLowerCase()
              .normalize("NFD")                      
              .replace(/[\u0300-\u036f]/g, "")      
              .replace(/\s+/g, '_')                 
              .replace(/[^a-z0-9_]/g, '')           
       const fileName = `${nombreLimpio}.webp`;
       console.log("📸 Nombre de archivo generado:", fileName);

    console.log("🔄 Convirtiendo imagen a WebP...");
    const webpBuffer = await sharp(fileBuffer)
      .webp({ quality: 80 })
      .toBuffer();
    console.log("✅ Imagen convertida a WebP, tamaño:", webpBuffer.length);

    console.log("☁️ Subiendo a MinIO...");
    const result = await postImage(fileName, webpBuffer);

    if (result.success) {
      console.log("✅ Imagen subida exitosamente a MinIO:", fileName);
      return fileName; 
    } else {
      console.log("❌ Error al subir a MinIO:", result.message);
      throw new Error(result.message || "No se pudo subir la imagen.");
    }
  } catch (err) {
    console.error("💥 Error en postImagen:", err);
    throw err;
  }
}

