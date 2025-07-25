"use client"

import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import ProductoModal from "../../components/ProductoModal"
import CategoriasModal from "../../components/CategoriasModal"
import PageHeader from "../../components/PageHeader"
import { handleApiError } from "../../services/productos.service.js"

// Componentes refactorizados
import EstadisticasProductos from "../../components/ProductsManager/EstadisticasProductos"
import BannersNotificacion from "../../components/ProductsManager/BannersNotificacion"
import BotonesAccion from "../../components/ProductsManager/BotonesAccion"
import BarraHerramientas from "../../components/ProductsManager/BarraHerramientas"
import InstruccionesModoSeleccion from "../../components/ProductsManager/InstruccionesModoSeleccion"
import VistaGrilla from "../../components/ProductsManager/VistaGrilla"
import VistaTabla from "../../components/ProductsManager/VistaTabla"
import EstadoVacio from "../../components/ProductsManager/EstadoVacio"

// Hooks refactorizados
import { useGestorProductos } from "../../hooks/productos/useGestorProductos"
import { useFiltrosProductos } from "../../hooks/productos/useProductsFilters"
import { useValidacionFormulario } from "../../hooks/productos/useValidacionFormulario"

function ProductosManager() {
  // Hooks principales
  const gestor = useGestorProductos();
  const { errores, validarFormulario, validarArchivo, limpiarError, limpiarErrores } = useValidacionFormulario();
  
  // Estado local adicional
  const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false);
  const [progresoSubida, setProgresoSubida] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    id_categoria: "",
    estado: "activo",
    imagen: null,
    imagen_url: "",
    peso: "",
    ancho: "",
    alto: "",
    profundidad: "",
  });

  // Datos combinados de productos y categorías
  const productos = gestor.mostrarEliminados ? gestor.productosEliminados : gestor.productosActivos;
  
  // Hook de filtros
  const {
    productosFiltradosYOrdenados,
    categorias: categoriasExtraidas,
    filtros,
    actualizarFiltro,
    limpiarFiltros
  } = useFiltrosProductos(productos);

  // Efectos
  useEffect(() => {
    gestor.cargarDatos();
  }, []);

  // Estado para categorías
  const [categoriasSet, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);

  // Cargar categorías para modales
  useEffect(() => {
    if (gestor.categorias?.length > 0) {
      setCategorias(gestor.categorias);
    }
  }, [gestor.categorias]);
    alternarModoSeleccion,
    manejarClickProducto,
    estaSeleccionado,
    setAdvertenciaSincronizacion,
    addProducto,
    editProducto,
    removeProducto,
    addCategoria,
    editCategoria,
    removeCategoria,
  } = gestor;

  // Hook de filtros
  const filtros = useFiltrosProductos(productosActuales);
  const {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    showFilters,
    setShowFilters,
    productosFiltradosYOrdenados,
    categorias: categoriasFiltros,
    clearFilters,
  } = filtros;

  // Hook de validación
  const validacion = useValidacionFormulario();
  const { errores, setErrores, validarFormulario, validarArchivo, limpiarError } = validacion;

  // Funciones de manejo de inputs
  const manejarCambioInput = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      // Manejar archivos de imagen
      const file = files[0];
      
      if (file) {
        if (validarArchivo(file, name)) {
          console.log("📁 Archivo seleccionado:", {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          });

          setFormulario((prev) => ({ 
            ...prev, 
            [name]: file,
            imagen_url: "" // Limpiar la imagen_url cuando se selecciona una nueva imagen
          }));
          console.log("✅ Archivo válido y guardado");
        }
      } else {
        // Si no hay archivo (se canceló la selección)
        setFormulario((prev) => ({ 
          ...prev, 
          [name]: null,
          // En modo edición, restaurar la imagen_url original si existe
          ...(gestor.editandoId && prev.imagen_url && { imagen_url: prev.imagen_url })
        }));
      }
    } else {
      // Manejar inputs normales
      setFormulario((prev) => ({ ...prev, [name]: value }));
    }
    
    limpiarError(name);
  };

  // Funciones de eliminación
  const manejarEliminar = async (id) => {
    if (modoSeleccion) return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const response = await removeProducto(id);
      
      if (response.success) {
        setProductosSeleccionados((prev) => prev.filter((selectedId) => selectedId !== id));
        await cargarProductos();
        Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
      } else {
        const errorMessage = handleApiError(response.error);
        
        if (errorMessage.includes("no encontrado") || errorMessage.includes("404")) {
          setAdvertenciaSincronizacion(true);
          await cargarProductos();
          Swal.fire("Producto no encontrado", "El producto ya fue eliminado o no existe. La lista ha sido actualizada.", "info");
        } else {
          Swal.fire("Error", errorMessage, "error");
        }
      }
    }
  };

  const manejarEliminarLote = async () => {
    if (productosSeleccionados.length === 0) return;

    const result = await Swal.fire({
      title: `¿Eliminar ${productosSeleccionados.length} productos?`,
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar todos",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      let successCount = 0;
      let errorCount = 0;
      let syncIssues = false;

      for (const id of productosSeleccionados) {
        const response = await removeProducto(id);
        if (response.success) {
          successCount++;
        } else {
          errorCount++;
          const errorMessage = handleApiError(response.error);
          if (errorMessage.includes("no encontrado") || errorMessage.includes("404")) {
            syncIssues = true;
          }
        }
      }

      setProductosSeleccionados([]);
      gestor.setModoSeleccion(false);
      await cargarProductos();

      if (syncIssues) {
        setAdvertenciaSincronizacion(true);
      }

      if (errorCount === 0) {
        Swal.fire("¡Eliminados!", `${successCount} productos han sido eliminados.`, "success");
      } else {
        Swal.fire("Parcialmente completado", `${successCount} productos eliminados, ${errorCount} errores.`, "warning");
      }
    }
  };

  // Funciones de selección
  const manejarSeleccionarTodos = () => {
    if (productosSeleccionados.length === productosFiltradosYOrdenados.length) {
      setProductosSeleccionados([]);
    } else {
      setProductosSeleccionados(productosFiltradosYOrdenados.map((p) => p.id_producto));
    }
  };

  const manejarClickFilaTabla = (producto) => {
    if (modoSeleccion) {
      manejarClickProducto(producto.id_producto);
    }
  };

  // Función de exportación
  const manejarExportar = () => {
    const csvContent = [
      ["ID", "Nombre", "Descripción", "Precio", "Stock", "Categoría", "Estado", "Peso (kg)", "Ancho (cm)", "Alto (cm)", "Profundidad (cm)"],
      ...gestor.productosActivos.map((p) => [
        p.id_producto, 
        p.nombre, 
        p.descripcion, 
        p.precio, 
        p.stock, 
        p.categoria, 
        p.estado,
        p.peso || '',
        p.ancho || '',
        p.alto || '',
        p.profundidad || ''
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "productos.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Función de refrescar
  const manejarRefrescar = () => {
    setAdvertenciaSincronizacion(false);
    if (mostrarEliminados) {
      cargarProductosEliminados();
    } else {
      cargarProductos();
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault()
  const validationErrors = validate()
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors)
    return
  }

  setSubmitting(true)

  try {
    let response
    const progressCallback = (progress) => {
      setUploadProgress(progress);
    };
    
    if (editingId) {
        // Primero actualizar el producto y esperar a que termine COMPLETAMENTE
        response = await editProducto(editingId, form, progressCallback)
        if (response.success) {
          // Solo después de que la actualización termine, recargar productos
          await fetchProductos()
          
          // Mostrar mensaje de éxito primero
          Swal.fire("¡Actualizado!", "El producto ha sido actualizado.", "success")
          
          // Cerrar modal con delay para evitar errores de renderizado
          setTimeout(() => {
            setModalOpen(false)
            setEditingId(null)
            setUploadProgress(0)
            
            // Resetear formulario después de cerrar el modal
            setForm({
              nombre: "",
              descripcion: "",
              precio: "",
              stock: "",
              id_categoria: "",
              estado: "activo",
              imagen: null,
              imagen_url: "",
              peso: "",
              ancho: "",
              alto: "",
              profundidad: "",
            })
          }, 100)
        }
    } else {
        // Primero crear el producto y esperar a que termine COMPLETAMENTE
        response = await addProducto(form, progressCallback)
    if (response.success) {
          // Solo después de que la creación termine, recargar productos
      await fetchProductos()
          
          // Mostrar mensaje de éxito primero
          Swal.fire("¡Agregado!", "El producto ha sido agregado.", "success")
          
          // Cerrar modal con delay para evitar errores de renderizado
          setTimeout(() => {
            setModalOpen(false)
            setEditingId(null)
            setUploadProgress(0)
            
            // Resetear formulario después de cerrar el modal
            setForm({
              nombre: "",
              descripcion: "",
              precio: "",
              stock: "",
              id_categoria: "",
              estado: "activo",
              imagen: null,
              imagen_url: "",
              peso: "",
              ancho: "",
              alto: "",
              profundidad: "",
            })
          }, 100)
        }
      }

      if (!response.success) {
      Swal.fire("Error", response.error || "No se pudo procesar la solicitud", "error")
    }
  } catch (error) {
    Swal.fire("Error", "Ha ocurrido un error inesperado", "error")
  } finally {
    setSubmitting(false)
    setUploadProgress(0)
  }
}

  const categoriasManagement = {
    add: addCategoria,
    edit: editCategoria,
    delete: removeCategoria,
  }

  // Mostrar loading
  if (productosLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#fff8f0]">
        {/* Spinner con animación y sombra */}
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-transparent border-orange-500 shadow-lg"></div>
          {/* Ícono dentro del spinner (puedes cambiar el SVG por uno que te guste) */}
          <svg
            className="absolute h-12 w-12 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        {/* Texto con animación de opacidad pulsante */}
        <p className="mt-6 text-xl font-semibold text-orange-600 animate-pulse">
          Cargando productos...
        </p>
      </div>
    )
  }

  // Mostrar error
  if (productosError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar productos</h2>
          <p className="text-gray-600 mb-4">{productosError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header del Catálogo */}
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", to: "/" },
          { label: showDeleted ? "Productos eliminados" : "Administración de productos" }
        ]}
        title={showDeleted ? "Productos eliminados" : "Administración de productos"}
        subtitle={showDeleted ? "Productos que han sido eliminados del inventario" : "Gestiona tu inventario de productos"}
      />
      <div className="mt-4 lg:mt-0 flex items-center space-x-4 bg-[#fff8f0]">

      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 bg-[#fff8f0]">
        {/* Banners de notificación */}
        <BannersNotificacion 
          advertenciaSincronizacion={advertenciaSincronizacion}
          mostrarEliminados={mostrarEliminados}
          onCerrarAdvertencia={() => setAdvertenciaSincronizacion(false)}
        />

        {/* Botones de acción */}
        <BotonesAccion 
          mostrarEliminados={mostrarEliminados}
          onAgregar={() => gestor.setModalAbierto(true)}
          onAgregarCategoria={() => setModalCategoriaOpen(true)}
          onExportar={manejarExportar}
          onRefrescar={manejarRefrescar}
          cargando={gestor.cargando}
        />

        {/* Barra de herramientas */}
        <BarraHerramientas 
          filtros={filtros}
          mostrarEliminados={mostrarEliminados}
          modoSeleccion={modoSeleccion}
          productosSeleccionados={productosSeleccionados}
          productosFiltrados={productosFiltradosYOrdenados}
          onToggleEliminados={() => setMostrarEliminados(!mostrarEliminados)}
          onToggleModoSeleccion={() => gestor.setModoSeleccion(!modoSeleccion)}
          onSeleccionarTodos={manejarSeleccionarTodos}
          onEliminarLote={manejarEliminarLote}
        />

        {/* Instrucciones para modo selección */}
        {modoSeleccion && (
          <InstruccionesModoSeleccion />
        )}

        {/* Lista de productos */}
        {filtros.modoVista === "grid" ? (
          <VistaGrilla 
            productos={productosFiltradosYOrdenados}
            modoSeleccion={modoSeleccion}
            productosSeleccionados={productosSeleccionados}
            mostrarEliminados={mostrarEliminados}
            onClickProducto={manejarClickProducto}
            onEditar={(producto) => gestor.iniciarEdicion(producto)}
            onEliminar={manejarEliminar}
          />
        ) : (
          <VistaTabla 
            productos={productosFiltradosYOrdenados}
            modoSeleccion={modoSeleccion}
            productosSeleccionados={productosSeleccionados}
            mostrarEliminados={mostrarEliminados}
            onClickFila={manejarClickFilaTabla}
            onClickProducto={manejarClickProducto}
            onSeleccionarTodos={manejarSeleccionarTodos}
            onEditar={(producto) => gestor.iniciarEdicion(producto)}
            onEliminar={manejarEliminar}
          />
        )}

        {/* Estado vacío */}
        {productosFiltradosYOrdenados.length === 0 && (
          <EstadoVacio 
            mostrarEliminados={mostrarEliminados}
            tieneProductos={gestor.productosActivos.length > 0}
            filtrosActivos={Boolean(filtros.busqueda || filtros.categoria || filtros.estado)}
            onAgregar={() => gestor.setModalAbierto(true)}
          />
        )}
      </div>

      {/* Modal de producto */}
      <ProductoModal
        isOpen={gestor.modalAbierto}
        onClose={() => {
          gestor.setModalAbierto(false);
          setProgresoSubida(0);
          limpiarErrores();
        }}
        onSubmit={manejarEnvio}
        form={formulario}
        onChange={manejarCambioInput}
        errors={errores}
        isEditing={!!gestor.editandoId}
        submitting={enviando}
        uploadProgress={progresoSubida}
        categorias={categorias}
        categoriasLoading={categoriasLoading}
        onManageCategorias={{
          add: addCategoria,
          edit: editCategoria,
          delete: removeCategoria,
        }}
      />

      {/* Modal de categorías */}
      <CategoriasModal
        isOpen={modalCategoriaOpen}
        onClose={() => setModalCategoriaOpen(false)}
        categorias={categoriasSet}
        onAddCategoria={manejarAgregarCategoria}
        onEditCategoria={manejarEditarCategoria}
        onDeleteCategoria={manejarEliminarCategoria}
        loading={loadingCategorias}
      />
    </div>
  );
};

export default ProductosManager;