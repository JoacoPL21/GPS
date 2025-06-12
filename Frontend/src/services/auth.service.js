import axios from './root.service.js';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { convertirMinusculas } from '../helpers/formatData.js';

export async function login(dataUser) {
    try {
        const response = await axios.post('/auth/login', {
            email: dataUser.email, 
            password: dataUser.password
        });
        const { status, data } = response;
        if (status === 200) {
            const { nombreCompleto, email,rol } = jwtDecode(data.data.token);
            const userData = { nombreCompleto, email,rol };

            sessionStorage.setItem('usuario', JSON.stringify(userData));
            // Guardar el token en localStorage
            localStorage.setItem('token', data.data.token);

            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            cookies.set('jwt-auth', data.data.token, {path:'/'});
            return response.data
        }
    } catch (error) {
        return error.response.data;
    }
}

export async function register(data) {
   console.log('Datos del usuario service frot:', data);
    try {
       
        const data_register = convertirMinusculas(data);
        console.log('Datos del usuario service front:', data_register);
        
        const { nombreCompleto, email, telefono, password } = data_register;
        const response = await axios.post('/auth/register', {
            nombreCompleto,
            email,
            telefono,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Error al registrar:', error);
        return error.response.data;
        
    }
}

export async function logout() {
    try {
        await axios.post('auth/logout');
        sessionStorage.removeItem('usuario');
        // Eliminar el token del localStorage
        localStorage.removeItem('token');
        // Eliminar el token de las cookies
        cookies.remove('jwt');
        cookies.remove('jwt-auth');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}