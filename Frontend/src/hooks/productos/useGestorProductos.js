import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import {
  getProductos,
  getProductosEliminados,
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  restoreProducto,
  handleApiError,
} from '../../services/productos.service.js';
import { useProductos } from './useProductos';
import { useCategorias } from './useCategorias';

export const useGestorProductos = () => {
  // Estados principales
  const [productosActivos, setProductosActivos] = useState([]);
  const [productosEliminados, setProductosEliminados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarEliminados, setMostrarEliminados] = useState(false);
  const [advertenciaSincronizacion, setAdvertenciaSincronizacion] = useState(false);

  // Estados del formulario
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    id_categoria: "",
    estado: "",
    imagen: null,
    imagen_url: "",
    peso: "",
    ancho: "",
    alto: "",
    profundidad: "",
  });

  // Estados de UI
  const [editandoId, setEditandoId] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [progresoSubida, setProgresoSubida] = useState(0);

  // Estados de selección
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [modoVista, setModoVista] = useState("grid");

  // Hooks de productos y categorías
  const {
    productos,
    loading: productosLoading,
    error: productosError,
    addProducto,
    editProducto,
    removeProducto,
    restoreProductoHook,
  } = useProductos();

  const { categorias, loading: categoriasLoading, loadCategorias, addCategoria, editCategoria, removeCategoria } = useCategorias();

  // Estados de categorías personalizadas
  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(false);

  // Cargar productos activos
  const cargarProductos = async () => {
    setCargando(true);
    try {
      const response = await getProductos();
      if (response.success && response.data) {
        setProductosActivos(response.data);
      } else {
        console.error("Error al cargar productos:", response.error);
        setProductosActivos([]);
      }
    } catch (error) {
      console.error("Error inesperado al cargar productos:", error);
      setProductosActivos([]);
    } finally {
      setCargando(false);
    }
  };

  // Cargar productos eliminados
  const cargarProductosEliminados = async () => {
    try {
      const response = await getProductosEliminados();
      if (response.success && response.data) {
        setProductosEliminados(response.data);
      } else {
        console.error("Error al cargar productos eliminados:", response.error);
        setProductosEliminados([]);
      }
    } catch (error) {
      console.error("Error inesperado al cargar productos eliminados:", error);
      setProductosEliminados([]);
    }
  };

  // Cargar categorías
  const cargarCategorias = async () => {
    setCargandoCategorias(true);
    try {
      const response = await getCategorias();
      if (response.success && response.data?.data) {
        setCategoriasPersonalizadas(response.data.data[0]);
      } else {
        console.error("Error al cargar categorías:", response.error);
        setCategoriasPersonalizadas([]);
      }
    } catch (error) {
      console.error("Error inesperado al cargar categorías:", error);
      setCategoriasPersonalizadas([]);
    } finally {
      setCargandoCategorias(false);
    }
  };

  // Alternar vista de eliminados
  const alternarEliminados = async () => {
    const nuevoEstado = !mostrarEliminados;
    setMostrarEliminados(nuevoEstado);
    
    // Si vamos a mostrar eliminados, siempre recargar para obtener los más recientes
    if (nuevoEstado) {
      await cargarProductosEliminados();
    }
    
    setProductosSeleccionados([]);
    setModoSeleccion(false);
  };

  // Productos actuales basado en la vista
  const productosActuales = mostrarEliminados ? productosEliminados : productosActivos;

  // Estadísticas calculadas
  const estadisticas = useMemo(() => {
    const total = productosActivos.length;
    const activos = productosActivos.filter((p) => p.estado === "activo").length;
    const stockBajo = productosActivos.filter((p) => p.stock <= 5).length;
    const valorTotal = productosActivos.reduce((sum, p) => sum + p.precio * p.stock, 0);
    const eliminados = productosEliminados.length;

    return { total, activos, stockBajo, valorTotal, eliminados };
  }, [productosActivos, productosEliminados]);

  // Funciones de manejo del formulario
  const resetearFormulario = () => {
    setFormulario({
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
  };

  const manejarAgregarClick = () => {
    setEditandoId(null);
    resetearFormulario();
    setModalAbierto(true);
  };

  const manejarEditar = (producto) => {
    if (modoSeleccion) return;

    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      id_categoria: producto.id_categoria,
      estado: producto.estado,
      imagen: null,
      imagen_url: producto.imagen,
      peso: producto.peso || "",
      ancho: producto.ancho || "",
      alto: producto.alto || "",
      profundidad: producto.profundidad || "",
    });
    setEditandoId(producto.id_producto);
    setModalAbierto(true);
  };

  // Funciones de selección
  const alternarModoSeleccion = () => {
    setModoSeleccion(!modoSeleccion);
    if (modoSeleccion) {
      setProductosSeleccionados([]);
    }
  };

  const manejarClickProducto = (productoId) => {
    if (!modoSeleccion) return;

    setProductosSeleccionados((prev) =>
      prev.includes(productoId) 
        ? prev.filter((id) => id !== productoId) 
        : [...prev, productoId]
    );
  };

  const estaSeleccionado = (productoId) => {
    return productosSeleccionados.includes(productoId);
  };

  // Efectos
  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, []);

  return {
    // Estados principales
    productosActivos,
    productosEliminados,
    productosActuales,
    cargando,
    mostrarEliminados,
    advertenciaSincronizacion,
    
    // Estados del formulario
    formulario,
    setFormulario,
    editandoId,
    setEditandoId,
    modalAbierto,
    setModalAbierto,
    modalCategoriaAbierto,
    setModalCategoriaAbierto,
    enviando,
    setEnviando,
    progresoSubida,
    setProgresoSubida,
    
    // Estados de selección
    productosSeleccionados,
    setProductosSeleccionados,
    modoSeleccion,
    setModoSeleccion,
    modoVista,
    setModoVista,
    
    // Estados de hooks
    productos,
    productosLoading,
    productosError,
    categorias,
    categoriasLoading,
    categoriasPersonalizadas,
    cargandoCategorias,
    
    // Estadísticas
    estadisticas,
    
    // Funciones principales
    cargarProductos,
    cargarProductosEliminados,
    cargarCategorias,
    loadCategorias,
    alternarEliminados,
    resetearFormulario,
    manejarAgregarClick,
    manejarEditar,
    alternarModoSeleccion,
    manejarClickProducto,
    estaSeleccionado,
    setAdvertenciaSincronizacion,
    
    // Funciones de productos
    addProducto,
    editProducto,
    removeProducto,
    restoreProductoHook,
    
    // Funciones de categorías
    addCategoria,
    editCategoria,
    removeCategoria,
  };
};
