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
    console.log("token de axios:", axios.defaults.headers.common['Authorization']);
    try {
        const response = await axios.post('/users/direccion', direccionData);
        return response.data;
    } catch (error) {
        console.error('Error registering address:', error.message);
    }
}