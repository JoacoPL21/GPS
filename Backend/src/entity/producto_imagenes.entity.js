import { EntitySchema } from "typeorm";

const ProductoImagenes = new EntitySchema({
    name: "ProductoImagenes",
    tableName: "producto_imagenes",
    columns: {
        id_imagen: {
            primary: true,
            type: "int",
            generated: true,
        },
        id_producto: {
            type: "int",
        },
        image_url: {
            type: "varchar",
            length: 255,
        },
        orden: {
            type: "int",
            default: 0,
            comment: "Orden de la imagen para mostrar (0 = principal)"
        },
        descripcion: {
            type: "varchar",
            length: 255,
            nullable: true,
            comment: "Descripción opcional de la imagen"
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        producto: {
            target: "Producto",
            type: "many-to-one",
            joinColumn: {
                name: "id_producto",
            },
            onDelete: "CASCADE", // Si se elimina el producto, se eliminan sus imágenes
        },
    },
    indices: [
        {
            name: "IDX_PRODUCTO_ORDEN",
            columns: ["id_producto", "orden"],
        },
    ],
});

export default ProductoImagenes;
