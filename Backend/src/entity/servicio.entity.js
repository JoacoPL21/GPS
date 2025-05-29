"use strict";
import { EntitySchema } from "typeorm";

const Servicios = new EntitySchema({
    name: "Servicio",
    //nombre de la tabla en la base de datos
    tableName: "servicios",
    columns: {
        id_servicio: {
            primary: true,
            type: "int",
            generated: true,
        },
        nombreServicio: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        descripcion: {
            type: "text",
            nullable: false,
        },
        
        id_cliente: {
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
        //relacion entre servicios y clientes
        //un servicio pertenece a un cliente
         cliente: {
             target: "usuarios",
             type: "many-to-one",
                joinColumn: {
                    name: "id_usuario",
                    referencedColumnName: "id_usuario",
                },
         },
    }
});

export default Servicios;