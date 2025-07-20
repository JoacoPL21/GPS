"use strict";
import Usuarios from '../entity/usuario.entity.js';
import {AppDataSource} from '../config/configDB.js';
import Direccion from '../entity/direccion.entity.js';

export const getAllUsersService = async () => {
    try {
        const userRepository = AppDataSource.getRepository(Usuarios);
        const users = await userRepository.find();
        if (!users || users.length === 0) {
            return [[], 'No users found'];
        }
        const userList = users.map(({password, ...user}) => user);
        return [userList,null];

    } catch (error) {
        console.error('Error recuperando usuarios', error);
        throw new Error('Error recuperando usuarios');
    }
}

// ✅ CORRECTO - registerDireccionService
export async function registerDireccionService(direccionData, userId) {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        console.log('Guardando dirección:', direccionData);
        
        // Agregar el ID del usuario a los datos de la dirección
        const direccionConUsuario = {
            ...direccionData,
            id_usuario: userId
        };
        
        // Crear y guardar la nueva dirección
        const newDireccion = direccionRepository.create(direccionConUsuario);
        const savedDireccion = await direccionRepository.save(newDireccion);
        
        return [savedDireccion, null];
    } catch (error) {
        console.error("Error al registrar dirección:", error);
        return [null, "Error interno del servidor"];
    }
}

// ✅ CORRECTO - getDireccionByUserIdService
export async function getDireccionByUserIdService(userId) {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        // Buscar TODAS las direcciones del usuario por FK
        const direcciones = await direccionRepository.find({
            where: { id_usuario: userId }
        });
        
        return [direcciones, null];
    } catch (error) {
        console.error("Error al obtener direcciones:", error);
        return [null, "Error interno del servidor"];
    }
}

// ✅ CORREGIDO - deleteDireccionByUserIdService
export async function deleteDireccionByUserIdService(direccionId, userId) {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        // Buscar la dirección que pertenezca al usuario
        const direccion = await direccionRepository.findOne({
            where: { 
                id_direccion: direccionId,
                id_usuario: userId  // ✅ Verificar que la dirección pertenece al usuario
            }
        });
        
        if (!direccion) {
            return [null, "Dirección no encontrada o no pertenece al usuario"];
        }
        
        // Eliminar la dirección directamente
        await direccionRepository.remove(direccion);
        
        return [direccion, null];
    } catch (error) {
        console.error("Error al eliminar dirección:", error);
        return [null, "Error interno del servidor"];
    }
}

// ✅ CORRECTO - getUserProfileService
export const getUserProfileService = async (userId) => {
    try {
        const userRepository = AppDataSource.getRepository(Usuarios);
        
        const user = await userRepository.findOne({
            where: { id_usuario: userId }
        });
        
        if (!user) {
            return [null, { message: 'Usuario no encontrado' }];
        }
        
        // Excluir la contraseña de la respuesta
        const { password, ...userProfile } = user;
        
        return [userProfile, null];
    } catch (error) {
        console.error('Error al obtener perfil del usuario:', error);
        return [null, { message: 'Error interno del servidor' }];
    }
};

// ✅ CORRECTO - updateUserProfileService
export const updateUserProfileService = async (userId, updateData) => {
    try {
        const userRepository = AppDataSource.getRepository(Usuarios);
        
        // Buscar el usuario por ID
        const user = await userRepository.findOne({
            where: { id_usuario: userId }
        });
        
        if (!user) {
            return [null, { message: 'Usuario no encontrado' }];
        }
        
        // Actualizar los campos del usuario
        Object.assign(user, updateData);
        
        // Guardar los cambios
        const updatedUser = await userRepository.save(user);
        
        // Excluir la contraseña de la respuesta
        const { password, ...userProfile } = updatedUser;
        
        return [userProfile, null];
    } catch (error) {
        console.error('Error al actualizar perfil del usuario:', error);
        return [null, { message: 'Error interno del servidor' }];
    }
};