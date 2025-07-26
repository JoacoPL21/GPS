import React, { useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';

const ExportButton = ({ 
  showDropdown, 
  onToggleDropdown
}) => {
  // Cerrar dropdown al hacer clic fuera o presionar Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.export-dropdown')) {
        onToggleDropdown();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showDropdown) {
        onToggleDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showDropdown, onToggleDropdown]);

  return (
    <div className="relative export-dropdown">
      <button 
        onClick={onToggleDropdown}
        className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
      >
        <FaDownload className="mr-2" />
        Exportar
      </button>
      
      {/* Dropdown de opciones de exportación */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                onToggleDropdown();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FaDownload className="mr-2" />
              Exportar todas las compras
            </button>
            <button
              onClick={() => {
                onToggleDropdown();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FaDownload className="mr-2" />
              Exportar filtros actuales
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton; 