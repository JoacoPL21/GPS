"use strict";
import Usuario from "../entity/usuario.entity.js";
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


    // Payload mínimo para el JWT - solo información esencial
    const payload = {
      id: userFound.id_usuario,
      email: userFound.email,
      rol: userFound.rol,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1h", // Aumentado a 1 hora para mejor UX
    });

    // Información completa del usuario para el frontend (sin contraseña)
    const userInfo = {
      id: userFound.id_usuario,
      nombreCompleto: userFound.nombreCompleto,
      email: userFound.email,
      rol: userFound.rol,
      telefono: userFound.telefono || "",

    };

    return [accessToken, null, userInfo];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(Usuario);


    const { nombreCompleto, telefono, email } = user;

    if ((rol === "cliente" || rol === "admin") && (!password || password.trim() === "")) {
      return [null, { dataInfo: "password", message: "La contraseña es obligatoria" }];
    }

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

    if (!nombreCompleto || !email || !user.password) {
      return [null, createErrorMessage("fields", "Todos los campos son obligatorios")
      ];
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