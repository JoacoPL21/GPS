
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
        image_url: {
        type: "varchar",
        length: 255,
        nullable: true,
        },
        precio: {
        type: "int",
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
    // Relacion entre Producto y Categoria
    // Un producto pertenece a una categoria
    // Una categoria puede tener varios productos
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