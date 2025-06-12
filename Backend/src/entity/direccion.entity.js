"use strict";
import { EntitySchema } from "typeorm";

const Direccion = new EntitySchema({
    name: "Direccion",
    tableName: "direcciones",
    columns: {
        id_direccion: {
            primary: true,
            type: "int",
            generated: true,
        },
        calle: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        numero: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
        ciudad: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        region: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        codigo_postal: {
            type: "varchar",
            length: 7,
            nullable: false,
        },
        tipo_de_direccion: {
            type: "enum",
            enum: ["envio", "facturacion", "otro"],
            default: "envio",
        },
    },

   
});

export default Direccion;