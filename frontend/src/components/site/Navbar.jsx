import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { BRAND } from "@/lib/cafeData";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Menu", href: "#categories" },
  { label: "Best Sellers", href: "#best-sellers" },
  { label: "Our Story", href: "#story" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit", href: "#contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      data-testid="site-navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FDFBF7]/85 backdrop-blur-xl border-b border-[#E8E2D9]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <a href="#top" data-testid="navbar-logo" className="flex items-center gap-3">
          <img
            src={BRAND.logo}
            alt="Kolli Hills Fresh Cafe"
            className="h-11 w-11 rounded-full object-cover ring-1 ring-[#D4AF37]/40"
          />
          <div className="flex flex-col leading-none">
            <span
              className={`font-display text-lg tracking-tight ${
                scrolled ? "text-[#1E3F20]" : "text-white"
              }`}
            >
              Kolli Hills
            </span>
            <span
              className={`text-[10px] tracking-[0.3em] uppercase ${
                scrolled ? "text-[#5C5C5C]" : "text-white/70"
              }`}
            >
              Fresh Cafe
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`text-sm tracking-wide relative group ${
                scrolled ? "text-[#1F1F1F]" : "text-white"
              }`}
            >
              {l.label}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={BRAND.phoneHref}
            data-testid="navbar-call"
            className={`text-sm inline-flex items-center gap-2 ${
              scrolled ? "text-[#1E3F20]" : "text-white"
            }`}
          >
            <Phone className="w-4 h-4" />
            {BRAND.phone}
          </a>
          <a
            href="#best-sellers"
            data-testid="navbar-order-btn"
            className="inline-flex items-center gap-2 bg-[#1E3F20] text-white px-5 py-3 text-sm tracking-wide hover:bg-[#152C16] transition-colors"
          >
            Order Now
          </a>
        </div>

        <button
          data-testid="navbar-menu-toggle"
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden p-2 ${scrolled ? "text-[#1E3F20]" : "text-white"}`}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:hidden overflow-hidden bg-[#FDFBF7] border-t border-[#E8E2D9]"
          >
            <div className="flex flex-col p-6 gap-5">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-[#1F1F1F] text-base"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={BRAND.phoneHref}
                className="text-[#1E3F20] inline-flex items-center gap-2 text-sm"
              >
                <Phone className="w-4 h-4" /> {BRAND.phone}
              </a>
              <a
                href="#best-sellers"
                onClick={() => setOpen(false)}
                className="bg-[#1E3F20] text-white px-5 py-3 text-sm text-center"
              >
                Order Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
