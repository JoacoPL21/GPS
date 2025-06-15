import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    setTotal(cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0));
  }, [cart]);

  // Funciones utilitarias
  const addToCart = (producto) => {
    setCart(prev => {
      const found = prev.find(item => item.id === producto.id);
      //ya existe el producto en el carrito por lo que se actualiza la cantidad
      if (found) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + producto.cantidad }
            : item
        );
      }
      return [...prev, producto];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const updateQuantity = (id, cantidad) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cantidad } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{
      cart,
      total,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
}