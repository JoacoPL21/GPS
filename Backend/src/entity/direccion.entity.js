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
            length: 10,
            nullable: false,
        },
        comuna: {
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
            length: 20,
            nullable: false,
        },
        tipo_de_direccion: {
            type: "enum",
            enum: ["predeterminada","opcional"],
            nullable: false,
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
        id_usuario: {
            type: "int",
            nullable: false,
        },
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "Usuario",
            joinColumn: {
                name: "id_usuario",
            },
        },
    },
});

export default Direccion;