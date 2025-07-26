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
        
        console.log('🏠 Validando límite de direcciones para usuario:', userId);
        
        // 1. Verificar cuántas direcciones tiene el usuario
        const direccionesExistentes = await direccionRepository.count({
            where: { id_usuario: userId }
        });
        
        console.log(`📊 Direcciones existentes: ${direccionesExistentes}/3`);
        
        // 2. Validar límite de 3 direcciones
        if (direccionesExistentes >= 3) {
            return [null, "No puedes tener más de 3 direcciones registradas. Elimina una dirección existente antes de agregar una nueva."];
        }
        
        console.log('✅ Límite válido, guardando dirección:', direccionData);
        
        // 3. Agregar el ID del usuario a los datos de la dirección
        const direccionConUsuario = {
            ...direccionData,
            id_usuario: userId
        };
        
        // 4. Crear y guardar la nueva dirección
        const newDireccion = direccionRepository.create(direccionConUsuario);
        const savedDireccion = await direccionRepository.save(newDireccion);
        
        console.log('🎉 Dirección guardada exitosamente:', savedDireccion.id_direccion);
        
        return [savedDireccion, null];
    } catch (error) {
        console.error('❌ Error al registrar dirección:', error);
        return [null, "Error interno del servidor"];
    }
}


export async function getDireccionByUserIdService(userId) {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        console.log("🔍 Buscando direcciones para usuario:", userId);
        
        // Buscar direcciones del usuario (máximo 3 por validación)
        const direcciones = await direccionRepository.find({
            where: { id_usuario: userId }
        });
        
        console.log(`📍 Direcciones encontradas: ${direcciones.length}/3`);
        
        if (direcciones.length === 0) {
            return [[], null];
        }
        
        // Formatear direcciones con nombres reales de ChileXpress
        console.log("🔄 Iniciando formateo de direcciones...");
        const direccionesFormateadas = await formatDireccionesWithNames(direcciones);
        
        console.log("✅ Direcciones formateadas y listas para enviar");
        
        return [direccionesFormateadas, null];
    } catch (error) {
        console.error("❌ Error al obtener direcciones:", error);
        return [null, "Error interno del servidor"];
    }
}


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

/**
 * 🌍 Obtiene el nombre de una región desde ChileXpress
 * @param {string} regionCode - Código de región (ej: R8)
 * @returns {string} Nombre de la región o el código original si falla
 */
async function getRegionName(regionCode) {
    try {
        const CHILEXPRESS_KEY = process.env.CHILEXPRESS_API_KEY;
        const baseUrl = 'https://testservices.wschilexpress.com';
        const url = `${baseUrl}/georeference/api/v1.0/regions`;
        
        console.log(`🌍 Consultando región: ${regionCode}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Ocp-Apim-Subscription-Key": CHILEXPRESS_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });

        if (!response.ok) {
            console.error(`❌ Error HTTP ${response.status} obteniendo regiones`);
            return regionCode;
        }

        const data = await response.json();
        
        if (data.statusCode !== 0 || !data.regions) {
            console.error("❌ Respuesta inválida de ChileXpress para regiones");
            return regionCode;
        }

        // Buscar la región por código
        const region = data.regions.find(r => r.regionId === regionCode);
        const regionName = region ? region.regionName : regionCode;
        
        console.log(`✅ ${regionCode} → ${regionName}`);
        return regionName;
        
    } catch (error) {
        console.error(`❌ Error consultando región ${regionCode}:`, error);
        return regionCode; // Fallback al código original
    }
}

async function getCommuneName(regionCode, communeCode) {
    try {
        const CHILEXPRESS_KEY = process.env.CHILEXPRESS_API_KEY;
        const baseUrl = 'https://testservices.wschilexpress.com';
        const url = `${baseUrl}/georeference/api/v1.0/coverage-areas?RegionCode=${regionCode}&type=0`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Ocp-Apim-Subscription-Key": CHILEXPRESS_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });

        if (!response.ok) {
            console.error(`❌ Error HTTP ${response.status} obteniendo comunas`);
            return communeCode;
        }

        const data = await response.json();
        
        if (data.statusCode !== 0 || !data.coverageAreas) {
            console.error("❌ Respuesta inválida de ChileXpress para comunas");
            return communeCode;
        }

        
        const commune = data.coverageAreas.find(c => {
            // Comparar como strings y como números
            return c.ineCountyCode === communeCode || 
                   c.ineCountyCode === parseInt(communeCode) ||
                   c.ineCountyCode?.toString() === communeCode.toString();
        });
        
        if (!commune) {
            console.log(`❌ No se encontró comuna con ineCountyCode: ${communeCode}`);
            
            return communeCode;
        }
        
     
        const communeName = commune.countyName;
        return communeName;
        
    } catch (error) {
        console.error(`❌ Error consultando comuna ${communeCode}:`, error);
        return communeCode;
    }
}


async function formatDireccionesWithNames(direcciones) {
    if (!direcciones || direcciones.length === 0) {
        return [];
    }
    
   
    
    try {
        // Formatear cada dirección secuencialmente
        const direccionesFormateadas = await Promise.all(
            direcciones.map(async (direccion) => {
            
                
                // Solo formatear si tenemos códigos (no nombres ya formateados)
                const shouldFormatRegion = direccion.region && direccion.region.length <= 3;
                const shouldFormatCommune = direccion.comuna && !isNaN(direccion.comuna);
                
                let regionName = direccion.region;
                let communeName = direccion.comuna;
                
                // Obtener nombre de región si es necesario
                if (shouldFormatRegion) {
                    regionName = await getRegionName(direccion.region);
                }
                
                // Obtener nombre de comuna si es necesario
                if (shouldFormatCommune && shouldFormatRegion) {
                    communeName = await getCommuneName(direccion.region, direccion.comuna);
                }
                
                return {
                    ...direccion,
                    region: regionName,
                    comuna: communeName,
                    // Mantener códigos originales para referencia
                    region_code: direccion.region,
                    comuna_code: direccion.comuna
                };
            })
        );
        
    
        return direccionesFormateadas;
        
    } catch (error) {
        console.error('❌ Error formateando direcciones:', error);
        // Fallback: retornar direcciones originales
        return direcciones;
    }
}