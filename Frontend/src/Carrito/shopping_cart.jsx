import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ 
  title, 
  price, 
  quantity,
  imageLight,
  imageDark,
  onRemove,
  onAddToFavorites,
  onQuantityChange
}) => {
  const isMinusDisabled = quantity <= 1;
  const isPlusDisabled = quantity >= 10;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <a href="#" className="shrink-0 md:order-1">
          <img className="h-20 w-20 dark:hidden" src={imageLight} alt={title} />
          <img className="hidden h-20 w-20 dark:block" src={imageDark} alt={title} />
        </a>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center">
  <button
    type="button"
    onClick={() => onQuantityChange(quantity - 1)}
    disabled={isMinusDisabled}
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
      isMinusDisabled 
        ? 'text-gray-400 cursor-not-allowed dark:text-gray-500' 
        : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
    } focus:outline-none text-4xl font-bold`}
    aria-label="Disminuir cantidad"
  >
    -
  </button>
  
  <input
    type="text"
    className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
    value={quantity}
    readOnly
    aria-label="Cantidad"
  />
  
  <button
    type="button"
    onClick={() => onQuantityChange(quantity + 1)}
    disabled={isPlusDisabled}
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
      isPlusDisabled 
        ? 'text-gray-400 cursor-not-allowed dark:text-gray-500' 
        : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
    } focus:outline-none`}
    aria-label="Aumentar cantidad"
  >
    +
  </button>
</div>
          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-gray-900 dark:text-white">${price}</p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <a href="#" className="text-base font-medium text-gray-900 hover:underline dark:text-white">
            {title}
          </a>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onAddToFavorites}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
              </svg>
              Añadir a favoritos
            </button>

            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
            >
              <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
              </svg>
              Eliminar
            </button>
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
      imageLight:  "/images/picaro.jpg",
      imageDark: "/images/picaro.jpg"
    },
    {
      id: 2,
      title: "Jueguete de madera Tralalero",
      price: "4.000",
      quantity: 1,
      imageLight: "/images/tralalero.jpg",
      imageDark: "/images/tralalero.jpg"
    }
  ]);

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

  return (
    <section className="min-h-screen min-w-screen flex flex-col bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0 flex-grow">
        <div className="flex items-center gap-3 mb-6">
          <Link 
            to="/" 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <svg 
              className="w-6 h-6" 
              aria-hidden="true" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 14 10"
            >
              <path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
          </Link>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
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
                  imageLight={item.imageLight}
                  imageDark={item.imageDark}
                  onRemove={() => handleRemoveItem(item.id)}
                  onAddToFavorites={() => handleAddToFavorites(item.id)}
                  onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                />
              ))}
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">Resumen del pedido</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Precio</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">${formatPrice(subtotal)}</dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Ahorro</dt>
                    <dd className="text-base font-medium text-green-600">-${formatPrice(discount)}</dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Envio</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">${formatPrice(shipping)}</dd>
                  </dl>
                </div>

                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">${formatPrice(total)}</dd>
                </dl>
              </div>

              <button className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Proceder al pago
              </button>

              <div className="flex self-center w-100 justify-center gap-2">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> o </span>
                <Link 
                  to="/Productos" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                >
                  Volver al catalogo
                  <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
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