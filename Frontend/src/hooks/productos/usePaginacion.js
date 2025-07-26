import { useState, useMemo } from 'react'

export const usePaginacion = (items = [], initialItemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)

  // Calcular elementos de la página actual
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }, [items, currentPage, itemsPerPage])

  // Resetear a página 1 cuando cambian los elementos o items por página
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  // Resetear a página 1 cuando cambia la lista de elementos
  const resetPagination = () => {
    setCurrentPage(1)
  }

  // Validar y cambiar página
  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(items.length / itemsPerPage)
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return {
    currentPage,
    itemsPerPage,
    paginatedItems,
    totalItems: items.length,
    totalPages: Math.ceil(items.length / itemsPerPage),
    handlePageChange,
    handleItemsPerPageChange,
    resetPagination
  }
}
