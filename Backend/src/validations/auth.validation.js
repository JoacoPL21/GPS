"use strict";
import Joi from "joi";
export const authValidation = Joi.object({
  email: Joi.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .email()
    .required()
    .messages({
      "string.email": "El correo electrónico debe ser válido",
      "any.required": "El correo electrónico es obligatorio",
      "string.pattern.base": "El formato del correo electrónico es incorrecto",
      "string.empty": "El correo electrónico no puede estar vacío",
      "string.base": "El correo electrónico debe ser una cadena de texto",
    }),
  password: Joi.string()
    .min(6)
    .max(20)
    .pattern(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\-]+$/)
    .required()
    .messages({
      "string.min": "La contraseña debe tener al menos 6 caracteres",
      "any.required": "La contraseña es obligatoria",
        "string.max": "La contraseña no puede tener más de 20 caracteres",
        "string.pattern.base": "La contraseña solo puede contener letras, números y caracteres especiales",
        "string.empty": "La contraseña no puede estar vacía",
        "string.base": "La contraseña debe ser una cadena de texto",
    }),
}).unknown(false).messages({
    "object.unknown": "Los campos adicionales no están permitidos",
    "any.required": "Todos los campos son obligatorios",

});


export const registerValidation = Joi.object({
  nombreCompleto: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.min": "El nombre completo debe tener al menos 3 caracteres",
      "any.required": "El nombre completo es obligatorio",
      "string.max": "El nombre completo no puede tener más de 50 caracteres",
      "string.empty": "El nombre completo no puede estar vacío",
      "string.base": "El nombre completo debe ser una cadena de texto",
    }),
  telefono: Joi.string()
    .pattern(/^\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "El teléfono debe tener exactamente 9 dígitos",
      "any.required": "El teléfono es obligatorio",
      "string.empty": "El teléfono no puede estar vacío",
      "string.base": "El teléfono debe ser una cadena de texto",
    }),
  email: authValidation.extract("email"),
  password: authValidation.extract("password"),
}).unknown(false).messages({
    "object.unknown": "Los campos adicionales no están permitidos",
    "any.required": "Todos los campos son obligatorios",

});