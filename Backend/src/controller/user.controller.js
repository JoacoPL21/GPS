import { getAllUsersService,registerDireccionService } from '../services/user.service.js';
import { handleSuccess, handleErrorServer } from '../handlers/responseHandlers.js';
import { direccionValidation } from '../validations/auth.validation.js';
export async function getAllUsers(req, res) {
    try {
        const [users, error] = await getAllUsersService();
        if (error) {
            return res.status(500).json({ message: 'Error al obtener los usuarios', error });
        }
        users.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Usuarios obtenidos correctamente", users);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function getUserById(req, res) {
    const userId = req.params.id;
    try {
        const [user, error] = await getAllUsersService(userId);
        if (error) {
            return res.status(500).json({ message: 'Error al obtener el usuario', error });
        }
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        handleSuccess(res, 200, "Usuario obtenido correctamente", user);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function registerDireccion(req, res) {
    try {
        const { body } = req;
        console.log('Datos de dirección recibidos:', body);
        const { error } = direccionValidation.validate(body);
        console.log('Error de validación:', error);
        if (error) {
            return res.status(400).json({ message: 'Error de validación', error: error.message });
        }
        const savedDireccion = await registerDireccionService(body);
        handleSuccess(res, 201, "Dirección registrada correctamente", savedDireccion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}