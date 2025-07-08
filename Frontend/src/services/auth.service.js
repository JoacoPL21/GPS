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
            console.log('Datos del usuario service front:', data);
            
            // Extraer token y información del usuario de la respuesta del backend
            const token = data.data.token;
            const userInfo = data.data.user; // Información completa del usuario desde el backend
            
            // Verificar que el token es válido decodificándolo
            const tokenPayload = jwtDecode(token);
            console.log('Token payload:', tokenPayload);
            
            // Usar la información completa del usuario que viene del backend
            // No extraer datos del token, ya que el token solo tiene información mínima
            const userData = {
                id: userInfo.id,
                nombreCompleto: userInfo.nombreCompleto,
                email: userInfo.email,
                rol: userInfo.rol,
                telefono: userInfo.telefono || ''
            };

            // Guardar en storage
            sessionStorage.setItem('usuario', JSON.stringify(userData));
            localStorage.setItem('usuario', JSON.stringify(userData));
            localStorage.setItem('token', token);
            
            // Inicializar carrito vacío si no existe
            if (!localStorage.getItem('cart')) {
                localStorage.setItem('cart', JSON.stringify([]));
            }

            // Configurar header de autorización para futuras peticiones
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            cookies.set('jwt-auth', token, {path:'/'});
            
            return {
                status: 'Success',
                data: userData,
                message: 'Inicio de sesión exitoso'
            };
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

// Función para verificar si el token es válido y no ha expirado
export function isTokenValid() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;

        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Verificar si el token ha expirado
        if (decoded.exp < currentTime) {
            // Token expirado, limpiar storage
            logout();
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error al verificar token:', error);
        logout();
        return false;
    }
}

// Función para obtener la información del usuario desde localStorage
export function getCurrentUser() {
    try {
        const userString = localStorage.getItem('usuario');
        return userString ? JSON.parse(userString) : null;
    } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        return null;
    }
}

// Función para inicializar el token en axios al cargar la aplicación
export function initializeAuth() {
    const token = localStorage.getItem('token');
    if (token && isTokenValid()) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
    }
    return false;
}

export async function getUserProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await axios.get('/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const userProfile = response.data.data;
            
            // Actualizar la información del usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify(userProfile));
            sessionStorage.setItem('usuario', JSON.stringify(userProfile));
            
            return {
                status: 'Success',
                data: userProfile,
                message: 'Perfil obtenido correctamente'
            };
        }
    } catch (error) {
        console.error('Error al obtener perfil del usuario:', error);
        return {
            status: 'Error',
            message: error.response?.data?.message || 'Error al obtener el perfil'
        };
    }
}

export async function logout() {
    try {
        await axios.post('auth/logout');
        sessionStorage.removeItem('usuario');
        // Eliminar el token del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('cart'); // Limpiar el carrito del localStorage
        // Eliminar el token de las cookies
        cookies.remove('jwt');
        cookies.remove('jwt-auth');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}