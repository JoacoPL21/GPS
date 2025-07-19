import { getValoracionesPorProducto, createValoracion, updateValoracion, createOrUpdateValoracion } from "../services/valoraciones.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { valoracionCreateValidation } from "../validations/valoraciones.validation.js";

export async function getValoracionesPorProductoController(req, res) {
  const { id_producto } = req.params;
  try {
    const [valoraciones, error] = await getValoracionesPorProducto(id_producto);
    if (error) {
      return handleErrorClient(res, 400, error);
    }
    return handleSuccess(res, 200, "Valoraciones obtenidas exitosamente", valoraciones);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor al obtener valoraciones");
  }
}

export async function createValoracionController(req, res) {
  try {
    const valoracionData = req.body;
    
    // Obtener el ID del usuario desde el token JWT (middleware de autenticación)
    const userId = req.user.id;
    
    // Validación de los datos de la valoración
    const { error: validationError } = valoracionCreateValidation.validate(valoracionData);
    if (validationError) {
      return handleErrorClient(res, 400, "Datos inválidos", validationError.message);
    }

    // Agregar el ID del usuario a los datos de la valoración
    const datosValoracion = {
      ...valoracionData,
      id_usuario: userId
    };

    const [nuevaValoracion, error] = await createValoracion(datosValoracion);
    
    if (error) {
      return handleErrorClient(res, 400, error);
    }

    return handleSuccess(res, 201, "Valoración creada exitosamente", nuevaValoracion);
  } catch (error) {
    console.error("Error en createValoracionController:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al crear valoración");
  }
}

export async function updateValoracionController(req, res) {
  try {
    const valoracionData = req.body;
    
    // Obtener el ID del usuario desde el token JWT (middleware de autenticación)
    const userId = req.user.id;
    
    // Validación de los datos de la valoración
    const { error: validationError } = valoracionCreateValidation.validate(valoracionData);
    if (validationError) {
      return handleErrorClient(res, 400, "Datos inválidos", validationError.message);
    }

    // Agregar el ID del usuario a los datos de la valoración
    const datosValoracion = {
      ...valoracionData,
      id_usuario: userId
    };

    const [valoracionActualizada, error] = await updateValoracion(datosValoracion);
    
    if (error) {
      return handleErrorClient(res, 400, error);
    }

    return handleSuccess(res, 200, "Valoración actualizada exitosamente", valoracionActualizada);
  } catch (error) {
    console.error("Error en updateValoracionController:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al actualizar valoración");
  }
}

export async function createOrUpdateValoracionController(req, res) {
  try {
    const valoracionData = req.body;
    
    // Obtener el ID del usuario desde el token JWT (middleware de autenticación)
    const userId = req.user.id;
    
    // Validación de los datos de la valoración
    const { error: validationError } = valoracionCreateValidation.validate(valoracionData);
    if (validationError) {
      return handleErrorClient(res, 400, "Datos inválidos", validationError.message);
    }

    // Agregar el ID del usuario a los datos de la valoración
    const datosValoracion = {
      ...valoracionData,
      id_usuario: userId
    };

    const [valoracionResultado, error] = await createOrUpdateValoracion(datosValoracion);
    
    if (error) {
      return handleErrorClient(res, 400, error);
    }

    return handleSuccess(res, 200, "Valoración procesada exitosamente", valoracionResultado);
  } catch (error) {
    console.error("Error en createOrUpdateValoracionController:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al procesar valoración");
  }
} 