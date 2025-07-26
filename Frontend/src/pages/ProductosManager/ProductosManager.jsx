"use client"

import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import ProductoModal from "../../components/ProductoModal"
import CategoriasModal from "../../components/CategoriasModal"
import PageHeader from "../../components/PageHeader"
import PaginacionControles from "../../components/PaginacionControles"
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
import { useProductsFilters } from "../../hooks/productos/useProductsFilters"
import { useValidacionFormulario } from "../../hooks/productos/useValidacionFormulario"
import { usePaginacion } from "../../hooks/productos/usePaginacion"

function ProductosManager() {
  // Hooks principales
  const gestor = useGestorProductos();
  const { errores, validarFormulario, validarArchivo, limpiarError, limpiarErrores } = useValidacionFormulario();
  
  // Estado local adicional
  const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false);
  const [progresoSubida, setProgresoSubida] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [advertenciaSincronizacion, setAdvertenciaSincronizacion] = useState(false);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);

  // Datos combinados de productos y categorías
  const productos = gestor.mostrarEliminados ? gestor.productosEliminados : gestor.productosActivos;
  
  // Hook de filtros
  const {
    productosFiltradosYOrdenados,
    categorias: categoriasExtraidas,
    filtros,
    actualizarFiltro,
    limpiarFiltros
  } = useProductsFilters(productos);

  // Hook de paginación
  const {
    currentPage,
    itemsPerPage,
    paginatedItems: productosPaginados,
    totalItems,
    handlePageChange,
    handleItemsPerPageChange,
    resetPagination
  } = usePaginacion(productosFiltradosYOrdenados, 12);

  // Efectos
  useEffect(() => {
    gestor.cargarProductos();
    gestor.loadCategorias(); // Usar loadCategorias para cargar las categorías del hook useCategorias
  }, []);

  // Efecto para recargar categorías cuando se abre el modal de productos
  useEffect(() => {
    if (gestor.modalAbierto) {
      // Recargar categorías cuando se abre el modal de productos para asegurar sincronización
      gestor.loadCategorias();
    }
  }, [gestor.modalAbierto]);

  // Efecto para resetear paginación cuando cambian los filtros o productos
  useEffect(() => {
    resetPagination();
  }, [productosFiltradosYOrdenados.length, filtros.busqueda, filtros.categoria, filtros.estado, filtros.ordenamiento]);

  // Efecto para resetear selección cuando cambia la página o el modo de vista
  useEffect(() => {
    if (modoSeleccion) {
      setProductosSeleccionados([]);
    }
  }, [currentPage, filtros.modoVista]);

  // Estado para categorías - usar directamente las del gestor
  const [loadingCategorias, setLoadingCategorias] = useState(false);

  // Función auxiliar para sincronizar categorías después de operaciones CRUD
  const sincronizarCategorias = async () => {
    try {
      // Esperar un poco para asegurar que el backend termine de procesar
      await new Promise(resolve => setTimeout(resolve, 500));
      // Recargar categorías
      await gestor.loadCategorias();
      // Hacer refresh de productos una sola vez (como el botón refresh)
      manejarRefrescar();
    } catch (error) {
      console.error("Error al sincronizar categorías:", error);
    }
  };

  // Funciones de manejo de categorías
  const manejarAgregarCategoria = async (datosCategoria) => {
    setLoadingCategorias(true);
    try {
      const respuesta = await gestor.addCategoria(datosCategoria);
      if (respuesta.success) {
        // Sincronizar categorías entre ambos modales
        await sincronizarCategorias();
      }
      return respuesta;
    } catch (error) {
      return { success: false, error: "Ha ocurrido un error inesperado" };
    } finally {
      setLoadingCategorias(false);
    }
  };

  const manejarEditarCategoria = async (idCategoria, datosCategoria) => {
    setLoadingCategorias(true);
    try {
      const respuesta = await gestor.editCategoria(idCategoria, datosCategoria);
      if (respuesta.success) {
        // Sincronizar categorías entre ambos modales
        await sincronizarCategorias();
      }
      return respuesta;
    } catch (error) {
      return { success: false, error: "Ha ocurrido un error inesperado" };
    } finally {
      setLoadingCategorias(false);
    }
  };

  const manejarEliminarCategoria = async (idCategoria) => {
    setLoadingCategorias(true);
    try {
      const respuesta = await gestor.removeCategoria(idCategoria);
      if (respuesta.success) {
        // Sincronizar categorías entre ambos modales
        await sincronizarCategorias();
      }
      return respuesta;
    } catch (error) {
      return { success: false, error: "Ha ocurrido un error inesperado" };
    } finally {
      setLoadingCategorias(false);
    }
  };

  // Funciones de manejo del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      // Validar formulario
      if (!validarFormulario(gestor.formulario)) {
        setEnviando(false);
        return;
      }

      // Determinar si es edición o creación
      const esEdicion = Boolean(gestor.editandoId);
      let respuesta;

      if (esEdicion) {
        respuesta = await gestor.editProducto(gestor.editandoId, gestor.formulario);
      } else {
        respuesta = await gestor.addProducto(gestor.formulario);
      }

      if (respuesta.success) {
        // Recargar la lista de productos para mostrar los cambios
        await gestor.cargarProductos();
        
        Swal.fire("¡Éxito!", `Producto ${esEdicion ? "actualizado" : "agregado"} correctamente.`, "success");
        gestor.setModalAbierto(false);
        limpiarErrores();
        
        setTimeout(() => {
          gestor.resetearFormulario();
        }, 100);
      } else {
        Swal.fire("Error", respuesta.error || "No se pudo procesar la solicitud", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ha ocurrido un error inesperado", "error");
    } finally {
      setEnviando(false);
      setProgresoSubida(0);
    }
  };

  // Funciones de manejo de inputs
  const manejarCambioInput = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      
      if (file) {
        if (validarArchivo(file, name)) {
          gestor.setFormulario((prev) => ({ 
            ...prev, 
            [name]: file,
            imagen_url: ""
          }));
        }
      } else {
        gestor.setFormulario((prev) => ({ 
          ...prev, 
          [name]: null,
          ...(gestor.editandoId && prev.imagen_url && { imagen_url: prev.imagen_url })
        }));
      }
    } else {
      gestor.setFormulario((prev) => ({ ...prev, [name]: value }));
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
      const response = await gestor.removeProducto(id);
      
      if (response.success) {
        setProductosSeleccionados((prev) => prev.filter((selectedId) => selectedId !== id));
        await gestor.cargarProductos();
        Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
      } else {
        const errorMessage = handleApiError(response.error);
        
        if (errorMessage.includes("no encontrado") || errorMessage.includes("404")) {
          setAdvertenciaSincronizacion(true);
          await gestor.cargarProductos();
          Swal.fire("Producto no encontrado", "El producto ya fue eliminado o no existe. La lista ha sido actualizada.", "info");
        } else {
          Swal.fire("Error", errorMessage, "error");
        }
      }
    }
  };

  // Función de restaurar producto
  const manejarRestaurar = async (id) => {
    if (modoSeleccion) return;

    const result = await Swal.fire({
      title: "¿Restaurar producto?",
      text: "El producto será restaurado como 'inactivo' para que puedas revisarlo y editarlo antes de publicarlo",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, restaurar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const response = await gestor.restoreProductoHook(id);
      
      if (response.success) {
        // Recargar ambas listas para reflejar el cambio
        await gestor.cargarProductos();
        await gestor.cargarProductosEliminados();
        Swal.fire({
          title: "¡Restaurado!",
          text: "El producto ha sido restaurado como 'inactivo'. Puedes editarlo y luego activarlo cuando esté listo.",
          icon: "success",
          confirmButtonText: "Entendido"
        });
      } else {
        const errorMessage = handleApiError(response.error);
        Swal.fire("Error", errorMessage, "error");
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
        const response = await gestor.removeProducto(id);
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
      setModoSeleccion(false);
      await gestor.cargarProductos();

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
    if (productosSeleccionados.length === productosPaginados.length) {
      setProductosSeleccionados([]);
    } else {
      setProductosSeleccionados(productosPaginados.map((p) => p.id_producto));
    }
  };

  const manejarClickProducto = (productoId) => {
    if (!modoSeleccion) return;

    setProductosSeleccionados((prev) =>
      prev.includes(productoId) ? prev.filter((id) => id !== productoId) : [...prev, productoId]
    );
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
    if (gestor.mostrarEliminados) {
      gestor.cargarProductosEliminados();
    } else {
      gestor.cargarProductos();
    }
  };

  // Mostrar loading
  if (gestor.cargando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#fff8f0]">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-transparent border-orange-500 shadow-lg"></div>
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
        <p className="mt-6 text-xl font-semibold text-orange-600 animate-pulse">
          Cargando productos...
        </p>
      </div>
    );
  }

  // Mostrar error
  if (gestor.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar productos</h2>
          <p className="text-gray-600 mb-4">{gestor.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header del Catálogo */}
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", to: "/" },
          { label: gestor.mostrarEliminados ? "Productos eliminados" : "Administración de productos" }
        ]}
        title={gestor.mostrarEliminados ? "Productos eliminados" : "Administración de productos"}
        subtitle={gestor.mostrarEliminados ? "Productos que han sido eliminados del inventario" : "Gestiona tu inventario de productos"}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 bg-[#fff8f0]">
        {/* Estadísticas */}
        <EstadisticasProductos 
          productos={gestor.mostrarEliminados ? gestor.productosEliminados : gestor.productosActivos}
        />

        {/* Banners de notificación */}
        <BannersNotificacion 
          advertenciaSincronizacion={advertenciaSincronizacion}
          mostrarEliminados={gestor.mostrarEliminados}
          onCerrarAdvertencia={() => setAdvertenciaSincronizacion(false)}
        />

        {/* Botones de acción */}
        <BotonesAccion 
          mostrarEliminados={gestor.mostrarEliminados}
          onAgregar={() => gestor.manejarAgregarClick()}
          onAgregarCategoria={() => setModalCategoriaOpen(true)}
          onExportar={manejarExportar}
          onRefrescar={manejarRefrescar}
          cargando={gestor.cargando}
        />

        {/* Barra de herramientas */}
        <BarraHerramientas 
          filtros={filtros}
          categorias={categoriasExtraidas}
          estadisticas={gestor.estadisticas}
          mostrarEliminados={gestor.mostrarEliminados}
          modoSeleccion={modoSeleccion}
          productosSeleccionados={productosSeleccionados}
          productosFiltradosYOrdenados={productosPaginados}
          onToggleEliminados={gestor.alternarEliminados}
          onToggleModoSeleccion={() => setModoSeleccion(!modoSeleccion)}
          onSeleccionarTodos={manejarSeleccionarTodos}
          onEliminarLote={manejarEliminarLote}
        />

        {/* Instrucciones para modo selección */}
        {modoSeleccion && (
          <InstruccionesModoSeleccion />
        )}

        {/* Lista de productos paginados */}
        {filtros.modoVista === "grid" ? (
          <VistaGrilla 
            productosFiltradosYOrdenados={productosPaginados}
            modoSeleccion={modoSeleccion}
            mostrarEliminados={gestor.mostrarEliminados}
            manejarClickProducto={manejarClickProducto}
            manejarEditar={(producto) => gestor.manejarEditar(producto)}
            manejarEliminar={manejarEliminar}
            manejarRestaurar={manejarRestaurar}
            estaSeleccionado={(id) => productosSeleccionados.includes(id)}
          />
        ) : (
          <VistaTabla 
            productosFiltradosYOrdenados={productosPaginados}
            modoSeleccion={modoSeleccion}
            productosSeleccionados={productosSeleccionados}
            mostrarEliminados={gestor.mostrarEliminados}
            manejarClickFilaTabla={manejarClickFilaTabla}
            manejarClickProducto={manejarClickProducto}
            manejarSeleccionarTodos={manejarSeleccionarTodos}
            estaSeleccionado={(id) => productosSeleccionados.includes(id)}
            manejarEditar={(producto) => gestor.manejarEditar(producto)}
            manejarEliminar={manejarEliminar}
            manejarRestaurar={manejarRestaurar}
          />
        )}

        {/* Controles de paginación */}
        {productosFiltradosYOrdenados.length > 0 && (
          <div className="mt-8">
            <PaginacionControles
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}

        {/* Estado vacío */}
        {productosFiltradosYOrdenados.length === 0 && (
          <EstadoVacio 
            mostrarEliminados={gestor.mostrarEliminados}
            tieneProductos={gestor.productosActivos.length > 0}
            filtrosActivos={Boolean(filtros.busqueda || filtros.categoria || filtros.estado)}
            onAgregar={() => gestor.manejarAgregarClick()}
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
        form={gestor.formulario}
        onChange={manejarCambioInput}
        errors={errores}
        isEditing={!!gestor.editandoId}
        submitting={enviando}
        uploadProgress={progresoSubida}
        categorias={gestor.categorias}
        categoriasLoading={gestor.categoriasLoading}
        onManageCategorias={{
          add: gestor.addCategoria,
          edit: gestor.editCategoria,
          delete: gestor.removeCategoria,
        }}
      />

      {/* Modal de categorías */}
      <CategoriasModal
        isOpen={modalCategoriaOpen}
        onClose={() => setModalCategoriaOpen(false)}
        categorias={gestor.categorias || []}
        onAddCategoria={manejarAgregarCategoria}
        onEditCategoria={manejarEditarCategoria}
        onDeleteCategoria={manejarEliminarCategoria}
        loading={loadingCategorias}
      />
    </div>
  );
}

export default ProductosManager;
