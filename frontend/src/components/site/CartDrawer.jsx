import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export const CartDrawer = ({ open, onClose }) => {
  const { items, subtotal, hasNullPrice, inc, dec, remove } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0E1A0F]/60 backdrop-blur-sm z-[60]"
            data-testid="cart-backdrop"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[440px] bg-[#FDFBF7] border-l border-[#E8E2D9] flex flex-col"
            data-testid="cart-drawer"
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2D9]">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-[#4A2E15]">
                  Your Basket
                </p>
                <h3 className="font-display text-2xl text-[#1E3F20]">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </h3>
              </div>
              <button
                onClick={onClose}
                data-testid="cart-close"
                className="w-10 h-10 flex items-center justify-center hover:bg-[#FAF8F5]"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-[#1E3F20]" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-24">
                  <ShoppingBag className="w-10 h-10 text-[#D4AF37] mb-6" />
                  <p className="font-display text-2xl text-[#1E3F20] mb-2">
                    Your basket is empty
                  </p>
                  <p className="text-sm text-[#5C5C5C] max-w-[240px]">
                    Add a coffee, a sandwich or some hill honey to begin.
                  </p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((it) => (
                    <li
                      key={it.key}
                      data-testid={`cart-item-${it.slug}`}
                      className="flex gap-4 border-b border-[#E8E2D9] pb-5"
                    >
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-20 h-20 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-display text-lg text-[#1F1F1F] leading-tight truncate">
                              {it.name}
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] mt-1">
                              {it.variant_label}
                            </p>
                          </div>
                          <button
                            onClick={() => remove(it.key)}
                            data-testid={`cart-remove-${it.slug}`}
                            className="text-[#5C5C5C] hover:text-[#4A2E15]"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-[#E8E2D9]">
                            <button
                              onClick={() => dec(it.key)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#FAF8F5]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm">
                              {it.qty}
                            </span>
                            <button
                              onClick={() => inc(it.key)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#FAF8F5]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-display text-lg text-[#1E3F20]">
                            {it.unit_price == null
                              ? "On pickup"
                              : `₹${it.unit_price * it.qty}`}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-[#E8E2D9] px-6 py-6 space-y-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#4A2E15]">
                      Subtotal
                    </p>
                    <p className="font-display text-3xl text-[#1E3F20]" data-testid="cart-subtotal">
                      ₹{subtotal}
                    </p>
                  </div>
                  {hasNullPrice && (
                    <p className="text-[11px] italic text-[#5C5C5C] max-w-[200px] text-right leading-snug">
                      Some items priced at pickup.
                    </p>
                  )}
                </div>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  data-testid="cart-checkout-btn"
                  className="group w-full inline-flex items-center justify-center gap-3 bg-[#1E3F20] text-white px-6 py-4 text-sm tracking-widest uppercase hover:bg-[#152C16] transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export const CartButton = ({ onOpen }) => {
  const { count } = useCart();
  return (
    <button
      onClick={onOpen}
      data-testid="cart-open-btn"
      className="relative w-10 h-10 flex items-center justify-center"
      aria-label="Open cart"
    >
      <ShoppingBag className="w-5 h-5" />
      {count > 0 && (
        <span
          data-testid="cart-count-badge"
          className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#1F1F1F] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
        >
          {count}
        </span>
      )}
    </button>
  );
};

export function useCartDrawer() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}

export default CartDrawer;
