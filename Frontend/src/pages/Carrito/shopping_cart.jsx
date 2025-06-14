import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
const mpPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
import { useCarrito } from '../../components/CartProvider';

initMercadoPago(mpPublicKey, { locale: 'es-CL' });

const CartItem = ({ 
  title, 
  price,  
  quantity,
  image,
  onRemove,
  onAddToFavorites,
  onQuantityChange
}) => {
  const isMinusDisabled = quantity <= 1;
  const isPlusDisabled = quantity >= 10;

  return (
    <div className="rounded-lg border border-yellow-600 bg-white p-4 shadow-sm md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1">
          <img className="h-20 w-20" src={image} alt={title} />
        </div>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center">
            <div
              role="button"
              tabIndex={0}
              aria-label="Disminuir cantidad"
              onClick={() => !isMinusDisabled && onQuantityChange(quantity - 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 ${
                isMinusDisabled ? 'text-white cursor-not-allowed' : 'text-white hover:bg-yellow-700 cursor-pointer'
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
              onClick={() => !isPlusDisabled && onQuantityChange(quantity + 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 ${
                isPlusDisabled ? 'text-yellow-200 cursor-not-allowed' : 'text-white hover:bg-yellow-700 cursor-pointer'
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
              className="inline-flex items-center text-sm font-medium text-white bg-yellow-800 p-1.5 rounded-2xl hover:underline cursor-pointer"
            >
              ❤️ Añadir a favoritos
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={onRemove}
              className="inline-flex items-center text-sm font-medium border-red-700 border-2 rounded-2xl p-1.5 text-red-700 hover:text-red-900 hover:underline cursor-pointer"
            >
              ❌ Eliminar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShoppingCart = () => {
  const { carrito, eliminarDelCarrito, actualizarCantidad } = useCarrito();
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("🟢 Items del carrito:", carrito); 

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

const subtotal = carrito.reduce((acc, item) => {
  if (!item.price) return acc; // evita item.price undefined
  const numericPrice = Number(item.price.toString().replace(/\./g, ''));
  return acc + numericPrice * (item.quantity || 1);
}, 0);

  const discount = 2000;
  const shipping = 5000;
  const total = subtotal - discount + shipping;

  const handleRemoveItem = (itemId) => {
    eliminarDelCarrito(itemId);
  };

  const handleAddToFavorites = (itemId) => {
    console.log('Adding to favorites:', itemId);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const clamped = Math.max(1, Math.min(10, newQuantity));
    actualizarCantidad(itemId, clamped);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = carrito.map(item => ({
        title: item.title,
        unit_price: Number(item.price.replace(/\./g, '')),
        quantity: item.quantity,
      }));

      const response = await fetch('http://localhost:3000/api/payments/create_preference', {
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
    <section className="min-h-screen bg-white py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-yellow-700 hover:text-yellow-900">
            ← Volver
          </Link>
          <h2 className="text-xl font-semibold text-yellow-900 sm:text-2xl">Carrito de compras</h2>
        </div>

        <div className="lg:flex lg:gap-8">
          <div className="w-full lg:w-2/3 space-y-6">
            {carrito.map((item) => (
  <CartItem
    key={item.id}
    title={item.nombre}
    price={formatPrice(Number(item.precio))}
    quantity={item.quantity || 1}
    image={item.imagen}
    onRemove={() => handleRemoveItem(item.id)}
    onAddToFavorites={() => handleAddToFavorites(item.id)}
    onQuantityChange={(newQty) => handleQuantityChange(item.id, newQty)}
  />
))}
          </div>

          <div className="w-full lg:w-1/3 mt-6 lg:mt-0 space-y-6">
            <div className="border border-yellow-600 p-4 rounded-lg shadow-sm bg-white">
              <p className="text-xl font-semibold text-yellow-900">Resumen del pedido</p>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Precio</span>
                  <span className="text-yellow-900">${formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Ahorro</span>
                  <span className="text-green-600">-${formatPrice(discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Envío</span>
                  <span className="text-yellow-900">${formatPrice(shipping)}</span>
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
                    texts: { valueProp: 'smart_option' },
                    theme: 'dark',
                  }}
                  onReady={() => console.log("🟢 Wallet Brick listo")}
                  onError={(error) => {
                    console.error("🔴 Error en el Brick:", error);
                    setError("Error al cargar el botón de pago.");
                  }}
                />
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={loading || carrito.length === 0}
                  className={`w-full mt-4 py-2 px-4 text-white rounded-lg ${
                    loading || carrito.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-yellow-700 hover:bg-yellow-800'
                  }`}
                >
                  {loading ? 'Procesando...' : 'Proceder al pago'}
                </button>
              )}

              <div className="flex justify-center gap-2 mt-4">
                <span className="text-sm text-yellow-700">o</span>
                <Link
                  to="/Productos"
                  className="text-sm text-yellow-900 underline hover:text-yellow-800"
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