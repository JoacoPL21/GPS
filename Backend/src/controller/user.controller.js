import { getAllUsersService } from '../services/user.service.js';
import { handleSuccess, handleErrorServer } from '../handlers/responseHandlers.js';
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