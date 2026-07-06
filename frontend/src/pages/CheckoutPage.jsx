import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Package, Clock, Wallet } from "lucide-react";
import { toast, Toaster } from "sonner";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

const CheckoutPage = () => {
  const { items, subtotal, hasNullPrice, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validPhone = /^\+?[\d\s-]{10,15}$/.test(form.phone.trim());
  const canSubmit =
    items.length > 0 && form.name.trim().length >= 2 && validPhone && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
     const order = await api.createOrder({
  customer_name: form.name.trim(),
  customer_phone: form.phone.trim(),

  // Required by backend
  pickup_time: "ASAP",

  notes: form.notes.trim(),

  items: items.map((i) => ({
    product_slug: i.slug,
    variant_label: i.variant_label,
    quantity: i.qty,
    unit_price: i.unit_price,
  })),
});
      clear();
      toast.success("Order placed!", {
        description: `Order #${order.order_number}`,
      });
      navigate(`/order/${order.id}`);
    } catch (err) {
      toast.error("Could not place order", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FDFBF7] text-[#1F1F1F] font-body min-h-screen">
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar solid />

      <section className="relative bg-[#1E3F20] text-white pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#D4AF37] hover:text-white"
            data-testid="checkout-back-menu"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </Link>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mt-6">
            Almost there. <em className="text-[#D4AF37]">Confirm your pickup.</em>
          </h1>
          <p className="mt-4 max-w-xl text-white/75">
            Pay at the counter when you collect. We'll prepare everything fresh
            in 10–15 minutes.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-24 grid lg:grid-cols-5 gap-12">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 space-y-8"
          data-testid="checkout-form"
        >
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-[#4A2E15] mb-2">
              — Contact
            </p>
            <h2 className="font-display text-3xl text-[#1E3F20]">Your details</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                Full name
              </label>
              <input
                type="text"
                required
                data-testid="checkout-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full bg-transparent border-b border-[#1E3F20] py-3 text-lg focus:outline-none focus:border-[#D4AF37]"
                placeholder="e.g. Aditi Ramanathan"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                Mobile number
              </label>
              <input
                type="tel"
                required
                data-testid="checkout-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-2 w-full bg-transparent border-b border-[#1E3F20] py-3 text-lg focus:outline-none focus:border-[#D4AF37]"
                placeholder="+91 90801 31442"
              />
              {form.phone && !validPhone && (
                <p className="text-xs text-[#B4451D] mt-2">Enter a valid mobile number.</p>
              )}
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-[#4A2E15]">
                Notes for the counter (optional)
              </label>
              <textarea
                rows={3}
                data-testid="checkout-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="mt-2 w-full bg-transparent border border-[#E8E2D9] p-4 text-sm focus:outline-none focus:border-[#1E3F20]"
                placeholder="Anything we should know? (allergies, extra sugar, etc.)"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8E2D9]">
            {[
              { icon: Package, k: "Pickup", v: "Only" },
              { icon: Clock, k: "Ready", v: "10–15 min" },
              { icon: Wallet, k: "Pay", v: "At counter" },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k}>
                <Icon className="w-4 h-4 text-[#D4AF37] mb-2" />
                <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C]">
                  {k}
                </p>
                <p className="text-sm text-[#1F1F1F]">{v}</p>
              </div>
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={!canSubmit}
            data-testid="checkout-place-order"
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            className="w-full inline-flex items-center justify-center gap-3 bg-[#1E3F20] text-white px-8 py-5 text-sm tracking-widest uppercase disabled:opacity-40 hover:bg-[#152C16] transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Placing order…
              </>
            ) : (
              <>
                Place Pickup Order <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Order summary */}
        <aside className="lg:col-span-2 bg-[#FAF8F5] border border-[#E8E2D9] p-6 md:p-8 h-fit sticky top-24">
          <p className="text-xs tracking-[0.35em] uppercase text-[#4A2E15] mb-4">
            — Your order
          </p>
          {items.length === 0 ? (
            <p className="text-sm text-[#5C5C5C]">Your basket is empty.</p>
          ) : (
            <>
              <ul className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((i) => (
                  <li key={i.key} className="flex items-start justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="text-[#1F1F1F] truncate">
                        {i.qty} × {i.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C]">
                        {i.variant_label}
                      </p>
                    </div>
                    <p className="text-[#1E3F20] font-display text-base whitespace-nowrap">
                      {i.unit_price == null ? "On pickup" : `₹${i.unit_price * i.qty}`}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-[#E8E2D9] flex items-end justify-between">
                <p className="text-xs uppercase tracking-widest text-[#4A2E15]">
                  Subtotal
                </p>
                <p className="font-display text-3xl text-[#1E3F20]" data-testid="checkout-subtotal">
                  ₹{subtotal}
                </p>
              </div>
              {hasNullPrice && (
                <p className="mt-3 text-[11px] italic text-[#5C5C5C]">
                  Some items are priced at pickup — final total will be
                  confirmed at the counter.
                </p>
              )}
            </>
          )}
        </aside>
      </main>

      <Footer />
      <Toaster position="bottom-right" theme="light" toastOptions={{ style: { background: "#FDFBF7", color: "#1F1F1F", border: "1px solid #E8E2D9", borderRadius: 0 } }} />
    </div>
  );
};

export default CheckoutPage;
