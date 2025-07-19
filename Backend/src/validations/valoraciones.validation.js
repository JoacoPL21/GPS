"use strict";
import Joi from "joi";

// Validación para crear o actualizar valoraciones
export const valoracionCreateValidation = Joi.object({
  id_producto: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del producto debe ser un número",
    "number.integer": "El ID del producto debe ser un número entero",
    "number.positive": "El ID del producto debe ser positivo",
    "any.required": "El ID del producto es requerido"
  }),
  puntuacion: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "La puntuación debe ser un número",
    "number.integer": "La puntuación debe ser un número entero",
    "number.min": "La puntuación debe ser al menos 1",
    "number.max": "La puntuación debe ser máximo 5",
    "any.required": "La puntuación es requerida"
  }),
  descripcion: Joi.string().min(10).max(500).required().messages({
    "string.base": "La descripción debe ser un texto",
    "string.min": "La descripción debe tener al menos 10 caracteres",
    "string.max": "La descripción debe tener máximo 500 caracteres",
    "any.required": "La descripción es requerida"
  })
});

// Validación para actualizar valoraciones (incluye ID de valoración)
export const valoracionUpdateValidation = Joi.object({
  id_valoracion: Joi.number().integer().positive().required().messages({
    "number.base": "El ID de la valoración debe ser un número",
    "number.integer": "El ID de la valoración debe ser un número entero",
    "number.positive": "El ID de la valoración debe ser positivo",
    "any.required": "El ID de la valoración es requerido"
  }),
  puntuacion: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "La puntuación debe ser un número",
    "number.integer": "La puntuación debe ser un número entero",
    "number.min": "La puntuación debe ser al menos 1",
    "number.max": "La puntuación debe ser máximo 5",
    "any.required": "La puntuación es requerida"
  }),
  descripcion: Joi.string().min(10).max(500).required().messages({
    "string.base": "La descripción debe ser un texto",
    "string.min": "La descripción debe tener al menos 10 caracteres",
    "string.max": "La descripción debe tener máximo 500 caracteres",
    "any.required": "La descripción es requerida"
  })
}); 