import { useState, useMemo } from 'react';

export const useProductsFilters = (productos = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("nombre");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [modoVista, setModoVista] = useState("grid");

  // Productos filtrados y ordenados
  const productosFiltradosYOrdenados = useMemo(() => {
    const filtrados = productos.filter((producto) => {
      const matchesSearch =
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || producto.categoria === filterCategory;
      const matchesStatus = !filterStatus || producto.estado === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Ordenar
    filtrados.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "precio" || sortBy === "stock") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtrados;
  }, [productos, searchTerm, filterCategory, filterStatus, sortBy, sortOrder]);

  // Categorías únicas para el filtro
  const categorias = useMemo(() => {
    return [...new Set(productos.map((p) => p.categoria))];
  }, [productos]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterStatus("");
    setSortBy("nombre");
    setSortOrder("asc");
  };

  // Objeto de filtros para compatibilidad
  const filtros = {
    busqueda: searchTerm,
    categoria: filterCategory,
    estado: filterStatus,
    ordenamiento: sortBy,
    orden: sortOrder,
    modoVista,
    mostrarFiltros: showFilters,
    
    // Funciones
    setBusqueda: setSearchTerm,
    setCategoria: setFilterCategory,
    setEstado: setFilterStatus,
    setOrdenamiento: setSortBy,
    setOrden: setSortOrder,
    setModoVista,
    setMostrarFiltros: setShowFilters,
    limpiar: clearFilters,
  };

  return {
    // Estados individuales (para compatibilidad)
    searchTerm,
    filterCategory,
    filterStatus,
    sortBy,
    sortOrder,
    showFilters,
    modoVista,
    
    // Setters individuales
    setSearchTerm,
    setFilterCategory,
    setFilterStatus,
    setSortBy,
    setSortOrder,
    setShowFilters,
    setModoVista,
    
    // Computed
    productosFiltradosYOrdenados,
    categorias,
    
    // Objeto de filtros
    filtros,
    
    // Acciones
    clearFilters,
    actualizarFiltro: (campo, valor) => {
      switch(campo) {
        case 'busqueda':
          setSearchTerm(valor);
          break;
        case 'categoria':
          setFilterCategory(valor);
          break;
        case 'estado':
          setFilterStatus(valor);
          break;
        case 'ordenamiento':
          setSortBy(valor);
          break;
        case 'orden':
          setSortOrder(valor);
          break;
        case 'modoVista':
          setModoVista(valor);
          break;
        default:
          break;
      }
    },
    limpiarFiltros: clearFilters,
  };
};
