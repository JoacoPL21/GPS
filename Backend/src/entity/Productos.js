
import { EntitySchema } from "typeorm";

const Productos = new EntitySchema({
    name: "Producto",
    tableName: "productos",
    columns: {
        id_producto: {
        primary: true,
        type: "int",
        generated: true,
        },
        nombre: {
        type: "varchar",
        length: 255,
        },
        precio: {
        type: "decimal",
        },
        stock: {
        type: "int",
        },
        descripcion: {
        type: "varchar",
        },
        estado: {
        type:"varchar",
        },
    },
    });
export default Productos;