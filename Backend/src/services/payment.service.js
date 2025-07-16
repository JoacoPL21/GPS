"use strict";
import { AppDataSource } from "../config/configDB.js";
import Compra from "../entity/compra.entity.js";
import CompraProducto from "../entity/compra_producto.entity.js";
import Usuario from "../entity/usuario.entity.js";

export class PaymentService {
  /**
   * transactionData: datos de MercadoPago (incluyendo payment_id, status, amount, payer.email, etc)
   * productos: array de productos comprados
   * datosPersonales: datos del formulario (nombre, dirección, teléfono, etc)
   */
  async saveTransaction(transactionData, productos = [], datosPersonales = {}) {
    try {
      const compraRepository = AppDataSource.getRepository(Compra);
      const compraProductoRepository = AppDataSource.getRepository(CompraProducto);
      const usuarioRepository = AppDataSource.getRepository(Usuario);

      // 1. Obtener el email del comprador desde MercadoPago
      const emailComprador =
        transactionData.email ||
        datosPersonales.email ||
        "";

      // 2. Buscar usuario por email
      let usuarioInvitado = await usuarioRepository.findOne({
        where: { email: emailComprador }
      });

      // 3. Si no existe, crear usuario invitado con nombre incremental
      if (!usuarioInvitado) {
        // Usar el nombre del form o "Invitado" si no hay
        const baseName = (datosPersonales.fullName || datosPersonales.nombre || "Invitado").replace(/\s+/g, '');
        const invitadoNamePrefix = `${baseName}_invitado_`;

        // Buscar cuántos invitados hay con ese nombre base
        const existingInvitados = await usuarioRepository
          .createQueryBuilder("usuario")
          .where("usuario.nombreCompleto LIKE :prefix", { prefix: `${invitadoNamePrefix}%` })
          .getCount();

        // Siguiente número incremental
        const nuevoNombre = `${invitadoNamePrefix}${existingInvitados + 1}`;

        // Crear usuario invitado con valores obligatorios
        usuarioInvitado = usuarioRepository.create({
          nombreCompleto: nuevoNombre,
          email: emailComprador,
          telefono: datosPersonales.phone || "",
          password: "invited_user", // Valor seguro
          rol: "cliente", // Cambia si usas un rol "invitado"
          // id_direccion: null // Si lo necesitas
        });
        usuarioInvitado = await usuarioRepository.save(usuarioInvitado);
      }
      const idUsuario = usuarioInvitado.id_usuario;

      // 4. Guardar la compra
      const compraData = {
        payment_id: transactionData.payment_id,
        payment_status: transactionData.status,
        external_reference: transactionData.external_reference,
        payment_amount: transactionData.amount,
        payment_type: transactionData.payment_type,
        merchant_order_id: transactionData.merchant_order_id,
        preference_id: transactionData.preference_id,
        id_usuario: idUsuario,
        nombre: datosPersonales.fullName || datosPersonales.nombre || usuarioInvitado.nombreCompleto,
        apellido: datosPersonales.apellido || "",
        email: emailComprador,
        telefono: datosPersonales.phone || "",
        direccion: datosPersonales.address || "",
        region: datosPersonales.regionCode || datosPersonales.region || "",
        ciudad: datosPersonales.comunaCode || datosPersonales.ciudad || "",
        codigo_postal: datosPersonales.postalCode || "",
        instrucciones: datosPersonales.instructions || ""
      };

      const compra = compraRepository.create(compraData);
      const compraGuardada = await compraRepository.save(compra);

      // 5. Guardar productos comprados
      if (Array.isArray(productos)) {
        for (const prod of productos) {
          const compraProd = compraProductoRepository.create({
            id_compra: compraGuardada.id_compra,
            id_producto: prod.id_producto || prod.id || prod.id_producto,
            cantidad: prod.cantidad || prod.quantity || 1
          });
          await compraProductoRepository.save(compraProd);
        }
      }

      return compraGuardada;
    } catch (error) {
      if (error.code === '23505' || error.message.includes('duplicate key value')) {
        console.warn(`Compra duplicada: ${transactionData.payment_id}`);
        return { id: 'duplicated', payment_id: transactionData.payment_id };
      }
      console.error('Error al guardar compra:', error);
      throw error;
    }
  }

  async getTransactionByPaymentId(paymentId) {
    try {
      const compraRepository = AppDataSource.getRepository(Compra);
      return await compraRepository.findOne({
        where: { payment_id: paymentId },
        relations: ["Productos", "Usuario"]
      });
    } catch (error) {
      console.error('Error al obtener compra por paymentId:', error);
      throw error;
    }
  }
}