// Backend/src/helpers/email.helper.js
"use strict";
import nodemailer from "nodemailer";

// Configuración del transporter (usando Gmail como ejemplo)
const createTransporter = () => {
    return nodemailer.createTransport({  // ✅ CORREGIDO: createTransport (sin "r")
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Tu email
            pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
        }
    });
};

/**
 * Enviar email de recuperación de contraseña
 */
export async function sendPasswordResetEmail(email, token) {
    try {
        const transporter = createTransporter();
        
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperación de Contraseña - GPS',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #a47148;">Recuperación de Contraseña</h2>
                    <p>Hola,</p>
                    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                    <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                    <a href="${resetUrl}" 
                       style="background-color: #a47148; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
                        Restablecer Contraseña
                    </a>
                    <p>Este enlace expirará en 1 hora por seguridad.</p>
                    <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
                    <hr style="margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">
                        Este es un email automático, por favor no respondas a este mensaje.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return [true, null];
        
    } catch (error) {
        console.error('Error al enviar email:', error);
        return [false, error.message];
    }
}