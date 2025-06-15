import { createContext, useContext,  } from "react";
import { useReducer } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {


  // establece el estado inicial del carrito y el total
  const initialState = {
    cart: [],
    total: 0,
  };

  // Reducer para manejar las acciones del carrito que recibe el estado del carrito y una acción a realizar
  const cartReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_ITEM':
        return {
          ...state,
          cart: [...state.cart, action.payload],
          total: state.total + action.payload.price,
        };
      case 'REMOVE_ITEM':{
        const updatedCart = state.cart.filter(item => item.id !== action.payload.id);
        const itemToRemove = state.cart.find(item => item.id === action.payload.id);
        return {
          ...state,
          cart: updatedCart,
          total: state.total - (itemToRemove ? itemToRemove.price : 0),
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

  // Usamos useReducer para manejar el estado del carrito
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Funciones para interactuar con el carrito
  const addItemToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItemFromCart = (item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  }
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Con esto proporcionamos el estado del carrito y las funciones para interactuar con él a través del contexto



 
  return (
    <CartContext.Provider value={{
      cart: state.cart,
      total: state.total,
      addItemToCart,
      removeItemFromCart,
      clearCart,
      dispatch, // Proporcionamos el dispatch para que se pueda usar en componentes hijos si es necesario
      
    }}>
      {children}
    </CartContext.Provider>
  );
}