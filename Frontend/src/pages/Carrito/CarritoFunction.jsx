"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { Fragment, useCallback } from "react";
import { X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const MenuCarrito = ({ open, setOpen }) => {
  const {
    cart,
    total,
    removeItemFromCart,
    incrementItemQuantity,
    decrementItemQuantity,
    // MANTENER COMPATIBILIDAD CON TUS FUNCIONES ORIGINALES
    dispatch,
    increaseQuantity,
    decreaseQuantity
  } = useCart();

  // FUNCIONES OPTIMIZADAS CON VALIDACIÓN DE STOCK
  const handleIncrement = useCallback((e, id_producto) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Buscar el producto en el carrito para validar stock
    const itemEnCarrito = cart.find(item => item.id_producto === id_producto);
    if (!itemEnCarrito) return;
    
    // Validar que no se exceda el stock disponible
    if (itemEnCarrito.cantidad >= itemEnCarrito.stock) {
      // Opcional: mostrar notificación de stock insuficiente
      console.warn(`No se puede agregar más cantidad. Stock disponible: ${itemEnCarrito.stock}`);
      return;
    }
    
    incrementItemQuantity(id_producto);
  }, [incrementItemQuantity, cart]);

  const handleDecrement = useCallback((e, id_producto) => {
    e.preventDefault();
    e.stopPropagation();
    decrementItemQuantity(id_producto);
  }, [decrementItemQuantity]);

  const handleRemove = useCallback((e, item) => {
    e.preventDefault();
    e.stopPropagation();
    removeItemFromCart(item);
  }, [removeItemFromCart]);

  // MANTENER TUS FUNCIONES ORIGINALES COMO FALLBACK
  const aumentarCantidad = useCallback((id) => {
    dispatch({ type: "INCREMENT_QUANTITY", payload: { id } });
  }, [dispatch]);

  const disminuirCantidad = useCallback((id) => {
    dispatch({ type: "DECREMENT_QUANTITY", payload: { id } });
  }, [dispatch]);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={() => setOpen(false)} className="relative z-40">
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-md bg-white shadow-xl">
                  <div className="flex h-full flex-col overflow-y-scroll">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-lg font-medium text-gray-900">
                          Carrito de Compras
                        </DialogTitle>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setOpen(false)}
                          onKeyDown={(e) =>
                            (e.key === "Enter" || e.key === " ") &&
                            setOpen(false)
                          }
                          className="text-white bg-yellow-700 p-2.5 rounded-3xl cursor-pointer"
                        >
                          <span className="sr-only">Cerrar</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {cart.length === 0 ? (
                            <p className="text-gray-500">
                              Tu carrito está vacío.
                            </p>
                          ) : (
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {cart.map((item) => {
                                // Validar si la cantidad actual excede el stock
                                const exceedeStock = item.cantidad > item.stock;
                                const stockDisponible = item.stock - item.cantidad;
                                
                                return (
                                  <li key={item.id_producto} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        src={item.imagen}
                                        alt={item.nombre}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>{item.nombre}</h3>
                                          <p className="ml-4">
                                            $
                                            {(
                                              item.precio * (item.cantidad || 1)
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                          Precio unitario: $
                                          {item.precio.toLocaleString()}
                                        </p>
                                        {/* Mostrar información de stock */}
                                        <p className="mt-1 text-xs text-gray-400">
                                          Stock disponible: {item.stock}
                                        </p>
                                        {exceedeStock && (
                                          <p className="mt-1 text-xs text-red-500">
                                            ⚠️ Cantidad excede stock disponible
                                          </p>
                                        )}
                                      </div>

                                      <div className="flex flex-1 items-end justify-between text-sm mt-2">
                                        <div className="flex items-center gap-2">
                                          {/* Botón decrementar */}
                                          <button
                                            type="button"
                                            onClick={(e) => handleDecrement(e, item.id_producto)}
                                            className="px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            disabled={item.cantidad <= 1}
                                          >
                                            -
                                          </button>
                                          <span className="mx-2 min-w-[2rem] text-center">
                                            {item.cantidad || 1}
                                          </span>
                                          {/* Botón incrementar con validación de stock */}
                                          <button
                                            type="button"
                                            onClick={(e) => handleIncrement(e, item.id_producto)}
                                            className={`px-2 py-1 text-white rounded focus:outline-none focus:ring-2 ${
                                              item.cantidad >= item.stock
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-yellow-600 hover:bg-yellow-500 cursor-pointer focus:ring-yellow-500'
                                            }`}
                                            disabled={item.cantidad >= item.stock}
                                            title={item.cantidad >= item.stock ? `Stock máximo: ${item.stock}` : 'Aumentar cantidad'}
                                          >
                                            +
                                          </button>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={(e) => handleRemove(e, item)}
                                          className="font-medium border-yellow-600 p-2 border-2 rounded-3xl text-yellow-700 hover:border-red-600 hover:text-red-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                          Eliminar
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {cart.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Total</p>
                          <p>${total.toLocaleString()}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Los impuestos se calculan al finalizar la compra.
                        </p>
                        {/* Validar si hay productos que exceden el stock antes de permitir checkout */}
                        {cart.some(item => item.cantidad > item.stock) && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-600">
                              ⚠️ Algunos productos exceden el stock disponible. 
                              Ajusta las cantidades antes de proceder al pago.
                            </p>
                          </div>
                        )}
                        <div className="mt-6">
                          <Link
                            to="/cart"
                            className={`flex w-full justify-center rounded-md px-6 py-3 text-base font-medium !text-white !no-underline shadow-sm ${
                              cart.some(item => item.cantidad > item.stock)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-yellow-700 hover:bg-yellow-600'
                            }`}
                            onClick={(e) => {
                              if (cart.some(item => item.cantidad > item.stock)) {
                                e.preventDefault();
                                return;
                              }
                              setOpen(false);
                            }}
                          >
                            Pagar
                          </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            o{" "}
                            <button
                              type="button"
                              onClick={() => setOpen(false)}
                              className="font-medium text-yellow-800 cursor-pointer bg-transparent border-none underline hover:text-yellow-600"
                            >
                              Continuar comprando
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogPanel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MenuCarrito;