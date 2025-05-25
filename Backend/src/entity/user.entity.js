"use strict"
import { EntitySchema } from "typeorm";

const UserSchema = new EntitySchema({
    name: "User",
    //nombre de la tabla en la base de datos
    tableName: "clientes",
    columns: {
        id_cliente: {
            primary: true,
            type: "int",
            generated: true,
        },
        nombreCompleto: { 
            type: "varchar",
            length: 100,
            nullable: false,
        },
        email: {
            type: "varchar",
            length: 100,
            unique: true,
            nullable: false,
        },
        telefono: {
            type: "varchar",
            length: 15,
            nullable: true,
        },
        password: {
            type: "varchar",
            length: 20,
            nullable: false,
        },
        rol: {
            type: "enum",
            enum: ["admin", "cliente"],
            default: "cliente",
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

    indices: [
        {
            name: "IDX_USER",
            columns: ["id_cliente"],
            unique: true,
        },

        {
            name: "IDX_EMAIL",
            columns: ["email"],
            unique: true,
        },
    ],
});

export default UserSchema;