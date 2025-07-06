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
    console.log("🔄 Reducer ejecutado con acción:", action.type);
    console.log("📦 Payload:", action.payload);
    console.log("🛒 Estado actual del carrito:", state.cart);

    switch (action.type) {
      case 'ADD_ITEM': {
        console.log("➕ Agregando item:", action.payload);
        // Cambiar item.id por item.id_producto
        const existingItem = state.cart.find(item => item.id_producto === action.payload.id_producto);
        
        if (existingItem) {
          console.log("✅ Item existente encontrado, aumentando cantidad");
          const newState = {
            ...state,
            cart: state.cart.map(item =>
              item.id_producto === action.payload.id_producto
                ? { ...item, cantidad: (item.cantidad || 1) + 1 }
                : item
            ),
          };
          console.log("🔄 Nuevo estado:", newState.cart);
          return newState;
        } else {
          console.log("🆕 Item nuevo, agregando al carrito");
          const newState = {
            ...state,
            cart: [...state.cart, { ...action.payload, cantidad: 1 }],
          };
          console.log("🔄 Nuevo estado:", newState.cart);
          return newState;
        }
      }
      case 'REMOVE_ITEM': {
        console.log("🗑️ Eliminando item con ID:", action.payload.id_producto);
        return {
          ...state,
          cart: state.cart.filter(item => item.id_producto !== action.payload.id_producto),
        };
      }
      case 'INCREASE_QUANTITY': {
        console.log("⬆️ Aumentando cantidad para ID:", action.payload.id);
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id_producto === action.payload.id
              ? { ...item, cantidad: (item.cantidad || 1) + 1 }
              : item
          ),
        };
      }
      case 'DECREASE_QUANTITY': {
        console.log("⬇️ Disminuyendo cantidad para ID:", action.payload.id);
        return {
          ...state,
          cart: state.cart
            .map(item =>
              item.id_producto === action.payload.id
                ? { ...item, cantidad: Math.max((item.cantidad || 1) - 1, 0) }
                : item
            )
            .filter(item => item.cantidad > 0),
        };
      }
      case 'CLEAR_CART':
        console.log("🧹 Limpiando carrito");
        return {
          ...state,
          cart: [],
          total: 0,
        };
      default:
        console.log("❌ Acción no reconocida:", action.type);
        return state;
    }
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItemToCart = (item) => {
    console.log("🛒 addItemToCart llamado con:", item);
    console.log("🆔 ID del producto:", item.id_producto); // Cambiar item.id por item.id_producto
    console.log("📝 Nombre del producto:", item.nombre);
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItemFromCart = (item) => {
    console.log("🗑️ removeItemFromCart llamado con:", item);
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  };

  const increaseQuantity = (id) => {
    console.log("⬆️ increaseQuantity llamado con ID:", id);
    dispatch({ type: 'INCREASE_QUANTITY', payload: { id } });
  };

  const decreaseQuantity = (id) => {
    console.log("⬇️ decreaseQuantity llamado con ID:", id);
    dispatch({ type: 'DECREASE_QUANTITY', payload: { id } });
  };

  const clearCart = () => {
    console.log("🧹 clearCart llamado");
    dispatch({ type: 'CLEAR_CART' });
  };

  // Calcular total
  const total = state.cart.reduce(
    (acc, item) => acc + (Number(item.precio?.toString().replace(/\./g, '') || 0) * (item.cantidad || 1)), 
    0
  );

  console.log("📊 Estado final del carrito:", state.cart);
  console.log("💰 Total calculado:", total);

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