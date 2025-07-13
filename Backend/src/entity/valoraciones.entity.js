"use strict"
import { EntitySchema } from "typeorm";
const Valoraciones = new EntitySchema({
    name: "Valoraciones",
    tableName: "valoraciones",
    columns: {
        id_usuario: {
            primary: true,
            type: "int",
            nullable: false,
        },
        id_producto: { 
            type: "int",
            primary: true,
            nullable: false,
        },
        puntuacion: {
            type: "int",
            nullable: false,
        },
        descripcion: {
            type: "varchar",
            length: 255,
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
        },
        Productos: {
            type: "many-to-one",
            target: "Producto",
            joinColumn: {
                name: "id_producto",
            },
        }
    }
});

export default Valoraciones;