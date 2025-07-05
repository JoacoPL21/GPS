import { Link } from "react-router-dom";
import { FaShoppingCart, FaStar, FaHeart } from "react-icons/fa";
import { useProductosDestacados } from "../hooks/productos/useProductosDestacados";
const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

function FeaturedProducts() {
  const { productos, loading, error } = useProductosDestacados(4);

  // Componente de Loading Skeleton
  const ProductSkeleton = () => (
    <div className="group cursor-pointer hover:shadow-xl transition-shadow border border-amber-200 rounded-lg overflow-hidden bg-white animate-pulse">
      <div className="p-0">
        <div className="relative overflow-hidden">
          <div className="w-full h-64 bg-gray-200"></div>
        </div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="w-full bg-gray-200 h-10 rounded-md"></div>
      </div>
    </div>
  );

  // Mostrar error
  if (error) {
    return (
      <section>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#a47148] mb-4">Productos Destacados</h2>
            <p className="text-amber-700 max-w-2xl mx-auto">
              Descubre nuestra selección de muebles más populares, elaborados con maderas premium y acabados excepcionales.
            </p>
          </div>
          
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar productos</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#a47148] mb-4">Productos Destacados</h2>
          <p className="text-amber-700 max-w-2xl mx-auto">
            Descubre nuestra selección de muebles más populares, elaborados con maderas premium y acabados excepcionales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Mostrar skeletons mientras carga
            [...Array(4)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : productos.length > 0 ? (
            productos.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer hover:shadow-xl transition-shadow border border-amber-200 rounded-lg overflow-hidden bg-white"
              >
                <div className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={`${API_URL}/uploads/${product.image}`}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-[#a47148] text-amber-50 px-2 py-1 rounded text-xs font-semibold">
                        {product.badge}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/80 hover:bg-white text-[#a47148] w-9 h-9 flex items-center justify-center rounded-full cursor-pointer">
                      <FaHeart className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-amber-900 mb-2 group-hover:text-amber-800 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-amber-700 ml-2">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-amber-900">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-amber-600 line-through">{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="w-full bg-[#a47148] hover:bg-[#b76d35] text-amber-50 py-2 px-4 rounded-md flex items-center justify-center cursor-pointer">
                    <FaShoppingCart className="h-4 w-4 mr-2" />
                    Agregar al Carrito
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Mostrar mensaje cuando no hay productos
            <div className="col-span-full text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay productos destacados</h3>
                <p className="text-gray-600">
                  No hay productos disponibles en este momento
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link to="/catalogo">
            <div className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-amber-800 bg-[#a47148] text-white hover:bg-[#b76d35] hover:text-amber-50 h-10 px-4 py-2 transition-colors cursor-pointer">
              Ver Todos los Productos
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;