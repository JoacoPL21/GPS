// Backend/src/controller/passwordReset.controller.js
"use strict";
import { 
    createPasswordResetToken, 
    resetPasswordWithToken 
} from "../services/passwordReset.service.js";
import { sendPasswordResetEmail } from "../helpers/email.helper.js";
import { 
    forgotPasswordValidation, 
    resetPasswordValidation 
} from "../validations/auth.validation.js";
import { 
    handleSuccess, 
    handleErrorClient, 
    handleErrorServer 
} from "../handlers/responseHandlers.js";

/**
 * Solicitar recuperación de contraseña
 */
export async function forgotPasswordController(req, res) {
    try {
        const { body } = req;

        // Validar datos de entrada
        const { error } = forgotPasswordValidation.validate(body);
        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const { email } = body;

        // Crear token de recuperación
        const [token, tokenError] = await createPasswordResetToken(email);
        if (tokenError) {
            return handleErrorClient(res, 400, tokenError);
        }

        // Enviar email
        const [emailSent, emailError] = await sendPasswordResetEmail(email, token);
        if (emailError) {
            return handleErrorServer(res, 500, "Error al enviar el correo electrónico");
        }

        return handleSuccess(res, 200, 
            "Se ha enviado un enlace de recuperación a tu correo electrónico",
            { message: "Revisa tu bandeja de entrada y spam" }
        );

    } catch (error) {
        console.error("Error en forgotPasswordController:", error);
        return handleErrorServer(res, 500, "Error interno del servidor");
    }
}

/**
 * Restablecer contraseña con token
 */
export async function resetPasswordController(req, res) {
    try {
        const { body } = req;

        // Validar datos de entrada
        const { error } = resetPasswordValidation.validate(body);
        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const { token, newPassword } = body;

        // Resetear contraseña
        const [success, resetError] = await resetPasswordWithToken(token, newPassword);
        if (resetError) {
            return handleErrorClient(res, 400, resetError);
        }

        return handleSuccess(res, 200, 
            "Contraseña restablecida exitosamente",
            { message: "Ya puedes iniciar sesión con tu nueva contraseña" }
        );

    } catch (error) {
        console.error("Error en resetPasswordController:", error);
        return handleErrorServer(res, 500, "Error interno del servidor");
    }
}