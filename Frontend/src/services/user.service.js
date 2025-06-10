import axios from './root.service.js';

export const getAllUsers = async () => {
    try {
        const response = await axios.get('/users/');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.message);
       
    }
}