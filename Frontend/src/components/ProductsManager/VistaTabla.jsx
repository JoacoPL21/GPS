const VistaTabla = ({ 
  productosFiltradosYOrdenados = [],
  modoSeleccion,
  mostrarEliminados,
  productosSeleccionados,
  manejarSeleccionarTodos,
  estaSeleccionado,
  manejarClickFilaTabla,
  manejarClickProducto,
  manejarEditar,
  manejarEliminar,
  manejarRestaurar
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {modoSeleccion && !mostrarEliminados && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      productosSeleccionados.length === productosFiltradosYOrdenados.length &&
                      productosFiltradosYOrdenados.length > 0
                    }
                    onChange={manejarSeleccionarTodos}
                    className="w-5 h-5 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              {mostrarEliminados && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eliminado
                </th>
              )}
              {!modoSeleccion && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productosFiltradosYOrdenados.map((producto) => (
              <tr
                key={producto.id_producto}
                onClick={() => manejarClickFilaTabla(producto)}
                className={`${
                  modoSeleccion
                    ? "cursor-pointer hover:bg-gray-50"
                    : estaSeleccionado && estaSeleccionado(producto.id_producto)
                    ? "bg-orange-50 border-orange-200"
                    : "hover:bg-gray-50"
                } transition-colors`}
              >
                {modoSeleccion && !mostrarEliminados && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={estaSeleccionado(producto.id_producto)}
                      onChange={() => manejarClickProducto(producto.id_producto)}
                      className="w-5 h-5 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500"
                    />
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                      src={producto.imagen}
                      alt={producto.nombre}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.svg";
                      }}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                      <div className="text-sm text-gray-500">{producto.descripcion}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{producto.categoria}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${producto.precio.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      producto.stock <= 5 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {producto.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      producto.estado === "activo"
                        ? "bg-green-100 text-green-800"
                        : producto.estado === "eliminado"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {producto.estado}
                  </span>
                </td>
                {mostrarEliminados && (
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {producto.eliminado_en ? new Date(producto.eliminado_en).toLocaleDateString() : "N/A"}
                  </td>
                )}
                {!modoSeleccion && (
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      {mostrarEliminados ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            manejarRestaurar(producto.id_producto);
                          }}
                          className="text-green-600 hover:text-green-900 transition-colors flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          <span>Restaurar</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              manejarEditar(producto);
                            }}
                            className="text-orange-600 hover:text-orange-900 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              manejarEliminar(producto.id_producto);
                            }}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VistaTabla;
