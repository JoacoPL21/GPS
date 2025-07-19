"use strict"
import { EntitySchema } from "typeorm";
const Envios = new EntitySchema({
    name: "Envio",
    tableName: "envios",
    columns: {
        id_compra: {
            primary: true,
            type: "int",
            nullable: false,
        },
        id_envio: { 
            type: "int",
            primary: true,
            generated: true,
        },
        estado: {
            type: "varchar",
            length: 100,
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
    },
    relations: {
        Compras: {
            type: "many-to-one",
            target: "Compra",
            joinColumn: {
                name: "id_compra",
            },
        }
    }
});

export default Envios;