import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(
        (i) => i.id === action.item.id && i.variant === action.item.variant
      );
      if (existing) {
        return state.map((i) =>
          i.id === action.item.id && i.variant === action.item.variant
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case "REMOVE":
      return state.filter(
        (i) => !(i.id === action.id && i.variant === action.variant)
      );
    case "UPDATE_QTY":
      return state.map((i) =>
        i.id === action.id && i.variant === action.variant
          ? { ...i, qty: Math.max(1, action.qty) }
          : i
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem("dwo_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("dwo_cart", JSON.stringify(items));
  }, [items]);

  function addToCart(item) {
    dispatch({ type: "ADD", item });
  }
  function removeFromCart(id, variant) {
    dispatch({ type: "REMOVE", id, variant });
  }
  function updateQty(id, variant, qty) {
    dispatch({ type: "UPDATE_QTY", id, variant, qty });
  }
  function clearCart() {
    dispatch({ type: "CLEAR" });
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
