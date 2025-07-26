import React, { useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { useMisCompras } from '../../hooks/compras/useMisCompras';
import CompraCardModern from '../../components/compras/CompraCardModern';
import PurchaseDetailsModal from '../../components/PurchaseDetailsModal';
import Pagination from '../../components/compras/Pagination';

const MisCompras = () => {
  const {
    // State
    compras,
    loading,
    error,
    enviosData,

    // Actions
    cargarCompras,
    
    // Paginación
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    currentCompras,
    handlePageChange,
    handleItemsPerPageChange,
  } = useMisCompras();

  const [selectedCompra, setSelectedCompra] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerDetalles = (compra) => {
    setSelectedCompra(compra);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompra(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando historial de compras...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">Error al cargar las compras: {error}</p>
            <button
              onClick={cargarCompras}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
                    <div className="container mx-auto px-4 py-8 max-w-4xl">
                  {/* Header */}
                  <div className="mb-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Mis Compras</h2>
        <p className="text-gray-500">Revisa el historial de tus compras realizadas</p>
      </div>

      {compras.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border-gray-400 p-8 text-center max-w-4xl mx-auto">
          <FaShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no tienes compras</h3>
          <p className="text-gray-600 mb-6">Cuando realices tu primera compra, aparecerá aquí tu historial.</p>
          <a
            href="/catalogo"
            className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <FaShoppingBag className="w-5 h-5 mr-2" /> Ir al catálogo
          </a>
        </div>
      ) : (
        <>
                                <div className="space-y-6 max-w-4xl mx-auto">
            {currentCompras.map((compra) => {
              const idCompra = compra.id_compra || compra.id;
              
              return (
                <CompraCardModern
                  key={idCompra}
                  compra={compra}
                  onVerDetalles={handleVerDetalles}
                />
              );
            })}
          </div>
          
                                {/* Paginación */}
                      <div className="max-w-4xl mx-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              totalItems={compras.length}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          </div>
        </>
      )}

      {/* Modal de detalles */}
      <PurchaseDetailsModal
        compra={selectedCompra}
        envio={selectedCompra ? enviosData[selectedCompra.id_compra || selectedCompra.id] : null}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MisCompras; 