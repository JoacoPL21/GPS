import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useProductosbyId from '../../hooks/productos/useProductosId';
import {useCart} from'../../context/CartContext.jsx';
import ValoracionesProducto from '../../components/ProductoClientes/ValoracionesProducto';
import CardInfoProducto from "../../components/ProductoClientes/CardInfoProductos.jsx"
import PageHeader from "../../components/PageHeader"
import { FaShoppingCart } from "react-icons/fa";
import ErrorProductos from "../../components/ProductoClientes/ErrorProductos.jsx";



const Producto = () => {
  const { id_producto: id } = useParams()
  const { producto, loading } = useProductosbyId(id)
  const [cantidad, setCantidad] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItemToCart } = useCart()

  const handleClickAddToCart = (producto) => {
    if (!producto) return

    const item = {
      id_producto: producto.id_producto, // CORRECCIÓN: Cambiar 'id' por 'id_producto'
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
      imagen: producto.imagen,
      categoria: producto.categoria,
      stock: producto.stock,
    }

    addItemToCart(item)
    setAddedToCart(true)

    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  const aumentarCantidad = () => {
    if (producto && cantidad < producto.stock) {
      setCantidad(cantidad + 1)
    }
  }

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1)
    }
  }



if (!producto) {
  return (
    <div>
      <ErrorProductos message="Producto no encontrado" onRetry={() => window.location.reload()} />
    </div>
  )
}

  return (
    <div>
      <PageHeader
        fullWidth
        breadcrumbs={[{ label: "Inicio", to: "/" }, { label: "Catálogo", to: "/catalogo" }, { label: producto.nombre }]}
        title="Detalle del Producto"
      />

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative mb-8">
          {addedToCart && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-bounce z-10 shadow-lg">
              ¡Agregado al carrito!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="relative">
            <div className="w-full aspect-[4/3] max-h-[500px]">
                <img
                  src={producto.imagen || "/placeholder.svg"}
                  alt={producto.nombre}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#a47148] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {producto.categoria}
                </span>
              </div>
            </div>

            <div className="p-8 flex flex-col justify-between min-h-[500px]">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">{producto.nombre}</h1>
                  <p className="text-lg text-gray-600 leading-relaxed">{producto.descripcion}</p>
                </div>

                <div className="bg-[#f5eee7] p-6 rounded-xl">
                  <div className="text-3xl font-bold text-[#a47148] mb-2">$ {producto.precio.toLocaleString("es-CL", { minimumFractionDigits: 0 })} CLP</div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Cantidad:</span>
                    <div className="flex items-center bg-gray-100 rounded-xl">
                      <button
                        onClick={disminuirCantidad}
                        disabled={cantidad <= 1}
                        className="p-3 hover:bg-gray-200 rounded-l-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-6 py-3 font-semibold min-w-[60px] text-center">{cantidad}</span>
                      <button
                        onClick={aumentarCantidad}
                        disabled={cantidad >= producto.stock}
                        className="p-3 hover:bg-gray-200 rounded-r-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#f5eee7] p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-[#a47148]">
                        $ {(producto.precio * cantidad).toLocaleString("es-CL", { minimumFractionDigits: 0 })} CLP
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <button
                  onClick={() => handleClickAddToCart(producto)}
                  disabled={producto.stock === 0}
                  className="w-full bg-[#a47148] text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-[#8c5d3d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart className="w-5 h-5" />
                  <span>{producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <CardInfoProducto producto={producto} />

        {producto?.id_producto && <ValoracionesProducto id_producto={producto.id_producto} />}
      </div>
    </div>
  )
}

export default Producto
