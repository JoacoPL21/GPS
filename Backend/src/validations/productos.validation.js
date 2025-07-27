"use strict";
import Joi from "joi";

export const productoCreateValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.min": "El nombre del producto debe tener al menos 3 caracteres",
      "any.required": "El nombre del producto es obligatorio",
      "string.max": "El nombre del producto no puede tener más de 50 caracteres",
      "string.empty": "El nombre del producto no puede estar vacío",
      "string.base": "El nombre del producto debe ser una cadena de texto",
    }),
  precio: Joi.number()
    .positive()
    .required()
    .messages({
      "number.positive": "El precio debe ser un número positivo",
      "any.required": "El precio es obligatorio",
      "number.base": "El precio debe ser un número",
    }),
  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.integer": "El stock debe ser un número entero",
      "number.min": "El stock no puede ser negativo",
      "any.required": "El stock es obligatorio",
      "number.base": "El stock debe ser un número",
    }),
  descripcion: Joi.string()
    .max(255)
    .optional()
    .messages({
      "string.max": "La descripción no puede tener más de 255 caracteres",
      "string.base": "La descripción debe ser una cadena de texto",
    }),
  estado: Joi.string()
    .valid("activo", "inactivo")
    .required()
    .messages({
      "any.only": 'El estado debe ser uno de los siguientes valores: "activo", "inactivo"',
      "any.required": "El estado es obligatorio",
      "string.base": "El estado debe ser una cadena de texto",
    }),

 image_url: Joi.string()
    .optional()
    .messages({
      "string.base": "La imagen debe ser una cadena de texto",
  }),
  id_categoria: Joi.number()
    .required()
    .messages({
      "any.required": "La categoría es obligatoria",
      "number.base": "La categoría debe ser un número",
    }),
  peso: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.positive": "El peso debe ser un número positivo",
      "number.base": "El peso debe ser un número",
      "number.precision": "El peso debe tener máximo 2 decimales",
    }),
  ancho: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.positive": "El ancho debe ser un número positivo",
      "number.base": "El ancho debe ser un número",
      "number.precision": "El ancho debe tener máximo 2 decimales",
    }),
  alto: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.positive": "El alto debe ser un número positivo",
      "number.base": "El alto debe ser un número",
      "number.precision": "El alto debe tener máximo 2 decimales",
    }),
  profundidad: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.positive": "La profundidad debe ser un número positivo",
      "number.base": "La profundidad debe ser un número",
      "number.precision": "La profundidad debe tener máximo 2 decimales",
    }),
}).unknown(false).messages({
  "object.unknown": "Los campos adicionales no están permitidos",
});

// Validación para actualización de productos
export const productoUpdateValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(50)
    .optional() // Cambiado a opcional para actualizaciones parciales
    .messages({
      "string.min": "El nombre del producto debe tener al menos 3 caracteres",
      "string.max": "El nombre del producto no puede tener más de 50 caracteres",
      "string.empty": "El nombre del producto no puede estar vacío",
      "string.base": "El nombre del producto debe ser una cadena de texto",
    }),
  precio: Joi.number()
    .positive()
    .optional() // Cambiado a opcional
    .messages({
      "number.positive": "El precio debe ser un número positivo",
      "number.base": "El precio debe ser un número",
    }),
  stock: Joi.number()
    .integer()
    .min(0)
    .optional() // Cambiado a opcional
    .messages({
      "number.integer": "El stock debe ser un número entero",
      "number.min": "El stock no puede ser negativo",
      "number.base": "El stock debe ser un número",
    }),
  descripcion: Joi.string()
    .max(255)
    .optional()
    .messages({
      "string.max": "La descripción no puede tener más de 255 caracteres",
      "string.base": "La descripción debe ser una cadena de texto",
    }),
  estado: Joi.string()
    .valid("activo", "inactivo") // Corregido para usar los valores correctos
    .optional() // Cambiado a opcional
    .messages({
      "any.only": 'El estado debe ser uno de los siguientes valores: "activo", "inactivo"',
      "string.base": "El estado debe ser una cadena de texto",
    }),
  image_url: Joi.string()
    .optional()
    .messages({
      "string.base": "La imagen debe ser una cadena de texto",
    }),
  id_categoria: Joi.number()
    .optional() // Cambiado a opcional
    .messages({
      "number.base": "La categoría debe ser un número",
    }),
  peso: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.positive": "El peso debe ser un número positivo",
      "number.base": "El peso debe ser un número",
      "number.precision": "El peso debe tener máximo 2 decimales",
    }),
  ancho: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.positive": "El ancho debe ser un número positivo",
      "number.base": "El ancho debe ser un número",
      "number.precision": "El ancho debe tener máximo 2 decimales",
    }),
  alto: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.positive": "El alto debe ser un número positivo",
      "number.base": "El alto debe ser un número",
      "number.precision": "El alto debe tener máximo 2 decimales",
    }),
  profundidad: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.positive": "La profundidad debe ser un número positivo",
      "number.base": "La profundidad debe ser un número",
      "number.precision": "La profundidad debe tener máximo 2 decimales",
    }),
}).unknown(false).messages({
  "object.unknown": "Los campos adicionales no están permitidos",
});