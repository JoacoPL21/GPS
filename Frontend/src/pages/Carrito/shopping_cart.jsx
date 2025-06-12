import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
const mpPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY;

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
              onKeyDown={(e) => {
                if (!isMinusDisabled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onQuantityChange(quantity - 1);
                }
              }}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-600 ${
                isMinusDisabled 
                  ? 'text-white cursor-not-allowed' 
                  : 'text-white hover:bg-yellow-700 cursor-pointer'
              } focus:outline-none text-xl font-bold`}
            >
              -
            </div>
            
            <input
              type="text"
              className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-yellow-900 focus:outline-none focus:ring-0"
              value={quantity}
              readOnly
              aria-label="Cantidad"
            />
            
            <div
              role="button"
              tabIndex={0}
              aria-label="Aumentar cantidad"
              onClick={() => !isPlusDisabled && onQuantityChange(quantity + 1)}
              onKeyDown={(e) => {
                if (!isPlusDisabled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onQuantityChange(quantity + 1);
                }
              }}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-600 ${
                isPlusDisabled 
                  ? 'text-yellow-200 cursor-not-allowed' 
                  : 'text-white hover:bg-yellow-700 cursor-pointer'
              } focus:outline-none`}
            >
              +
            </div>
          </div>
          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-yellow-900">${price}</p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <div className="text-base font-medium">
            {title}
          </div>

          <div className="flex items-center gap-4">
            <div
              role="button"
              tabIndex={0}
              onClick={onAddToFavorites}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onAddToFavorites();
                }
              }}
              className="inline-flex items-center text-sm font-medium text-white bg-yellow-800 p-1.5 rounded-2xl hover:underline cursor-pointer"
            >
              <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
              </svg>
              Añadir a favoritos
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={onRemove}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onRemove();
                }
              }}
              className="inline-flex items-center text-sm font-medium border-red-700 border-2 rounded-2xl p-1.5 text-red-700 hover:text-red-900 hover:underline cursor-pointer"
            >
              <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
              </svg>
              Eliminar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Estatua tipica chilena Picaro...",
      price: "6.000",
      quantity: 1,
      image: "/images/picaro.jpg"
    },
    {
      id: 2,
      title: "Jueguete de madera Tralalero",
      price: "4.000",
      quantity: 1,
      image: "/images/tralalero.jpg"
    }
  ]);
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleAddToFavorites = (itemId) => {
    console.log('Adding to favorites:', itemId);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const clampedQuantity = Math.max(1, Math.min(10, newQuantity));
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: clampedQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price.replace(/\./g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const subtotal = calculateTotal();
  const discount = 2000;
  const shipping = 5000;
  const total = subtotal - discount + shipping;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Preparar los items para la preferencia
      const items = cartItems.map(item => ({
        title: item.title,
        unit_price: Number(item.price.replace(/\./g, '')),
        quantity: item.quantity,
      }));

      const response = await fetch('http://localhost:3000/api/payments/create_preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          external_reference: `ORD-${Date.now()}`, // Referencia única
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la preferencia de pago');
      }

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
    <section className="min-h-screen min-w-screen bg-white flex flex-col  py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0 flex-grow">
        <div className="flex items-center gap-3 mb-6">
          <Link 
            to="/" 
            className="text-yellow-700 hover:text-yellow-900 transition-colors"
          >
            <svg 
              className="w-6 h-6" 
              aria-hidden="true" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 14 10"
            >
              <path 
                stroke="#7c4a19" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
          </Link>
          <h2 className="text-xl font-semibold text-yellow-900 sm:text-2xl">
            Carrito de compras
          </h2>
        </div>

        <div className="mt-6 flex-grow sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  title={item.title}
                  price={formatPrice(Number(item.price.replace(/\./g, '')))}
                  quantity={item.quantity}
                  image={item.image}
                  onRemove={() => handleRemoveItem(item.id)}
                  onAddToFavorites={() => handleAddToFavorites(item.id)}
                  onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                />
              ))}
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-yellow-600 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-xl font-semibold text-yellow-900">Resumen del pedido</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-yellow-700">Precio</dt>
                    <dd className="text-base font-medium text-yellow-900">${formatPrice(subtotal)}</dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-yellow-700">Ahorro</dt>
                    <dd className="text-base font-medium text-green-600">-${formatPrice(discount)}</dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-yellow-700">Envio</dt>
                    <dd className="text-base font-medium text-yellow-900">${formatPrice(shipping)}</dd>
                  </dl>
                </div>

                <dl className="flex items-center justify-between gap-4 border-t border-yellow-600 pt-2">
                  <dt className="text-base font-bold text-yellow-900">Total</dt>
                  <dd className="text-base font-bold text-yellow-900">${formatPrice(total)}</dd>
                </dl>
              </div>

              {error && (
                <div className="text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {preferenceId ? (
                <div className="mercado-pago-button">
                  <Wallet 
  initialization={{ preferenceId }}
  customization={{ 
    texts: { valueProp: 'smart_option' },
    theme: 'dark', 
  }}
  onReady={() => {
    console.log("🟢 Wallet Brick listo");
    // Aquí podrías ocultar un loading si tenías uno antes de mostrar el botón
  }}
  onError={(error) => {
    console.error("🔴 Error en el Brick:", error);
    setError("Ocurrió un problema al cargar el botón de pago. Intenta nuevamente.");
  }}
  onSubmit={(formData) => {
    console.log("🟡 Se hizo clic en el botón Wallet:", formData);
    // Puedes mostrar un loading o redirigir al usuario si se confirma el pago
  }}
/>
                </div>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                  className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                    loading || cartItems.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-yellow-700 hover:bg-yellow-800 cursor-pointer'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    'Proceder al pago'
                  )}
                </button>
              )}

              <div className="flex self-center w-100 justify-center gap-2">
                <span className="text-sm font-normal text-yellow-700"> o </span>
                <Link 
                  to="/Productos" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-yellow-700 underline hover:no-underline hover:text-yellow-900"
                >
                  <p className='text-yellow-900'>Volver al catalogo</p>
                  <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="#7c4a19" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                  </svg>
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