"use strict"
import { EntitySchema } from "typeorm";
const Compra_Producto = new EntitySchema({
    name: "Compra_Producto",
    tableName: "compra_producto",
    columns: {
        id_compra: {
            primary: true,
            type: "int",
            nullable: false,
        },
        id_producto: { 
            type: "int",
            primary: true,
            nullable: false,
        },
        cantidad: {
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
        Compras: {
            type: "many-to-one",
            target: "Compra",
            joinColumn: {
                name: "id_compra",
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

export default Compra_Producto;