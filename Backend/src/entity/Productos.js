
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
        id_categoria: {
        type: "int",
        nullable: false,
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: false,
        }
        
    },
    relations: {
        categoria: {
            type: "many-to-one",
            target: "Categoria",
            joinColumn: {
                name: "id_categoria",
            },
            onDelete: "CASCADE"
        }
    }
});
export default Productos;