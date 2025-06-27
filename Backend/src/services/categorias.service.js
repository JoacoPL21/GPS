import Categorias from "../entity/categoria.entity.js"
import Productos from "../entity/productos.entity.js"
import { AppDataSource } from "../config/configDB.js"

// Obtener todas las categorías
export async function getCategorias() {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categorias)
    const categorias = await categoriaRepository.find({
      order: { nombre: "ASC" },
    })

    // Contar productos por categoría
    const categoriasData = await Promise.all(
      categorias.map(async (categoria) => {
        const productoRepository = AppDataSource.getRepository(Productos)
        const totalProductos = await productoRepository.count({
          where: { id_categoria: categoria.id_categoria },
        })

        return {
          id_categoria: categoria.id_categoria,
          nombre: categoria.nombre,
          created_at: categoria.created_at,
          updated_at: categoria.updated_at,
          total_productos: totalProductos,
        }
      }),
    )

    return [categoriasData]
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return [null, "Error al obtener categorías"]
  }
}

// Obtener categoría por ID
export async function getCategoriaById(id) {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categorias)
    const categoria = await categoriaRepository.findOne({
      where: { id_categoria: Number.parseInt(id) },
    })

    if (!categoria) {
      return { data: null, error: "Categoría no encontrada" }
    }

    // Contar productos de esta categoría
    const productoRepository = AppDataSource.getRepository(Productos)
    const totalProductos = await productoRepository.count({
      where: { id_categoria: categoria.id_categoria },
    })

    const categoriaData = {
      id_categoria: categoria.id_categoria,
      nombre: categoria.nombre,
      created_at: categoria.created_at,
      updated_at: categoria.updated_at,
      total_productos: totalProductos,
    }

    return { data: categoriaData, error: null }
  } catch (error) {
    console.error("Error al obtener categoría:", error)
    return { data: null, error: "Error al obtener categoría" }
  }
}

// Crear nueva categoría
export async function createCategoria(categoriaData) {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categorias)

    // Verificar si ya existe una categoría con ese nombre
    const categoriaExistente = await categoriaRepository.findOne({
      where: { nombre: categoriaData.nombre },
    })

    if (categoriaExistente) {
      return [null, "Ya existe una categoría con ese nombre"]
    }

    const nuevaCategoria = categoriaRepository.create({
      nombre: categoriaData.nombre,
    })

    await categoriaRepository.save(nuevaCategoria)
    return [nuevaCategoria]
  } catch (error) {
    console.error("Error al crear categoría:", error)
    return [null, "Error al crear categoría"]
  }
}

// Actualizar categoría
export async function updateCategoria(id, categoriaData) {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categorias)

    // Verificar si la categoría existe
    const categoriaExistente = await categoriaRepository.findOne({
      where: { id_categoria: Number.parseInt(id) },
    })

    if (!categoriaExistente) {
      return {
        success: false,
        message: "Categoría no encontrada",
        data: null,
      }
    }

    // Verificar si el nuevo nombre ya existe (si se está cambiando)
    if (categoriaData.nombre && categoriaData.nombre !== categoriaExistente.nombre) {
      const nombreExistente = await categoriaRepository.findOne({
        where: { nombre: categoriaData.nombre },
      })

      if (nombreExistente) {
        return {
          success: false,
          message: "Ya existe una categoría con ese nombre",
          data: null,
        }
      }
    }

    // Actualizar los datos
    const datosActualizados = {
      ...categoriaExistente,
      nombre: categoriaData.nombre || categoriaExistente.nombre,
      updated_at: new Date(),
    }

    // Guardar los cambios
    const categoriaActualizada = await categoriaRepository.save(datosActualizados)

    return {
      success: true,
      message: "Categoría actualizada exitosamente",
      data: categoriaActualizada,
    }
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    return {
      success: false,
      message: "Error al actualizar categoría",
      data: null,
    }
  }
}

// Eliminar categoría
export async function deleteCategoria(id) {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categorias)
    const productoRepository = AppDataSource.getRepository(Productos)

    // Verificar si la categoría existe
    const categoriaExistente = await categoriaRepository.findOne({
      where: { id_categoria: Number.parseInt(id) },
    })

    if (!categoriaExistente) {
      return {
        success: false,
        message: "Categoría no encontrada",
        data: null,
      }
    }

    // Verificar si tiene productos asociados
    const productosAsociados = await productoRepository.count({
      where: { id_categoria: Number.parseInt(id) },
    })

    if (productosAsociados > 0) {
      return {
        success: false,
        message: "No se puede eliminar la categoría porque tiene productos asociados",
        data: null,
      }
    }

    // Eliminar la categoría
    await categoriaRepository.remove(categoriaExistente)

    return {
      success: true,
      message: "Categoría eliminada exitosamente",
      data: { id_categoria: Number.parseInt(id) },
    }
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return {
      success: false,
      message: "Error al eliminar categoría",
      data: null,
    }
  }
}

// Buscar categoría por nombre
export async function getCategoriaByNombre(nombre) {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categorias)
    const categoria = await categoriaRepository.findOne({
      where: { nombre: nombre },
    })

    if (!categoria) {
      return { data: null, error: "Categoría no encontrada" }
    }

    return { data: categoria, error: null }
  } catch (error) {
    console.error("Error al buscar categoría por nombre:", error)
    return { data: null, error: "Error al buscar categoría" }
  }
}
