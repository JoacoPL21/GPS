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
  id_categoria: Joi.number()
    .required()
    .messages({
      "any.required": "La categoría es obligatoria",
      "number.base": "La categoría debe ser un número",
    }),
}).unknown(false).messages({
  "object.unknown": "Los campos adicionales no están permitidos",
});
/*
export const productoUpdateValidation = Joi.object({
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
    .valid("disponible", "agotado")
    .required()
    .messages({
      "any.only": 'El estado debe ser uno de los siguientes valores: "disponible", "agotado"',
      "any.required": "El estado es obligatorio",
      "string.base": "El estado debe ser una cadena de texto",
    }),
    imagen: Joi.string()
    .uri()
    .required()
    .messages({
      "string.uri": "La imagen debe ser una URL válida",
      "any.required": "La imagen es obligatoria",
      "string.base": "La imagen debe ser una cadena de texto",
    }),
  })*/