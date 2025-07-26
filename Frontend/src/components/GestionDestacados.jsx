import { useState } from "react";
import { useProductos } from "../hooks/productos/useProductos";
import { useToggleDestacado } from "../hooks/productos/useToggleDestacado";
import { useConteoDestacados } from "../hooks/productos/useConteoDestacados";
import { FaStar, FaRegStar, FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";


function GestionDestacados() {
  const { productos, loading, error, setProductos } = useProductos();
  const { toggleDestacado, loading: toggleLoading } = useToggleDestacado();
  const { conteo, loadConteo } = useConteoDestacados();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggleDestacado = async (id_producto) => {
    const resultado = await toggleDestacado(id_producto);
    
    if (resultado.success) {
      setSuccessMessage(resultado.data.message);
      setErrorMessage(""); 
      
      // Actualizar el estado local sin recargar todos los productos
      setProductos(prevProductos => 
        prevProductos.map(producto => 
          producto.id_producto === id_producto 
            ? { ...producto, destacado: !producto.destacado }
            : producto
        )
      );
      
      await loadConteo();
      
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } else {
      setErrorMessage(resultado.error);
      setSuccessMessage(""); 
      
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar productos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Productos Destacados</h2>
          <p className="text-gray-600 mb-4">
            Marca o desmarca productos como destacados. Los productos destacados aparecerán en la página principal.
            Si no hay productos destacados, se mostrarán los últimos 4 productos agregados.
          </p>
          
          {/* Contador de productos destacados */}
          <div className="bg-[#A65F00] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Productos Destacados</h3>
                <p className="text-sm text-gray-100">
                  {conteo} de 8 productos marcados como destacados
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{conteo}/8</div>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(conteo / 8) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Alerta cuando está cerca del límite */}
            {conteo >= 6 && (
              <div className="mt-3 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-yellow-600 mr-2" />
                  <span className="text-yellow-800 text-sm font-medium">
                    {conteo === 8 
                      ? "Límite máximo alcanzado. No se pueden agregar más productos destacados."
                      : `Cuidado: Solo quedan ${8 - conteo} espacios para productos destacados.`
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {errorMessage}
            </div>
          </div>
        )}

        {/* Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos
            .sort((a, b) => {
              // Ordenar destacados primero, luego por nombre
              if (a.destacado && !b.destacado) return -1;
              if (!a.destacado && b.destacado) return 1;
              return a.nombre.localeCompare(b.nombre);
            })
            .map((producto) => (
            <div
              key={producto.id_producto}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
                producto.destacado ? "border-[#A65F00]" : "border-gray-200"
              }`}
            >
              {/* Imagen */}
              <div className="relative">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover"
                />
                {producto.destacado && (
                  <div className="absolute top-3 left-3 bg-[#A65F00] text-white px-2 py-1 rounded text-xs font-semibold">
                    Destacado
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">{producto.nombre}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-1">{producto.descripcion}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-orange-600">
                    ${producto.precio.toLocaleString()}
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(producto.prom_valoraciones || 0) 
                            ? "text-yellow-400" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Botón de toggle */}
                <button
                  onClick={() => handleToggleDestacado(producto.id_producto)}
                  disabled={toggleLoading || (!producto.destacado && conteo >= 8)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    producto.destacado
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : conteo >= 8
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#A65F00] text-white hover:bg-[#8B4F00]"
                  } ${toggleLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {toggleLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Procesando...
                    </div>
                  ) : producto.destacado ? (
                    <div className="flex items-center justify-center">
                      <FaEyeSlash className="mr-2" />
                      Quitar de Destacados
                    </div>
                  ) : conteo >= 8 ? (
                    <div className="flex items-center justify-center">
                      <FaExclamationTriangle className="mr-2" />
                      Límite Alcanzado
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaStar className="mr-2" />
                      Marcar como Destacado
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GestionDestacados; 