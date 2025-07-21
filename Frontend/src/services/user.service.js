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
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await axios.post('/user/direccion', direccionData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            return {
                status: 'Success',
                data: response.data.data,
                message: response.data.message
            };
        }
    } catch (error) {
        console.error('Error registering address:', error);
        return {
            status: 'Error',
            message: error.response?.data?.message || error.message || 'Error al registrar la dirección'
        };
    }
}

export async function getUserDirecciones() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await axios.get('/user/direcciones', {
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
        console.error('Error al obtener direcciones:', error);
        return {
            status: 'Error',
            message: error.response?.data?.message || error.message || 'Error al obtener las direcciones'
        };
    }
}

export async function deleteDireccion(direccionId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await axios.delete(`/user/direccion/${direccionId}`, {
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
        console.error('Error al eliminar dirección:', error);
        return {
            status: 'Error',
            message: error.response?.data?.message || error.message || 'Error al eliminar la dirección'
        };
    }
}

export async function getUserProfileDetailed() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await axios.get('/user/profile/detailed', {
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
        console.error('Error al obtener perfil detallado:', error);
        return {
            status: 'Error',
            message: error.response?.data?.message || error.message || 'Error al obtener perfil'
        };
    }
}

export async function updateUserProfile(userData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await axios.put('/user/profile', userData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
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
        console.error('Error al actualizar perfil:', error);
        return {
            status: 'Error',
            message: error.response?.data?.message || error.message || 'Error al actualizar perfil'
        };
    }
}

export async function getProductosCompradosConValoracion() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        const response = await axios.get('/user/productos-comprados', {
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
        console.error('Error al obtener productos comprados:', error);
        return {
            status: 'Error',
            message: error.response?.data?.message || error.message || 'Error al obtener productos comprados'
        };
    }
}