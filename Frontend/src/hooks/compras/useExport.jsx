import { useState } from 'react';
import { exportAllCompras, exportCurrentCompras } from '../../services/export.service';

export const useExport = () => {
  const [exporting, setExporting] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

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

  const closeExportDropdown = () => {
    setShowExportDropdown(false);
  };

  const toggleExportDropdown = () => {
    setShowExportDropdown(!showExportDropdown);
  };

  return {
    exporting,
    showExportDropdown,
    handleExportarCSV,
    handleExportarFiltrados,
    closeExportDropdown,
    toggleExportDropdown,
    setShowExportDropdown,
  };
}; 