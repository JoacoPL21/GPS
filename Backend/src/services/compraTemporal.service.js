"use strict";
import { AppDataSource } from "../config/configDB.js";
import CompraTemporal from "../entity/compraTemporal.entity.js";

// Modelo temporal para guardar datos antes del pago (puedes adaptar el schema)
export class CompraTemporalService {
  async saveCompraTemporal(external_reference, productos, datosPersonales) {
    const compraTemporalRepository = AppDataSource.getRepository(CompraTemporal);
    let compraTemporal = await compraTemporalRepository.findOne({
      where: { external_reference }
    });

    if (!compraTemporal) {
      compraTemporal = compraTemporalRepository.create({
        external_reference,
        productos: JSON.stringify(productos),
        datos_personales: JSON.stringify(datosPersonales),
        fecha_creacion: new Date()
      });
      await compraTemporalRepository.save(compraTemporal);
    }
    return compraTemporal;
  }

  async getCompraTemporal(external_reference) {
    const compraTemporalRepository = AppDataSource.getRepository(CompraTemporal);
    const compraTemporal = await compraTemporalRepository.findOne({
      where: { external_reference }
    });
    if (!compraTemporal) return null;
    return {
      productos: JSON.parse(compraTemporal.productos),
      datosPersonales: JSON.parse(compraTemporal.datos_personales)
    };
  }

  async deleteCompraTemporal(external_reference) {
    const compraTemporalRepository = AppDataSource.getRepository(CompraTemporal);
    await compraTemporalRepository.delete({ external_reference });
  }
}