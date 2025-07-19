import { getAllUsersService,registerDireccionService,getDireccionByUserIdService,deleteDireccionByUserIdService, getUserProfileService, updateUserProfileService } from '../services/user.service.js';
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
export const getUserProfile = (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const { password, ...userProfile } = user; // Exclude password from the response
    handleSuccess(res, 200, "Perfil de usuario obtenido correctamente", userProfile);
};


export async function registerDireccion(req, res) {
    try {
        const { body } = req;
        // Obtener el ID del usuario desde el token JWT (middleware de autenticación)
        const userId = req.user.id;
        
        console.log('Datos de dirección recibidos:', body);
        console.log('ID de usuario desde token:', userId);
        
        // Validar solo los campos de la dirección (no el id_usuario)
        const { error } = direccionValidation.validate(body);
        if (error) {
            return res.status(400).json({ 
                status: 'Error',
                message: 'Error de validación', 
                error: error.details[0].message 
            });
        }
        
        // Agregar el ID del usuario a los datos de la dirección
        const direccionData = {
            ...body,
            id_usuario: userId // Asegurarse de que el usuario loggeado sea el propietario
        };
        
        const [savedDireccion, errorService] = await registerDireccionService(direccionData);
        
        if (errorService) {
            return res.status(500).json({ 
                status: 'Error',
                message: errorService 
            });
        }
        
        handleSuccess(res, 201, "Dirección registrada correctamente", savedDireccion);
    } catch (error) {
        console.error('Error en registerDireccion:', error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function getDireccionByUserId(req, res) {
    try {
        // Usar el ID del usuario desde el token en lugar del parámetro
        const userId = req.user.id;
        console.log('ID de usuario desde token:', userId);
        
        const [direcciones, error] = await getDireccionByUserIdService(userId);
        if (error) {
            return res.status(500).json({ message: 'Error al obtener las direcciones', error });
        }
        if (direcciones.length === 0 || !direcciones) {
            return res.status(404).json({ message: 'No se encontraron direcciones para este usuario' });
        }
        handleSuccess(res, 200, "Direcciones obtenidas correctamente", direcciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteDireccionByUserId(req, res) {
    try {
        const direccionId = req.params.id; // ID de la dirección a eliminar
        const userId = req.user.id; // ID del usuario desde el token
        
        console.log('Eliminando dirección ID:', direccionId, 'para usuario:', userId);
        
        const [deletedDireccion, error] = await deleteDireccionByUserIdService(direccionId, userId);
        if (error) {
            return res.status(500).json({ message: 'Error al eliminar la dirección', error });
        }
        if (!deletedDireccion) {
            return res.status(404).json({ message: 'Dirección no encontrada o no pertenece al usuario' });
        }
        handleSuccess(res, 200, "Dirección eliminada correctamente", deletedDireccion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export const getUserProfileDetailed = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [userProfile, error] = await getUserProfileService(userId);
        if (error) {
            return res.status(404).json({ message: error.message });
        }
        
        handleSuccess(res, 200, "Perfil de usuario obtenido correctamente", userProfile);
    } catch (error) {
        console.error('Error al obtener perfil del usuario:', error);
        handleErrorServer(res, 500, error.message);
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;
        
        // Validar que no se intente actualizar campos sensibles
        const prohibitedFields = ['password', 'id_usuario', 'rol'];
        const hasProhibitedFields = prohibitedFields.some(field => field in updateData);
        
        if (hasProhibitedFields) {
            return res.status(400).json({ 
                message: 'No se pueden actualizar campos sensibles como contraseña, ID o rol' 
            });
        }
        
        // Validar que al menos haya un campo para actualizar
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ 
                message: 'Debe proporcionar al menos un campo para actualizar' 
            });
        }
        
        const [updatedProfile, error] = await updateUserProfileService(userId, updateData);
        if (error) {
            return res.status(404).json({ message: error.message });
        }
        
        handleSuccess(res, 200, "Perfil actualizado correctamente", updatedProfile);
    } catch (error) {
        console.error('Error al actualizar perfil del usuario:', error);
        handleErrorServer(res, 500, error.message);
    }
};


