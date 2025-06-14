"use strict"
import { EntitySchema } from "typeorm";

const Transacciones = new EntitySchema({
    name: "Transaccion",
    tableName: "transacciones",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        mercadopago_id: {
            type: "varchar",
            length: 255,
            unique: true,
            nullable: false,
        }, 
        external_reference: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        status: {
            type: "enum",
            enum: ["pending", "approved", "rejected", "cancelled"],
            nullable: false,
        },
        payment_method: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        transaction_amount: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        currency_id: {
            type: "varchar",
            length: 10,
            default: 'CLP', 
            nullable: false,  
        },
        payer_email: {
            type: "varchar",
            length: 255, 
            nullable: true,
        },
        //
        id_usuario: {
            type: "int",
            nullable: true,
            comment: "ID del usuario en nuestro sistema"
        },
        shipping_id: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        shipping_status: {
            type: "enum",
            enum: ["ready_to_ship", "shipped", "delivered", "cancelled"],
            nullable: true,
        },
        tracking_number: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        shipping_address: {
            type: "json",
            nullable: true,
        },
        payment_type: {
            type: "varchar",
            length: 50,
            nullable: true,
            comment: "Tipo de pago: credit_card, debit_card, bank_transfer, etc."
        },
        installments: {
            type: "int",
            nullable: true,
            comment: "Número de cuotas si aplica"
        },
        processing_mode: {
            type: "varchar",
            length: 50,
            nullable: true,
            comment: "aggregator, gateway"
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
            name: "IDX_MERCADOPAGO_ID",
            columns: ["mercadopago_id"],
            unique: true
        },
        {
            name: "IDX_EXTERNAL_REFERENCE",
            columns: ["external_reference"]
        },
        {
            name: "IDX_STATUS",
            columns: ["status"]
        },
        {
            name: "IDX_id_usuario",
            columns: ["id_usuario"]
        },
        {
            name: "IDX_CREATED_AT",
            columns: ["createdAt"]
        },
        {
            name: "IDX_SHIPPING_STATUS",
            columns: ["shipping_status"]
        }
    ],

    relations: {
        usuario: {
            type: "many-to-one",
            target: "Usuario",
            joinColumn: {
                name: "id_usuario",
                referencedColumnName: "id_usuario",
            },
            nullable: true
        },
        // orden: {
        //     type: "one-to-one",
        //     target: "Orden",
        //     joinColumn: {
        //         name: "external_reference",
        //         referencedColumnName: "codigo_orden",
        //     },
        //     nullable: true
        // }
    }
});

export default Transacciones;