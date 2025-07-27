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
        transport_order_number: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        certificate_number: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        tracking_reference: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        service_code: {
            type: "varchar",
            length: 50,
            nullable: true,
        },
        service_description: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        label_data: {
            type: "text",
            nullable: true,
        },
        label_type: {
            type: "varchar",
            length: 50,
            nullable: true,
        },
        barcode: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        current_status: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        current_location: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        last_tracking_update: {
            type: "timestamp",
            nullable: true,
        },
        delivered_date: {
            type: "timestamp",
            nullable: true,
        },
        delivered_to: {
            type: "varchar",
            length: 255,
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