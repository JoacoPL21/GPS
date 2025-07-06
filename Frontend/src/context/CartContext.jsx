import { createContext, useContext } from "react";
import { useReducer } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const initialState = {
    cart: [],
    total: 0,
  };

  const cartReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_ITEM': {
        const existingItem = state.cart.find(item => item.id === action.payload.id);
        if (existingItem) {
          return {
            ...state,
            cart: state.cart.map(item =>
              item.id === action.payload.id
                ? { ...item, cantidad: (item.cantidad || 1) + 1 }
                : item
            ),
          };
        }
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, cantidad: 1 }],
        };
      }
      case 'REMOVE_ITEM': {
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== action.payload.id),
        };
      }
      case 'INCREASE_QUANTITY': {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, cantidad: (item.cantidad || 1) + 1 }
              : item
          ),
        };
      }
      case 'DECREASE_QUANTITY': {
        return {
          ...state,
          cart: state.cart
            .map(item =>
              item.id === action.payload.id
                ? { ...item, cantidad: Math.max((item.cantidad || 1) - 1, 0) }
                : item
            )
            .filter(item => item.cantidad > 0),
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

  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItemToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItemFromCart = (item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  };

  const increaseQuantity = (id) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: { id } });
  };

  const decreaseQuantity = (id) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Calcular total
  const total = state.cart.reduce(
    (acc, item) => acc + (Number(item.precio?.toString().replace(/\./g, '') || 0) * (item.cantidad || 1)), 
    0
  );

  return (
    <CartContext.Provider value={{
      cart: state.cart,
      total,
      addItemToCart,
      removeItemFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      dispatch,
    }}>
      {children}
    </CartContext.Provider>
  );
}