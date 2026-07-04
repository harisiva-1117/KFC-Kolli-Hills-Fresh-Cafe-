import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const KEY = "khfc_cart_v1";
const CartContext = createContext(null);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { items: [] };
  } catch {
    return { items: [] };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const { product, variant } = action;
      const key = `${product.slug}::${variant.label}`;
      const idx = state.items.findIndex((i) => i.key === key);
      if (idx >= 0) {
        const next = [...state.items];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return { items: next };
      }
      return {
        items: [
          ...state.items,
          {
            key,
            slug: product.slug,
            name: product.name,
            image: product.image,
            variant_label: variant.label,
            unit_price: variant.price,
            qty: 1,
          },
        ],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.key !== action.key) };
    case "INC":
      return {
        items: state.items.map((i) =>
          i.key === action.key ? { ...i, qty: i.qty + 1 } : i
        ),
      };
    case "DEC":
      return {
        items: state.items
          .map((i) => (i.key === action.key ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    dispatch({ type: "HYDRATE", state: load() });
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => {
    const subtotal = state.items.reduce(
      (sum, i) => sum + (i.unit_price != null ? i.unit_price * i.qty : 0),
      0
    );
    const hasNullPrice = state.items.some((i) => i.unit_price == null);
    const count = state.items.reduce((s, i) => s + i.qty, 0);
    return {
      items: state.items,
      subtotal,
      hasNullPrice,
      count,
      add: (product, variant) => dispatch({ type: "ADD", product, variant }),
      inc: (key) => dispatch({ type: "INC", key }),
      dec: (key) => dispatch({ type: "DEC", key }),
      remove: (key) => dispatch({ type: "REMOVE", key }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
