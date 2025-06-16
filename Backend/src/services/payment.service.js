"use strict";
import { AppDataSource } from "../config/configDB.js";
import Transaccion from "../entity/Transaccion.js";

export class PaymentService {
  async saveTransaction(transactionData) {
    const transactionRepository = AppDataSource.getRepository(Transaccion);
    const transaction = transactionRepository.create(transactionData);
    return await transactionRepository.save(transaction);
  }

  async getTransactionByPaymentId(paymentId) {
    return await AppDataSource.getRepository(Transaccion).findOne({
      where: { payment_id: paymentId }
    });
  }
}