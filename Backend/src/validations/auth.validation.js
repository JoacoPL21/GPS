"use strict";
import Joi from "joi";
export const authValidation = Joi.object({
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
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
    .pattern(/^9[0-9]{8}$/)
    .length(9)
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


export const direccionValidation = Joi.object({
  calle: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.min": "La calle debe tener al menos 3 caracteres",
      "any.required": "La calle es obligatoria",
      "string.max": "La calle no puede tener más de 100 caracteres",
      "string.empty": "La calle no puede estar vacía",
      "string.base": "La calle debe ser una cadena de texto",
    }),
  numero: Joi.string()
    .min(1)
    .max(10)
    .required()
    .messages({
      "string.min": "El número debe tener al menos 1 carácter",
      "any.required": "El número es obligatorio",
      "string.max": "El número no puede tener más de 10 caracteres",
      "string.empty": "El número no puede estar vacío",
      "string.base": "El número debe ser una cadena de texto",
    }),
  ciudad: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min": "La ciudad debe tener al menos 2 caracteres",
      "any.required": "La ciudad es obligatoria",
      "string.max": "La ciudad no puede tener más de 50 caracteres",
      "string.empty": "La ciudad no puede estar vacía",
      "string.base": "La ciudad debe ser una cadena de texto",
    }),
  region: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min": "La región debe tener al menos 2 caracteres",
      "any.required": "La región es obligatoria",
      "string.max": "La región no puede tener más de 50 caracteres",
      "string.empty": "La región no puede estar vacía",
      "string.base": "La región debe ser una cadena de texto",
    }),
  codigo_postal: Joi.string()
  
    .pattern(/^\d{7}$/)
    .required()
    .messages({
      "string.pattern.base": "El código postal debe tener el formato XXX0000",
      "any.required": "El código postal es obligatorio",
      "string.empty": "El código postal no puede estar vacío",
      "string.base": "El código postal debe ser una cadena de texto",

    }),
  tipo_de_direccion: Joi.string()
    .valid("predeterminada", "opcional")
    .required()
    .messages({
      "any.only": "El tipo de dirección debe ser 'predeterminado' u 'opcional'",
      "any.required": "El tipo de dirección es obligatorio",
      "string.empty": "El tipo de dirección no puede estar vacío",
      "string.base": "El tipo de dirección debe ser una cadena de texto",
    }),
}).unknown(false).messages({
    "object.unknown": "Los campos adicionales no están permitidos",
    "any.required": "Todos los campos son obligatorios",
});