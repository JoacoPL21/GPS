"use strict";
import { AppDataSource } from "../config/configDB.js";
import Compra from "../entity/compra.entity.js";
import CompraProducto from "../entity/compra_producto.entity.js";
import Usuario from "../entity/usuario.entity.js";
import Direccion from "../entity/direccion.entity.js";

export class PaymentService {
  async saveTransaction(transactionData, productos = [], datosPersonales = {}) {
    try {
      const compraRepository = AppDataSource.getRepository(Compra);
      const compraProductoRepository = AppDataSource.getRepository(CompraProducto);
      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const direccionRepository = AppDataSource.getRepository(Direccion);

      // 1. Obtener el email del comprador desde el formulario
      const emailForm = datosPersonales.email || "";

      // 2. Buscar usuario por email del formulario
      let usuarioInvitado = await usuarioRepository.findOne({
        where: { email: emailForm }
      });

      // 3. Si no existe, crear dirección y usuario invitado con los datos del form
      let direccionGuardada = null;
      if (!usuarioInvitado) {
        // Crear dirección
        const direccionData = {
          direccion: datosPersonales.address || "",
          ciudad: datosPersonales.ciudad || datosPersonales.comunaCode || "No especificada",
          region: datosPersonales.region || datosPersonales.regionCode || "No especificada",
          codigo_postal: datosPersonales.postalCode || "00000",
          pais: "Chile",
          tipo_de_direccion: "predeterminada"
        };
        direccionGuardada = await direccionRepository.save(direccionData);

        // Usar los campos separados y nombre incremental
        const baseName = (datosPersonales.nombres || "Invitado").replace(/\s+/g, '');
        const invitadoNamePrefix = `${baseName}_invitado_`;

        // Buscar cuántos invitados hay con ese nombre base
        const existingInvitados = await usuarioRepository
          .createQueryBuilder("usuario")
          .where("usuario.nombreCompleto LIKE :prefix", { prefix: `${invitadoNamePrefix}%` })
          .getCount();

        // Siguiente número incremental
        const nuevoNombre = `${invitadoNamePrefix}${existingInvitados + 1}`;

        usuarioInvitado = usuarioRepository.create({
          nombreCompleto: `${datosPersonales.nombres} ${datosPersonales.apellidos}` || nuevoNombre,
          email: emailForm,
          telefono: datosPersonales.phone || "",
          password: "null",
          rol: "invitado",
          id_direccion: direccionGuardada.id_direccion 
        });
        usuarioInvitado = await usuarioRepository.save(usuarioInvitado);
      }

      const idUsuario = usuarioInvitado.id_usuario;

      // 4. Guardar la compra, incluyendo ambos emails
      const compraData = {
        payment_id: transactionData.payment_id,
        payment_status: transactionData.status,
        external_reference: transactionData.external_reference,
        payment_amount: transactionData.amount,
        payment_type: transactionData.payment_type,
        merchant_order_id: transactionData.merchant_order_id,
        preference_id: transactionData.preference_id,
        id_usuario: idUsuario,
        nombre: datosPersonales.nombres || "",
        apellido: datosPersonales.apellidos || "",
        email: emailForm, // Email del formulario
        telefono: datosPersonales.phone || "",
        direccion: datosPersonales.address || "",
        region: datosPersonales.region || datosPersonales.regionCode || "",
        ciudad: datosPersonales.ciudad || datosPersonales.comunaCode || "",
        codigo_postal: datosPersonales.postalCode || "",
        instrucciones: datosPersonales.instructions || "",
        // Puedes agregar campo para email de MercadoPago si quieres:
        email_mp: transactionData.email || ""
      };

      const compra = compraRepository.create(compraData);
      const compraGuardada = await compraRepository.save(compra);

      // 5. Guardar productos comprados (con id_producto ya incluido desde frontend)
      if (Array.isArray(productos)) {
        for (const prod of productos) {
          if (prod.id_producto) {
            const compraProd = compraProductoRepository.create({
              id_compra: compraGuardada.id_compra,
              id_producto: prod.id_producto,
              cantidad: prod.cantidad || prod.quantity || 1
            });
            await compraProductoRepository.save(compraProd);
          }
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
        relations: ["Productos", "Usuario", "Usuario.direccion"] // Cambié el formato de relaciones
      });
    } catch (error) {
      console.error('Error al obtener compra por paymentId:', error);
      throw error;
    }
  }
}