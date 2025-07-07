import { minioClient } from "../config/configMinio.js";

export async function generarUrl(req,res) {
     const { fileName } = req.body;

    if (!fileName) {
        return res.status(400).json({ message: 'El nombre del archivo es requerido' });
    }

    try {
        const bucketName = 'gps'; 
        const presignedUrl = await minioClient.presignedPutObject(bucketName, fileName, 60 * 60); 
        res.status(200).json({ url: presignedUrl });
    } catch (error) {
        console.error('Error al generar la URL prefirmada:', error);
        res.status(500).json({ message: 'Error al generar la URL prefirmada' });
    }
    
}
export async function generarPreFirmaUrl(req, res) {
    const { fileName } = req.params;

    if (!fileName) {
        return res.status(400).json({ message: 'El nombre del archivo es requerido' });
    }

    try {
        const bucketName = 'gps';
        const presignedUrl = await minioClient.presignedGetObject(bucketName, fileName, 60 * 5); // 5 min

        res.status(200).json({ url: presignedUrl });
    } catch (error) {
        console.error('Error al generar URL de lectura:', error);
        res.status(500).json({ message: 'Error al generar URL de lectura' });
    }
}