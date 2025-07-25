// Frontend/src/services/passwordReset.service.js
import axios from "./root.service.js";

/**
 * Solicitar recuperación de contraseña
 */
export async function forgotPassword(email) {
  try {
    const response = await axios.post('/auth/forgot-password', { email });
    
    return {
      status: 'Success',
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error al solicitar recuperación de contraseña:', error);
    return {
      status: 'Error',
      message: error.response?.data?.message || 'Error al solicitar recuperación de contraseña'
    };
  }
}

/**
 * Restablecer contraseña con token
 */
export async function resetPassword(token, newPassword) {
  try {
    const response = await axios.post('/auth/reset-password', {
      token,
      newPassword
    });
    
    return {
      status: 'Success',
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    return {
      status: 'Error',
      message: error.response?.data?.message || 'Error al restablecer contraseña'
    };
  }
}