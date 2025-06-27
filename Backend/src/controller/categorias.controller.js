import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categorias.service.js"

// Obtener todas las categorías
export const getCategoriasController = async (req, res) => {
  try {
    const categorias = await getCategorias()
    res.status(200).json({
      success: true,
      data: categorias,
      message: "Categorías obtenidas exitosamente",
    })
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Obtener categoría por ID
export const getCategoriaByIdController = async (req, res) => {
  try {
    const { id } = req.params
    const categoria = await getCategoriaById(id)

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      })
    }

    res.status(200).json({
      success: true,
      data: categoria,
      message: "Categoría obtenida exitosamente",
    })
  } catch (error) {
    console.error("Error al obtener categoría:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Crear nueva categoría
export const createCategoriaController = async (req, res) => {
  try {
    const { nombre } = req.body

    // Validaciones básicas
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es obligatorio",
      })
    }

    const nuevaCategoria = await createCategoria({
      nombre: nombre.trim()
    })
    console.log("Nueva categoría creada:", nuevaCategoria) // Para debug

    res.status(201).json({
      success: true,
      data: nuevaCategoria,
      message: "Categoría creada exitosamente",
    })
  } catch (error) {
    console.error("Error al crear categoría:", error)

    // Manejar error de duplicado
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Ya existe una categoría con ese nombre",
      })
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Actualizar categoría
export const updateCategoriaController = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, estado } = req.body

    // Validaciones básicas
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es obligatorio",
      })
    }

    const categoriaActualizada = await updateCategoria(id, {
      nombre: nombre.trim(),
    })

    if (!categoriaActualizada) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      })
    }

    res.status(200).json({
      success: true,
      data: categoriaActualizada,
      message: "Categoría actualizada exitosamente",
    })
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Eliminar categoría
export const deleteCategoriaController = async (req, res) => {
  try {
    const { id } = req.params

    const resultado = await deleteCategoria(id)

    if (!resultado) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      })
    }

    res.status(200).json({
      success: true,
      message: "Categoría eliminada exitosamente",
    })
  } catch (error) {
    console.error("Error al eliminar categoría:", error)

    // Manejar error de restricción de clave foránea
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message: "No se puede eliminar la categoría porque tiene productos asociados",
      })
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}
