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
            nullable: true, // Puede ser null si el usuario es invitado la logica debe aplicarse en el registro para que lo usuarios normales no tengan el campo password como null
        },
        rol: {
            type: "enum",
            enum: ["admin", "cliente", "Invitado"],
            default: "cliente",
            nullable: false,
        },
        id_direccion: {
            type: "int",
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
    relations: {
        direccion: { 
            type: "many-to-one",
            target: "Direccion", 
            joinColumn: {
                name: "id_direccion",
            },
        },
    },
});

export default Usuarios;