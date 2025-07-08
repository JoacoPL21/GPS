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

export async function registerDireccionService(direccionData) {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        console.log('Guardando dirección:', direccionData);
        
        const newDireccion = direccionRepository.create(direccionData);
        const savedDireccion = await direccionRepository.save(newDireccion);
        
        return [savedDireccion, null];
    } catch (error) {
        console.error("Error al registrar dirección:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getDireccionByUserIdService(userId) {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        const direcciones = await direccionRepository.find({
            where: { id_usuario: userId }
        });
        
        return [direcciones, null];
    } catch (error) {
        console.error("Error al obtener direcciones:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteDireccionByUserIdService(direccionId, userId) {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        // Buscar la dirección que pertenezca al usuario
        const direccion = await direccionRepository.findOne({
            where: { 
                id: direccionId,
                id_usuario: userId 
            }
        });
        
        if (!direccion) {
            return [null, "Dirección no encontrada o no pertenece al usuario"];
        }
        
        await direccionRepository.remove(direccion);
        return [direccion, null];
    } catch (error) {
        console.error("Error al eliminar dirección:", error);
        return [null, "Error interno del servidor"];
    }
}

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