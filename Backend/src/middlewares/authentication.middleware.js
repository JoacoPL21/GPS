"use strict";
import passport from "passport";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/configENV.js";
import { AppDataSource } from "../config/configDB.js";
import Usuario from "../entity/usuario.entity.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

export function authenticateJwt(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return handleErrorServer(
        res,
        500,
        "Error de autenticación en el servidor"
      );
    }

    if (!user) {
      return handleErrorClient(
        res,
        401,
        "No tienes permiso para acceder a este recurso",
        { info: info ? info.message : "No se encontró el usuario" }
      )
    }

    req.user = user;
    next();
  })(req, res, next);
}

// Nueva función usando JWT directamente
export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return handleErrorClient(
        res,
        401,
        "Token de acceso requerido",
        { info: "No se proporcionó token de autenticación" }
      );
    }

    // Verificar el token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    
    // Obtener el usuario completo de la base de datos
    const userRepository = AppDataSource.getRepository(Usuario);
    const user = await userRepository.findOne({
      where: { id_usuario: decoded.id }
    });

    if (!user) {
      return handleErrorClient(
        res,
        401,
        "Usuario no encontrado",
        { info: "El usuario asociado al token no existe" }
      );
    }

    // Agregar el usuario al request con la estructura esperada
    req.user = {
      id: user.id_usuario,
      email: user.email,
      rol: user.rol,
      nombreCompleto: user.nombreCompleto,
      telefono: user.telefono
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return handleErrorClient(
        res,
        401,
        "Token inválido",
        { info: "El token proporcionado no es válido" }
      );
    } else if (error.name === 'TokenExpiredError') {
      return handleErrorClient(
        res,
        401,
        "Token expirado",
        { info: "El token ha expirado, por favor inicia sesión nuevamente" }
      );
    } else {
      return handleErrorServer(
        res,
        500,
        "Error de autenticación en el servidor"
      );
    }
  }
}