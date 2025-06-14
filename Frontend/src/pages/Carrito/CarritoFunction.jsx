'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ShoppingCart, X } from 'lucide-react';
import { useCarrito } from '../../components/CartProvider';
import { Link } from 'react-router-dom';

export default function Carrito() {
  const {
    carrito,
    eliminarDelCarrito,
    aumentarCantidad,
    disminuirCantidad,
    open,
    setOpen,
    total,
  } = useCarrito();

  return (
    <>
      {!open && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
          className="cursor-pointer fixed bottom-6 right-6 bg-yellow-700 p-4 rounded-full text-white shadow-lg flex items-center hover:bg-yellow-800 transition-colors z-50"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="ml-2">
            {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
          </span>
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-40"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
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
                          (e.key === "Enter" || e.key === " ") && setOpen(false)
                        }
                        className="text-white bg-yellow-700 p-2.5 rounded-3xl cursor-pointer"
                      >
                        <span className="sr-only">Cerrar</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {carrito.length === 0 ? (
                          <p className="text-gray-500">
                            Tu carrito está vacío.
                          </p>
                        ) : (
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {carrito.map((item) => (
                              <li key={item.id} className="flex py-6">
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
                                        ${(
                                          item.precio * item.cantidad
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      Precio unitario: $
                                      {item.precio.toLocaleString()}
                                    </p>
                                  </div>

                                  <div className="flex flex-1 items-end justify-between text-sm mt-2">
                                    <div className="flex items-center gap-2">
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                          disminuirCantidad(item.id)
                                        }
                                        onKeyDown={(e) =>
                                          (e.key === "Enter" ||
                                            e.key === " ") &&
                                          disminuirCantidad(item.id)
                                        }
                                        className="px-2 py-1 bg-yellow-600 p-3 text-white rounded hover:bg-yellow-500 cursor-pointer"
                                      >
                                        -
                                      </div>
                                      <span>{item.cantidad}</span>
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                          aumentarCantidad(item.id)
                                        }
                                        onKeyDown={(e) =>
                                          (e.key === "Enter" ||
                                            e.key === " ") &&
                                          aumentarCantidad(item.id)
                                        }
                                        className="px-2 py-1 bg-yellow-600 p-3 text-white rounded hover:bg-yellow-500 cursor-pointer"
                                      >
                                        +
                                      </div>
                                    </div>

                                    <div
                                      role="button"
                                      tabIndex={0}
                                      onClick={() =>
                                        eliminarDelCarrito(item.id)
                                      }
                                      onKeyDown={(e) =>
                                        (e.key === "Enter" || e.key === " ") &&
                                        eliminarDelCarrito(item.id)
                                      }
                                      className="font-medium border-yellow-600 p-2 border-2 rounded-3xl text-yellow-700 hover:border-red-600 hover:text-red-600 cursor-pointer"
                                    >
                                      Eliminar
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {carrito.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total</p>
                        <p>${total.toLocaleString()}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Los impuestos se calculan al finalizar la compra.
                      </p>
                      <div className="mt-6">
                        <Link
                          to="/cart"
                          className="flex w-full justify-center rounded-md bg-yellow-700 px-6 py-3 text-base font-medium !text-white !no-underline shadow-sm hover:bg-yellow-600"
                        >
                          Pagar
                        </Link>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          o{" "}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setOpen(false)}
                            onKeyDown={(e) =>
                              (e.key === "Enter" || e.key === " ") &&
                              setOpen(false)
                            }
                            className="font-medium text-yellow-800 cursor-pointer inline"
                          >
                            Continuar comprando
                            <span aria-hidden="true"> &rarr;</span>
                          </div>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}