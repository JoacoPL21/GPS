// VERSIÓN OPTIMIZADA PARA RENDIMIENTO
import { createContext, useContext, useEffect, useReducer, useCallback, useRef } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

// Función throttle optimizada para operaciones frecuentes
const useThrottle = (func, delay) => {
  const timeoutRef = useRef(null);
  const lastCallRef = useRef(0);
  
  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastCallRef.current >= delay) {
      // Ejecutar inmediatamente si ha pasado suficiente tiempo
      lastCallRef.current = now;
      func(...args);
    } else {
      // Programar para ejecutar después del delay restante
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        func(...args);
      }, delay - (now - lastCallRef.current));
    }
  }, [func, delay]);
};

// Función debounce ligera para operaciones menos frecuentes
const useLightDebounce = (func, delay) => {
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }, [func, delay]);
};

// Reducer optimizado para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.cart.findIndex(item => item.id_producto === action.payload.id_producto);
      
      if (existingItemIndex >= 0) {
        // Si el item ya existe, sumar la cantidad nueva
        const updatedCart = [...state.cart];
        const cantidadAAgregar = action.payload.cantidad || 1;
        updatedCart[existingItemIndex].cantidad += cantidadAAgregar;
        
        return {
          ...state,
          cart: updatedCart,
          total: state.total + (action.payload.precio * cantidadAAgregar),
        };
      } else {
        // Si es un nuevo item, usar la cantidad especificada
        const newItem = {
          ...action.payload,
          cantidad: action.payload.cantidad || 1
        };
        
        return {
          ...state,
          cart: [...state.cart, newItem],
          total: state.total + (action.payload.precio * newItem.cantidad),
        };
      }
    }
    case 'REMOVE_ITEM': {
      const itemToRemove = state.cart.find(item => item.id_producto === action.payload.id_producto);
      if (!itemToRemove) return state;
      
      const updatedCart = state.cart.filter(item => item.id_producto !== action.payload.id_producto);
      
      return {
        ...state,
        cart: updatedCart,
        total: state.total - (itemToRemove.precio * itemToRemove.cantidad),
      };
    }
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
        total: 0,
      };
    case 'INCREMENT_QUANTITY': {
      const itemIndex = state.cart.findIndex(item => item.id_producto === action.payload.id_producto);
      if (itemIndex < 0) return state;
      
      const updatedCart = [...state.cart];
      const currentItem = updatedCart[itemIndex];
      
      updatedCart[itemIndex] = {
        ...currentItem,
        cantidad: currentItem.cantidad + 1
      };
      
      return {
        ...state,
        cart: updatedCart,
        total: state.total + currentItem.precio,
      };
    }
    case 'DECREMENT_QUANTITY': {
      const itemIndex = state.cart.findIndex(item => item.id_producto === action.payload.id_producto);
      if (itemIndex < 0) return state;
      
      const updatedCart = [...state.cart];
      const currentItem = updatedCart[itemIndex];
      
      if (currentItem.cantidad > 1) {
        updatedCart[itemIndex] = {
          ...currentItem,
          cantidad: currentItem.cantidad - 1
        };
        
        return {
          ...state,
          cart: updatedCart,
          total: state.total - currentItem.precio,
        };
      } else {
        // Si cantidad es 1, eliminar el item
        const newCart = updatedCart.filter(item => item.id_producto !== action.payload.id_producto);
        
        return {
          ...state,
          cart: newCart,
          total: state.total - currentItem.precio,
        };
      }
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
    total: initialCart.reduce((acc, item) => acc + (item.precio * (item.cantidad || 1)), 0),
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Optimizar localStorage con debounce solo para escritura
  const saveToLocalStorage = useCallback(() => {
    const authUser = localStorage.getItem('user');
    if (authUser) {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    } else {
      localStorage.setItem('anonymous-cart', JSON.stringify(state.cart));
    }
  }, [state.cart]);

  const debouncedSave = useLightDebounce(saveToLocalStorage, 300);

  useEffect(() => {
    debouncedSave();
  }, [debouncedSave]);

  // Funciones base optimizadas para interactuar con el carrito
  const addItemToCartBase = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItemFromCartBase = useCallback((item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  }, []);

  const clearCartBase = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const incrementItemQuantityBase = useCallback((id_producto) => {
    dispatch({ type: 'INCREMENT_QUANTITY', payload: {id_producto} });
  }, []);

  const decrementItemQuantityBase = useCallback((id_producto) => {
    dispatch({ type: 'DECREMENT_QUANTITY', payload: {id_producto} });
  }, []);

  // Funciones optimizadas con throttle/debounce apropiados
  const addItemToCart = useLightDebounce(addItemToCartBase, 100); // Reducido a 100ms
  const removeItemFromCart = useLightDebounce(removeItemFromCartBase, 100); // Reducido a 100ms
  const clearCart = useLightDebounce(clearCartBase, 150);
  
  // Para incremento/decremento usar throttle para respuesta más rápida
  const incrementItemQuantity = useThrottle(incrementItemQuantityBase, 50); // Throttle de 50ms
  const decrementItemQuantity = useThrottle(decrementItemQuantityBase, 50); // Throttle de 50ms

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