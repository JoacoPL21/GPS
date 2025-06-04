"use strict"
import { EntitySchema } from "typeorm";

const Usuarios = new EntitySchema({
    name: "Usuario",
    //nombre de la tabla en la base de datos
    tableName: "usuarios",
    columns: {
        id_usuario: {
            primary: true,
            type: "int",
            generated: true,
        },
        id_direccion: {
            type: "int",
            nullable: true,
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
            length: 120,
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

    relations: {
        direcciones: {
            type: "one-to-many",
            target: "Direccion",
            inverseSide: "usuario",
            cascade: true,
            joinColumn: {
                name: "id_usuario",
                referencedColumnName: "id_usuario",
            },
        },
    }

   
});

export default Usuarios;