"use client"
import { Link } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa"
const CardCatalogo = ({ producto, onAddToCart, viewMode = "grid" }) => {
  const getStockStatus = (stock) => {
    if (stock === 0) return { color: "bg-red-100 text-red-800", text: "Agotado", available: false }
    if (stock <= 5) return { color: "bg-yellow-100 text-yellow-800", text: "Últimas unidades", available: true }
    return { color: "bg-green-100 text-green-800", text: "Disponible", available: true }
  }

const getCategoryColor = (categoria) => {
  const colors = {
    Artesanía: "bg-amber-100 text-amber-800",     
    Juguetes: "bg-orange-100 text-orange-900",     
    Decoración: "bg-yellow-100 text-yellow-900",    
    Muebles: "bg-stone-200 text-stone-800",         
    Accesorios: "bg-amber-200 text-amber-900",      
  }
  return colors[categoria] || "bg-stone-100 text-stone-800"  // Por defecto, tono café claro
}

  const stockStatus = getStockStatus(producto.stock)
  const categoryColor = getCategoryColor(producto.categoria)

  const handleAddToCart = () => {
    if (stockStatus.available) {
      onAddToCart(producto)
    }
  }

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      
        <div className="flex">
           <Link to={`/producto/${producto.id_producto}`}>
          <div className="relative w-48 h-48 bg-gradient-to-br from-[#e9dbce] to-[#d4b8a3] flex items-center justify-center flex-shrink-0">
            <img src={producto.imagen} alt={producto.nombre} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />

            <div className="absolute top-3 left-3">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryColor}`}>
                {producto.categoria}
              </span>
            </div>

            <div className="absolute top-3 right-3">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
            </div>
          </div>
        </Link>
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <Link to={`/producto/${producto.id_producto}`}>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-[#a47148] transition-colors">
                {producto.nombre}
              </h3>
              </Link>
              <p className="text-gray-600 mb-4 leading-relaxed">{producto.descripcion}</p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">{producto.stock} disponibles</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-[#a47148]">${producto.precio.toLocaleString()} CLP</div>

              <button
                onClick={handleAddToCart}
                disabled={!stockStatus.available}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  stockStatus.available
                    ? "bg-gradient-to-r from-[#a47148] to-[#8c5d3d] hover:from-[#946746] hover:to-[#7e5137] text-white hover:scale-105 hover:shadow-lg"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FaShoppingCart className="w-5 h-5" />
                <span>{stockStatus.available ? "Agregar al carrito" : "No disponible"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105">
      <Link to={`/producto/${producto.id_producto}`}>
        <div className="relative h-64 bg-gradient-to-br from-[#e9dbce] to-[#d4b8a3] flex items-center justify-center">
        
        <img src={producto.imagen} alt={producto.nombre} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 " />

        <div className="absolute top-3 left-3">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryColor}`}>
            {producto.categoria}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>
      </div>
    </Link>

      <div className="p-6">
        <Link to={`/producto/${producto.id_producto}`}>
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#a47148] transition-colors">
          {producto.nombre}
        </h3>
      </Link>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{producto.descripcion}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className="text-sm text-gray-600">{producto.stock} disponibles</span>
          </div>

          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-gray-500 ml-1"> ({producto.prom_valoraciones}) </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-[#a47148]">
            ${producto.precio.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 ml-1">CLP</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!stockStatus.available}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
              stockStatus.available
                ? "bg-gradient-to-r from-[#a47148] to-[#8c5d3d] hover:from-[#946746] hover:to-[#7e5137] text-white hover:scale-105 hover:shadow-lg"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
          <FaShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">{stockStatus.available ? "Agregar" : "Agotado"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardCatalogo
