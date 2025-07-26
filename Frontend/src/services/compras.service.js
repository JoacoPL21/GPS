import axios from './root.service.js';

export async function getAllComprasAdmin() {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación');
    const response = await axios.get('/users/compras', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      return {
        status: 'Success',
        data: response.data.data,
        message: response.data.message
      };
    }
  } catch (error) {
    return {
      status: 'Error',
      message: error.response?.data?.message || error.message || 'Error al obtener compras'
    };
  }
} 