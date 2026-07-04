import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { BRAND } from "@/lib/cafeData";

const COLS = [
  {
    title: "Explore",
    links: [
      { l: "Home", h: "#top" },
      { l: "Categories", h: "#categories" },
      { l: "Best Sellers", h: "#best-sellers" },
      { l: "Our Story", h: "#story" },
      { l: "Gallery", h: "#gallery" },
    ],
  },
  {
    title: "Order",
    links: [
      { l: "How Pickup Works", h: "#contact" },
      { l: "Track Order (soon)", h: "#" },
      { l: "Menu (soon)", h: "#categories" },
      { l: "Kolli Hills Specials", h: "#categories" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-[#0E1A0F] text-white/80 pt-20 pb-8"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Big brand line */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="pb-16 border-b border-white/10"
        >
          <h3 className="font-display italic text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-white">
            Where every journey <br />
            finds its <span className="text-[#D4AF37]">perfect pause.</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 py-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src={BRAND.logo}
                alt="Kolli Hills Fresh Cafe"
                className="h-14 w-14 rounded-full ring-1 ring-[#D4AF37]/40"
              />
              <div>
                <p className="font-display text-2xl text-white">Kolli Hills</p>
                <p className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]">
                  Fresh Cafe · Karavalli
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-white/60 max-w-xs">
              A premium mountain cafe & general store on the winding road to
              Kolli Hills. Order ahead. Pick up fresh.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                data-testid="footer-instagram"
                className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#1F1F1F] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                data-testid="footer-facebook"
                className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#1F1F1F] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-6">
                {c.title}
              </p>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.l}>
                    <a
                      href={l.h}
                      className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors"
                    >
                      {l.l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-6">
              Contact
            </p>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] mt-0.5" />
                <a href={BRAND.phoneHref} data-testid="footer-phone">
                  {BRAND.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#D4AF37] mt-0.5" />
                Open 24 Hours
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5" />
                Karavalli, Kolli Hills, TN
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p data-testid="footer-copyright">
            © {new Date().getFullYear()} Kolli Hills Fresh Cafe · KFC Karavalli.
            All rights reserved.
          </p>
          <p className="tracking-widest uppercase">
            Crafted with care in the hills.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
