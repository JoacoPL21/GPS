"use strict";
import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Transaccion",
  tableName: "transacciones",
  columns: {
    id_transaccion: {
      primary: true,
      type: "int",
      generated: true,
    },
    payment_id: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    status: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    external_reference: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    amount: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    payment_type: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    merchant_order_id: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    preference_id: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});