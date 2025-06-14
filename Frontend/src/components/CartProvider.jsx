'use client';

import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [open, setOpen] = useState(false);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const index = prev.findIndex(item => item.id === producto.id);

      if (index !== -1) {
        // Si el producto ya existe, aumentar la cantidad
        const nuevoCarrito = [...prev];
        nuevoCarrito[index].cantidad += 1;
        return nuevoCarrito;
      } else {
        // Si no existe, agregarlo con cantidad = 1
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  const aumentarCantidad = (id) => {
  setCarrito((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    )
  );
};

const disminuirCantidad = (id) => {
  setCarrito((prev) =>
    prev
      .map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
      )
      .filter((item) => item.cantidad > 0)
  );
};

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{
      carrito,
      agregarAlCarrito,
      eliminarDelCarrito,
      open,
      setOpen,
      aumentarCantidad,
      disminuirCantidad,
      total,
    }}>
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);