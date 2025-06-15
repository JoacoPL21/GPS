'use client'

import { useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';


const productosDisponibles = [
    {
        id: 1,
        nombre: 'Caja tallada a mano',
        precio: 15000,
        imagen: '/images/picaro.jpg',
    },
    {
        id: 2,
        nombre: 'Escultura de roble',
        precio: 25000,
        imagen: '/images/tung.png',
    },
    {
        id: 3,
        nombre: 'Cuenco rústico',
        precio: 12000,
        imagen: '/images/tralalero.jpg',
    },
];

export default function CarritoDeCompras() {
  const [carrito, setCarrito] = useState([]);
  const [open, setOpen] = useState(false);

  
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => [...prev, producto]);
  };

  const eliminarDelCarrito = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Artesanías de Madera</h1>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 p-4 rounded-full text-white shadow-lg flex items-center hover:bg-blue-700 transition-colors"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="ml-2">{carrito.length}</span>
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
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
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Cerrar</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {carrito.length === 0 ? (
                          <p className="text-gray-500">Tu carrito está vacío.</p>
                        ) : (
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {carrito.map((item, index) => (
                              <li key={index} className="flex py-6">
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
                                      <p className="ml-4">${item.precio.toLocaleString()}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() => eliminarDelCarrito(index)}
                                        className="font-medium text-red-600 hover:text-red-500"
                                      >
                                        Eliminar
                                      </button>
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
                        <button
                          onClick={() => setOpen(false)}
                          className="flex w-full justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                        >
                          Pagar
                        </button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          o{' '}
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="font-medium text-blue-600 hover:text-blue-500"
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
            </div>
          </div>
        </div>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {productosDisponibles.map((producto) => (
          <div
            key={producto.id}
            className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center"
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
            <h2 className="text-xl font-semibold">{producto.nombre}</h2>
            <p className="text-gray-600 mb-4">${producto.precio.toLocaleString()}</p>
            <button
              onClick={() => agregarAlCarrito(producto)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center transition-colors"
            >
              <ShoppingCart className="mr-2 w-4 h-4" /> Agregar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}