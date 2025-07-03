import axios from './root.service.js';

export const getAllUsers = async () => {
    try {
        const response = await axios.get('/users/');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.message);
       
    }
}

export const registerDireccion = async (direccionData) => {
    console.log('Datos de dirección en el servicio:', direccionData);
    try {
        const response = await axios.post('/users/direccion', direccionData);
        return response.data;
    } catch (error) {
        console.error('Error registering address:', error.message);
    }
}

export const getDireccionesByUserId = async (userId) => {
    try {
        const response = await axios.get(`/users/direccion/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user addresses:', error.message);
    }
}

export const deleteDireccionByUserId = async (userId) => {
    try {
        const response = await axios.delete(`/users/direccion/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user address:', error.message);
    }
}