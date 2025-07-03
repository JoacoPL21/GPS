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

export const registerDireccionService = async (direccionData) => {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        const {id_usuario,calle, numero, ciudad, region, codigo_postal, tipo_de_direccion} = direccionData;
        console.log(id_usuario)
        const newDireccion = direccionRepository.create({
            calle,
            numero,
            ciudad,
            region,
            codigo_postal,
            tipo_de_direccion,
            usuario: {
                id_usuario: id_usuario // Assuming id_usuario is the primary key in Usuario entity
            }
        });
        const savedDireccion = await direccionRepository.save(newDireccion);
        return savedDireccion;
    } catch (error) {
        console.error('Error guardando la direccion:', error);
        throw new Error('Error guardando la direccion');
    }
}

export const getDireccionByUserIdService = async (userId) => {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        const direcciones = await direccionRepository.find({
            //DONDE SU usuario.id_usuario = userId
            where:  { usuario: { id_usuario: userId } }, 
        });
        if (!direcciones || direcciones.length === 0) {
            return [[], 'No hay direcciones para este usuario'];
        }
        return [direcciones, null];
    } catch (error) {
        console.error('error recuperando las direcciones:', error);
        throw new Error('error recuperando las direcciones');
    }
}

export async function deleteDireccionByUserIdService(userId) {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        const direccionToDelete = await direccionRepository.findOne({
            where: { usuario: { id_usuario: userId } }
        });
        if (!direccionToDelete) {
            return [null, 'Address not found for this user'];
        }
        const deletedDireccion = await direccionRepository.remove(direccionToDelete);
        return [deletedDireccion, null];
    } catch (error) {
        console.error('Error deleting address:', error);
        throw new Error('error eliminando la dirección');
    }
}