// Backend/src/services/passwordReset.service.js
"use strict";
import { AppDataSource } from "../config/configDB.js";
import PasswordReset from "../entity/passwordReset.entity.js";
import Usuario from "../entity/usuario.entity.js";
import crypto from "crypto";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

/**
 * Generar token de recuperación y guardarlo en la base de datos
 */
export async function createPasswordResetToken(email) {
    try {
        const userRepository = AppDataSource.getRepository(Usuario);
        const resetRepository = AppDataSource.getRepository(PasswordReset);

        // Verificar que el usuario existe
        const user = await userRepository.findOne({
            where: { email }
        });

        if (!user) {
            return [null, "No existe una cuenta asociada a este correo electrónico"];
        }

        // Generar token seguro
        const token = crypto.randomBytes(32).toString('hex');
        
        // Token expira en 1 hora
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        // Invalidar tokens anteriores para este email
        await resetRepository.update(
            { email, used: false },
            { used: true }
        );

        // Crear nuevo token
        const resetToken = resetRepository.create({
            email,
            token,
            expires_at: expiresAt,
            used: false
        });

        await resetRepository.save(resetToken);

        return [token, null];
    } catch (error) {
        console.error("Error al crear token de recuperación:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Verificar si un token es válido
 */
export async function verifyPasswordResetToken(token) {
    try {
        const resetRepository = AppDataSource.getRepository(PasswordReset);

        const resetRecord = await resetRepository.findOne({
            where: { 
                token,
                used: false
            }
        });

        if (!resetRecord) {
            return [null, "Token inválido o ya utilizado"];
        }

        // Verificar si el token ha expirado
        if (new Date() > resetRecord.expires_at) {
            return [null, "El token ha expirado"];
        }

        return [resetRecord, null];
    } catch (error) {
        console.error("Error al verificar token:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Resetear contraseña usando token válido
 */
export async function resetPasswordWithToken(token, newPassword) {
    try {
        const userRepository = AppDataSource.getRepository(Usuario);
        const resetRepository = AppDataSource.getRepository(PasswordReset);

        // Verificar token
        const [resetRecord, tokenError] = await verifyPasswordResetToken(token);
        if (tokenError) {
            return [null, tokenError];
        }

        // Encontrar usuario
        const user = await userRepository.findOne({
            where: { email: resetRecord.email }
        });

        if (!user) {
            return [null, "Usuario no encontrado"];
        }

        // Actualizar contraseña
        const hashedPassword = await encryptPassword(newPassword);
        await userRepository.update(
            { id_usuario: user.id_usuario },
            { password: hashedPassword }
        );

        // Marcar token como usado
        await resetRepository.update(
            { id: resetRecord.id },
            { used: true }
        );

        return [true, null];
    } catch (error) {
        console.error("Error al resetear contraseña:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Limpiar tokens expirados (función de mantenimiento)
 */
export async function cleanExpiredTokens() {
    try {
        const resetRepository = AppDataSource.getRepository(PasswordReset);
        
        const result = await resetRepository.delete({
            expires_at: { $lt: new Date() }
        });

        return [result.affected, null];
    } catch (error) {
        console.error("Error al limpiar tokens expirados:", error);
        return [null, "Error interno del servidor"];
    }
}