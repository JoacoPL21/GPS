"use strict";
import { EntitySchema } from "typeorm";

const CompraTemporal = new EntitySchema({
  name: "CompraTemporal",
  tableName: "compra_temporal",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    external_reference: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    productos: {
      type: "text",
      nullable: false,
    },
    datos_personales: {
      type: "text",
      nullable: false,
    },
    fecha_creacion: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
});

export default CompraTemporal;