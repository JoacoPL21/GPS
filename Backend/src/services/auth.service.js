"use strict";
import Usuario from "../entity/usuario.entity.js";
import Direccion from "../entity/direccion.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDB.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configENV.js";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const { email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const userFound = await userRepository.findOne({
      where: { email }
    });

    if (!userFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
    }

    const isMatch = await comparePassword(password, userFound.password);

    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    //
    const payload = {
      nombreCompleto: userFound.nombreCompleto,
      email: userFound.email,
      rol: userFound.rol,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "0.5h", // 30 minutos
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const direccionRepository = AppDataSource.getRepository(Direccion);

    const { nombreCompleto, telefono, email,direccion } = user;
    

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const existingEmailUser = await userRepository.findOne({
      where: {
        email,
      },
    });
    
    if (existingEmailUser) return [null, createErrorMessage("email", "Correo electrónico en uso")];

    // crear una nueva dirección si se proporciona
    let newDireccion = null;
    if (direccion) {
      newDireccion = direccionRepository.create(
        {
          calle: direccion.calle,
          numero: direccion.numero,
          ciudad: direccion.ciudad,
          region: direccion.region,
          pais: direccion.pais,
          codigo_postal: direccion.codigo_postal,
          tipo_de_direccion: direccion.tipo_de_direccion
        }
      );
      await direccionRepository.save(newDireccion);
    }

    const newUser = userRepository.create({
      nombreCompleto,
      email,
      telefono,
      password: await encryptPassword(user.password),
      rol: "cliente",
    });

    await userRepository.save(newUser);
    //mostrar solo los datos del usuario sin la contraseña
    const { password, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}