import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Package, Sparkles, ArrowRight, Phone } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { api } from "@/lib/api";
import { BRAND } from "@/lib/cafeData";

const STATUSES = [
  { key: "received", label: "Received", icon: CheckCircle2 },
  { key: "confirmed", label: "Confirmed", icon: Sparkles },
  { key: "ready", label: "Ready for Pickup", icon: Package },
  { key: "collected", label: "Collected", icon: Clock },
];

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    let timer;
    const load = async () => {
      try {
        const o = await api.getOrder(id);
        if (alive) setOrder(o);
      } catch (e) {
        if (alive) setError(e);
      }
    };
    load();
    timer = setInterval(load, 8000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [id]);

  const currentStep = order
    ? STATUSES.findIndex((s) => s.key === order.status)
    : 0;

  return (
    <div className="bg-[#FDFBF7] text-[#1F1F1F] font-body min-h-screen">
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar solid />

      <section className="relative bg-[#1E3F20] text-white pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-20 h-20 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-6"
          >
            <CheckCircle2 className="w-9 h-9 text-[#D4AF37]" />
          </motion.div>
          <p className="text-xs tracking-[0.4em] uppercase text-[#D4AF37]">
            — Order Confirmation
          </p>
          <h1 className="font-display text-4xl md:text-6xl mt-4 leading-[1.05]">
            Thank you.
            <br />
            <em className="text-[#D4AF37]">We're on it.</em>
          </h1>
          {order && (
            <p className="mt-6 text-white/80" data-testid="order-number">
              Order Number:{" "}
              <span className="font-display text-[#D4AF37] text-2xl">
                {order.order_number}
              </span>
            </p>
          )}
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 lg:px-10 py-16 md:py-20 space-y-16">
        {error && (
          <div className="text-center py-16">
            <p className="text-[#B4451D]">Order not found.</p>
            <Link
              to="/menu"
              className="mt-6 inline-flex items-center gap-2 text-sm tracking-widest uppercase text-[#1E3F20] border-b border-[#1E3F20] pb-1"
            >
              Back to Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {order && (
          <>
            {/* Progress */}
            <div className="border border-[#E8E2D9] p-6 md:p-10">
              <div className="grid grid-cols-4 gap-3 md:gap-6">
                {STATUSES.map((s, i) => {
                  const Active = s.icon;
                  const reached = i <= currentStep;
                  return (
                    <div
                      key={s.key}
                      data-testid={`status-step-${s.key}`}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center border ${
                          reached
                            ? "bg-[#1E3F20] border-[#1E3F20] text-[#D4AF37]"
                            : "border-[#E8E2D9] text-[#B8B0A2]"
                        }`}
                      >
                        <Active className="w-4 h-4" />
                      </div>
                      <p
                        className={`mt-3 text-[10px] tracking-widest uppercase ${
                          reached ? "text-[#1E3F20]" : "text-[#B8B0A2]"
                        }`}
                      >
                        {s.label}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-center text-sm text-[#5C5C5C]">
                Status updates automatically every few seconds.
              </p>
            </div>

            {/* Order items */}
            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-[#4A2E15] mb-4">
                — Your items
              </p>
              <div className="border border-[#E8E2D9] divide-y divide-[#E8E2D9]">
                {order.items.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-5"
                    data-testid={`order-item-${i}`}
                  >
                    <div>
                      <p className="text-[#1F1F1F]">
                        {it.qty} × {it.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C]">
                        {it.variant_label}
                      </p>
                    </div>
                    <p className="font-display text-lg text-[#1E3F20]">
                      {it.unit_price == null
                        ? "On pickup"
                        : `₹${it.unit_price * it.qty}`}
                    </p>
                  </div>
                ))}
                <div className="p-5 flex items-end justify-between bg-[#FAF8F5]">
                  <p className="text-xs uppercase tracking-widest text-[#4A2E15]">
                    Subtotal
                  </p>
                  <p className="font-display text-2xl text-[#1E3F20]">
                    ₹{order.subtotal}
                  </p>
                </div>
              </div>
              {order.has_pickup_pricing && (
                <p className="mt-3 text-[11px] italic text-[#5C5C5C]">
                  Some items are priced at pickup — the counter will confirm
                  the final amount.
                </p>
              )}
            </div>

            {/* Contact */}
            <div className="border-t border-[#E8E2D9] pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#4A2E15]">
                  Questions?
                </p>
                <p className="text-[#1E3F20] text-lg">Call the counter directly</p>
              </div>
              <a
                href={BRAND.phoneHref}
                className="inline-flex items-center gap-3 border border-[#1E3F20] px-6 py-3 text-sm tracking-widest uppercase text-[#1E3F20] hover:bg-[#1E3F20] hover:text-white"
              >
                <Phone className="w-4 h-4" /> {BRAND.phone}
              </a>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
