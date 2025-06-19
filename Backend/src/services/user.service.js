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
        console.error('Error fetching users:', error);
        throw new Error('Error fetching users');
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
        console.error('Error saving address:', error);
        throw new Error('Error saving address');
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
            return [[], 'No addresses found for this user'];
        }
        return [direcciones, null];
    } catch (error) {
        console.error('Error fetching addresses:', error);
        throw new Error('Error fetching addresses');
    }
}