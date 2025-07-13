"use strict"
import { EntitySchema } from "typeorm";
const Compras = new EntitySchema({
    name: "Compra",
    tableName: "compras",
    columns: {
        id_compra: {
            primary: true,
            type: "int",
            generated: true,
        },
        id_usuario: { 
            type: "int",
            nullable: false,
        },
        facturacion: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        estado: {
            type: "varchar",
            length: 30,
            nullable: false,
        },
        total: {
            type: "int",
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
        Usuarios: {
            type: "many-to-one",
            target: "Usuario",
            joinColumn: {
                name: "id_usuario",
            },
        }
    }
});

export default Compras;