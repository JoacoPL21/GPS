import { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

// Reducer para manejar las acciones del carrito - MOVIDO AQUÍ
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.cart.findIndex(item => item.id_producto === action.payload.id_producto);
      
      if (existingItemIndex >= 0) {
        // Si el item ya existe, incrementar solo en 1
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].cantidad += 1; // ✅ Siempre +1
        
        return {
          ...state,
          cart: updatedCart,
          total: state.total + action.payload.precio,
        };
      } else {
        // Si es un nuevo item, agregarlo con cantidad 1
        const newItem = {
          ...action.payload,
          cantidad: 1 // ✅ Siempre 1 para nuevos items
        };
        
        return {
          ...state,
          cart: [...state.cart, newItem],
          total: state.total + action.payload.precio,
        };
      }
    }
    case 'REMOVE_ITEM': {
      // Cambiar 'id' por 'id_producto'
      const updatedCart = state.cart.filter(item => item.id_producto !== action.payload.id_producto);
      const itemToRemove = state.cart.find(item => item.id_producto === action.payload.id_producto);
      
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
    case 'INCREMENT_QUANTITY': {
      const itemIndex = state.cart.findIndex(item => item.id_producto === action.payload.id_producto); // ✅ Cambiar a id_producto
      if (itemIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[itemIndex].cantidad += 1;
        
        return {
          ...state,
          cart: updatedCart,
          total: state.total + updatedCart[itemIndex].precio,
        };
      }
      return state;
    }
    case 'DECREMENT_QUANTITY': {
      const itemIndex = state.cart.findIndex(item => item.id_producto === action.payload.id_producto); // ✅ Añadir este caso
      if (itemIndex >= 0) {
        const updatedCart = [...state.cart];
        if (updatedCart[itemIndex].cantidad > 1) {
          updatedCart[itemIndex].cantidad -= 1;
          
          return {
            ...state,
            cart: updatedCart,
            total: state.total - updatedCart[itemIndex].precio,
          };
        } else {
          // Si cantidad es 1, eliminar el item
          const itemToRemove = updatedCart[itemIndex];
          const newCart = updatedCart.filter(item => item.id_producto !== action.payload.id_producto);
          
          return {
            ...state,
            cart: newCart,
            total: state.total - itemToRemove.precio,
          };
        }
      }
      return state;
    }
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

  const initialCart = getInitialCart();
  const initialState = {
    cart: initialCart,
    total: initialCart.reduce((acc, item) => acc + (item.precio * (item.cantidad || 1)), 0), // Asegurarse de que cantidad sea al menos 1
  };

  // Ahora useReducer puede usar cartReducer porque ya está definido
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const authUser = localStorage.getItem('user');
    if (authUser) {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    } else {
      localStorage.setItem('anonymous-cart', JSON.stringify(state.cart));
    }
  }, [state.cart]);

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

  // Función para incrementar la cantidad de un item
  const incrementItemQuantity = (id_producto) => {
    dispatch({ type: 'INCREMENT_QUANTITY', payload: {id_producto} });
  }

  // Función para decrementar la cantidad de un item
  const decrementItemQuantity = (id_producto) => {
    dispatch({ type: 'DECREMENT_QUANTITY', payload: {id_producto} });
  }

  return (
    <CartContext.Provider value={{
      cart: state.cart,
      total: state.total,
      addItemToCart,
      removeItemFromCart,
      clearCart,
      dispatch,
      incrementItemQuantity, 
      decrementItemQuantity, 
    }}>
      {children}
    </CartContext.Provider>
  );
}