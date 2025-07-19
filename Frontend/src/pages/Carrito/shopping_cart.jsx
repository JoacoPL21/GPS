import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useCart } from '../../context/CartContext.jsx';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';
const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';
const mpPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
initMercadoPago(mpPublicKey, { locale: 'es-CL' });

// Función para formatear precios
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL').format(price);
};

const CartItem = ({ 
  title, 
  price,  
  quantity,
  image,
  onRemove,
  onAddToFavorites,
  onIncrease,
  onDecrease
}) => {
  const isMinusDisabled = quantity <= 1;
  const isPlusDisabled = quantity >= 10;

  return (
    <div className="rounded-lg border border-yellow-600 bg-white p-4 shadow-sm md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1">
          <img className="h-20 w-20" src={`${API_URL}/uploads/${image}`} alt={title} />
        </div>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center">
            <div
              role="button"
              tabIndex={0}
              aria-label="Disminuir cantidad"
              onClick={() => !isMinusDisabled && onDecrease()}
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isMinusDisabled 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-yellow-600 text-white hover:bg-yellow-700 cursor-pointer'
              } focus:outline-none text-xl font-bold`}
            >
              -
            </div>
            <input
              type="text"
              className="w-10 border-0 bg-transparent text-center text-sm font-medium text-yellow-900 focus:outline-none"
              value={quantity}
              readOnly
              aria-label="Cantidad"
            />
            <div
              role="button"
              tabIndex={0}
              aria-label="Aumentar cantidad"
              onClick={() => !isPlusDisabled && onIncrease()}
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isPlusDisabled 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-yellow-600 text-white hover:bg-yellow-700 cursor-pointer'
              } focus:outline-none`}
            >
              +
            </div>
          </div>
          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-yellow-900">${price}</p>
          </div>
        </div>

        <div className="w-full flex-1 space-y-4 md:order-2 md:max-w-md">
          <div className="text-base font-medium">{title}</div>
          <div className="flex items-center gap-4">
            <div
              role="button"
              tabIndex={0}
              onClick={onAddToFavorites}
              className="inline-flex items-center text-sm font-medium text-white bg-yellow-800 p-2 rounded-2xl hover:underline cursor-pointer"
            >
              <Heart className="mr-1 h-5 w-5" /> Añadir a favoritos
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={onRemove}
              className="inline-flex items-center text-sm font-medium hover:border-red-700 border-2 rounded-2xl p-2 text-yellow-800 border-yellow-700 hover:text-red-900 hover:underline cursor-pointer"
            >
              <Trash2 className="mr-1 h-5 w-5" /> Eliminar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShoppingCart = () => {
  // CORRECCIÓN: Usar las funciones correctas del CartContext
  const { 
    cart: carrito, 
    removeItemFromCart, // Cambiar de 'removeItem' a 'removeItemFromCart'
    incrementItemQuantity, // Cambiar de 'increaseQuantity' a 'incrementItemQuantity'
    decrementItemQuantity // Cambiar de 'decreaseQuantity' a 'decrementItemQuantity'
  } = useCart();
  
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calcular totales
  const subtotal = carrito.reduce(
    (total, item) => total + (Number(item.precio.toString().replace(/\./g, '')) * (item.cantidad || 1)),
    0
  );
  
  const discount = 0; // Descuento (puedes implementar lógica real aquí)
  const shipping = 3000; // Costo de envío fijo
  const total = subtotal - discount + shipping;

  const handleAddToFavorites = (itemId) => {
    console.log('Adding to favorites:', itemId);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    
    if (carrito.length === 0) {
      setError('El carrito está vacío');
      setLoading(false);
      return;
    }

    try {
      const items = carrito.map(item => ({
        title: item.nombre,
        unit_price: Number(item.precio.toString().replace(/\./g, '')),
        quantity: item.cantidad || 1,
      }));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create_preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          external_reference: `ORD-${Date.now()}`
        }),
      });

      if (!response.ok) throw new Error('Error al crear la preferencia de pago');

      const data = await response.json();
      setPreferenceId(data.preferenceId || data.id);
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen min-w-screen bg-white py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="relative mb-6 h-10">
          <Link
            to="/"
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 hover:text-yellow-900 !no-underline !text-yellow-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <h2 className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold text-yellow-900 sm:text-2xl">
            Carrito de compras
          </h2>
        </div>

        <div className="lg:flex lg:gap-8">
          <div className="w-full lg:w-2/3 space-y-6">
            {carrito.map((item) => (
              <CartItem
                key={item.id_producto} // CORRECCIÓN: Usar id_producto como clave única
                title={item.nombre}
                price={formatPrice(Number(item.precio.toString().replace(/\./g, '')))}
                quantity={item.cantidad || 1}
                image={item.imagen}
                // CORRECCIÓN: Pasar el item completo a removeItemFromCart y usar id_producto para las otras funciones
                onRemove={() => removeItemFromCart(item)}
                onAddToFavorites={() => handleAddToFavorites(item.id_producto)}
                onIncrease={() => incrementItemQuantity(item.id_producto)}
                onDecrease={() => decrementItemQuantity(item.id_producto)}
              />
            ))}
          </div>

          <div className="w-full lg:w-1/3 mt-6 lg:mt-0 space-y-6">
            <div className="border border-yellow-600 p-4 rounded-lg shadow-sm bg-white">
              <p className="text-xl font-semibold text-yellow-900">
                Resumen del pedido
              </p>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Precio</span>
                  <span className="text-yellow-900">
                    ${formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Ahorro</span>
                  <span className="text-green-600">
                    -${formatPrice(discount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Envío</span>
                  <span className="text-yellow-900">
                    ${formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-yellow-600 pt-2">
                  <span className="text-yellow-900">Total</span>
                  <span className="text-yellow-900">${formatPrice(total)}</span>
                </div>
              </div>

              {error && <p className="mt-4 text-red-600">{error}</p>}

              {preferenceId ? (
                <Wallet
                  initialization={{ preferenceId }}
                  customization={{
                    texts: { valueProp: "smart_option" },
                    theme: "dark",
                  }}
                  onReady={() => console.log("🟢 Wallet Brick listo")}
                  onError={(error) => {
                    console.error("🔴 Error en el Brick:", error);
                    setError("Error al cargar el botón de pago.");
                  }}
                />
              ) : (
                <div
                  onClick={handleCheckout}
                  className={`w-full mt-4 py-2 px-4 text-white rounded-lg text-center ${
                    loading || carrito.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-yellow-700 hover:bg-yellow-800 cursor-pointer"
                  }`}
                >
                  {loading ? "Procesando..." : "Proceder al pago"}
                </div>
              )}

              <div className="flex justify-center gap-2 mt-4">
                <span className="text-sm text-yellow-700">o</span>
                <Link
                  to="/catalogo"
                  className="text-sm underline !text-yellow-900"
                >
                  Volver al catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;

