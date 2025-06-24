import { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

// Reducer para manejar las acciones del carrito - MOVIDO AQUÍ
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.cart.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex >= 0) {
        // Si el item ya existe, actualizar la cantidad
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].cantidad += action.payload.cantidad;
        
        return {
          ...state,
          cart: updatedCart,
          total: state.total + (action.payload.precio * action.payload.cantidad),
        };
      } else {
        // Si es un nuevo item, agregarlo
        return {
          ...state,
          cart: [...state.cart, action.payload],
          total: state.total + (action.payload.precio * action.payload.cantidad),
        };
      }
    }
    case 'REMOVE_ITEM': {
      const updatedCart = state.cart.filter(item => item.id !== action.payload.id);
      const itemToRemove = state.cart.find(item => item.id === action.payload.id);
      
      return {
        ...state,
        cart: updatedCart,
        total: state.total - (itemToRemove ? itemToRemove.precio * itemToRemove.cantidad : 0),
      };
    }
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
        total: 0,
      };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const getInitialCart = () => {
    try {
      const authUser = localStorage.getItem('user');
      if (authUser) {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
      }
      const anonCart = localStorage.getItem('anonymous-cart');
      return anonCart ? JSON.parse(anonCart) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  };

  const initialState = {
    cart: getInitialCart(),
    total: getInitialCart().reduce((acc, item) => acc + (item.precio*item.cantidad), 0),
  };

  // Ahora useReducer puede usar cartReducer porque ya está definido
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Actualizar localStorage cuando cambie el estado del carrito
  useEffect(() => {
    try {
      const authUser = localStorage.getItem('user');
      if (authUser) {
        localStorage.setItem('cart', JSON.stringify(state.cart));
      } else {
        localStorage.setItem('anonymous-cart', JSON.stringify(state.cart));
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [state.cart]); // Dependencia cambiada a state.cart

  // Funciones para interactuar con el carrito
  const addItemToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItemFromCart = (item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{
      cart: state.cart,
      total: state.total,
      addItemToCart,
      removeItemFromCart,
      clearCart,
      dispatch,
    }}>
      {children}
    </CartContext.Provider>
  );
}