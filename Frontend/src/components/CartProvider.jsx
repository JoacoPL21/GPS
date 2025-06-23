'use client';

import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [open, setOpen] = useState(false);

  const agregarAlCarrito = (producto) => {
    console.log("Intentando agregar producto:", producto.id, producto.nombre);
    
    setCarrito((prev) => {
      console.log("Carrito actual:", prev);
      const itemExistente = prev.find(item => item.id === producto.id);

      if (itemExistente) {
        console.log("Producto existente encontrado. Actualizando cantidad...");
        return prev.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      } else {
        console.log("Producto nuevo. Agregando al carrito...");
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (id) => {
    console.log("Eliminando producto:", id);
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const aumentarCantidad = (id) => {
    console.log("Aumentando cantidad para:", id);
    setCarrito(prev =>
      prev.map(item =>
        item.id === id 
          ? { ...item, cantidad: item.cantidad + 1 } 
          : item
      )
    );
  };

  const disminuirCantidad = (id) => {
    console.log("Disminuyendo cantidad para:", id);
    setCarrito(prev =>
      prev
        .map(item =>
          item.id === id 
            ? { ...item, cantidad: item.cantidad - 1 } 
            : item
        )
        .filter(item => item.cantidad > 0) 
    );
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad, 
    0
  );

  console.log("Estado actual del carrito:", carrito);

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