import { createContext, useContext,useEffect  } from "react";
import { useReducer } from "react";

const CartContext = createContext();


export function useCart() {

  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const getInitialCart = () => {
    try {
      const authUser = localStorage.getItem('user');
      if (authUser) {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
      }
      // Si no hay usuario, usar carrito anónimo
      const anonCart = localStorage.getItem('anonymous-cart');
      return anonCart ? JSON.parse(anonCart) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  };

  const initialState = {
    cart: getInitialCart(),
    total: getInitialCart().reduce((acc, item) => acc + item.precio, 0),
  };

  // Usamos useReducer antes del useEffect
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


  // Reducer para manejar las acciones del carrito que recibe el estado del carrito y una acción a realizar
  const cartReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_ITEM':
        return {
          ...state,
          cart: [...state.cart, action.payload],
          total: state.total + action.payload.precio,
        };
      case 'REMOVE_ITEM':{
        const updatedCart = state.cart.filter(item => item.id !== action.payload.id);
        const itemToRemove = state.cart.find(item => item.id === action.payload.id);
        return {
          ...state,
          cart: updatedCart,
          total: state.total - (itemToRemove ? itemToRemove.precio : 0),
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