// Backend/src/entity/passwordReset.entity.js
"use strict";
import { EntitySchema } from "typeorm";

const PasswordReset = new EntitySchema({
    name: "PasswordReset",
    tableName: "password_resets",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        email: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        token: {
            type: "varchar",
            length: 255,
            nullable: false,
            unique: true,
        },
        expires_at: {
            type: "timestamp",
            nullable: false,
        },
        used: {
            type: "boolean",
            default: false,
            nullable: false,
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
    indices: [
        {
            name: "IDX_PASSWORD_RESET_TOKEN",
            columns: ["token"],
        },
        {
            name: "IDX_PASSWORD_RESET_EMAIL",
            columns: ["email"],
        },
    ],
});

export default PasswordReset;