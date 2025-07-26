import { useState } from 'react';
import { exportAllCompras, exportCurrentCompras } from '../../services/export.service';

export const useExport = () => {
  const [exporting, setExporting] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Exportar todas las compras con filtros
  const handleExportarCSV = async (orders, filters, enviosData) => {
    setExporting(true);
    try {
      const result = await exportAllCompras(orders, filters, enviosData);
      alert(`Exportación completada. Se exportaron ${result.count} compras.`);
      return result;
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar los datos. Inténtalo de nuevo.');
      throw error;
    } finally {
      setExporting(false);
    }
  };

  // Exportar compras de la página actual
  const handleExportarFiltrados = async (currentCompras, enviosData) => {
    setExporting(true);
    try {
      const result = await exportCurrentCompras(currentCompras, enviosData);
      alert(`Exportación completada. Se exportaron ${result.count} compras de la vista actual.`);
      return result;
    } catch (error) {
      console.error('Error al exportar:', error);
      if (error.message === 'No hay datos para exportar') {
        alert('No hay datos para exportar con los filtros actuales.');
      } else {
        alert('Error al exportar los datos. Inténtalo de nuevo.');
      }
      throw error;
    } finally {
      setExporting(false);
    }
  };

  // Cerrar dropdown
  const closeExportDropdown = () => {
    setShowExportDropdown(false);
  };

  // Toggle dropdown
  const toggleExportDropdown = () => {
    setShowExportDropdown(!showExportDropdown);
  };

  return {
    // State
    exporting,
    showExportDropdown,

    // Actions
    handleExportarCSV,
    handleExportarFiltrados,
    closeExportDropdown,
    toggleExportDropdown,
    setShowExportDropdown,
  };
}; 