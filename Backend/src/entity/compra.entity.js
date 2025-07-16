"use strict"
import { EntitySchema } from "typeorm";
const Compra = new EntitySchema({
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
            nullable: true, // Se puso null en caso de que el comprador este como invitado y no se haya podido extraer el id del usuario 
        },
        payment_id: {
            type: "varchar",
            length: 255,
            nullable: true,
            unique: true,
        },
        payment_status: {
            type: "varchar",
            length: 50,
            nullable: true,
        },
        external_reference: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        payment_amount: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        payment_type: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        merchant_order_id: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        preference_id: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        // --------- la informacion  rescatada del form implementado antes del pago y en base a esta informacion se creara el id del usuario invitado---------
        nombre: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        apellido: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        email: {
            type: "varchar",
            length: 150,
            nullable: true,
        },
        telefono: {
            type: "varchar",
            length: 50,
            nullable: true,
        },
        direccion: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        region: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        ciudad: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        codigo_postal: {
            type: "varchar",
            length: 20,
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
        Usuario: {
            type: "many-to-one",
            target: "Usuario",
            joinColumn: {
                name: "id_usuario",
            },
        },
        Productos: {
            type: "one-to-many",
            target: "Compra_Producto",
            inverseSide: "Compra",
        },
        Envios: {
            type: "one-to-many",
            target: "Envio",
            inverseSide: "Compra",
        }
    }
});

export default Compra;