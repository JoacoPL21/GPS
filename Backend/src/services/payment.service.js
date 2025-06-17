"use strict";
import { AppDataSource } from "../config/configDB.js";
import Transaccion from "../entity/Transaccion.js";

export class PaymentService {
  async saveTransaction(transactionData) {
    try {
      const transactionRepository = AppDataSource.getRepository(Transaccion);
      const transaction = transactionRepository.create(transactionData);
      return await transactionRepository.save(transaction);
    } catch (error) {
      // Manejar error de transacción duplicada
      if (error.code === '23505' || error.message.includes('duplicate key value')) {
        console.warn(`Transacción duplicada: ${transactionData.payment_id}`);
        return { id: 'duplicated', payment_id: transactionData.payment_id };
      }
      
      // Registrar otros errores
      console.error('Error al guardar transacción:', error);
      throw error;
    }
  }

  async getTransactionByPaymentId(paymentId) {
    try {
      return await AppDataSource.getRepository(Transaccion).findOne({
        where: { payment_id: paymentId }
      });
    } catch (error) {
      console.error('Error al obtener transacción por paymentId:', error);
      throw error;
    }
  }
}