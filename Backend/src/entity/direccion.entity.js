"use strict";
import { EntitySchema } from "typeorm";

const Direcciones = new EntitySchema({
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
            type: "int",
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
        pais: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        tipo_de_direccion: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        updatedAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: false,
        },

    },
});

export default Direcciones;