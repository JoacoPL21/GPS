import Valoraciones from "../entity/valoraciones.entity.js";
import { AppDataSource } from "../config/configDB.js";

export async function getValoracionesPorProducto(id_producto) {
    try {
        const valoracionesRepository = AppDataSource.getRepository(Valoraciones);
        const valoraciones = await valoracionesRepository.find({
            where: { id_producto: parseInt(id_producto) },
            relations: ["Usuarios"]
        });
        return [valoraciones, null];
    } catch (error) {
        console.error("Error al obtener valoraciones del producto:", error);
        return [null, "Error al obtener valoraciones del producto"];
    }
} 