import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, Sparkles } from "lucide-react";
import { BRAND, HERO_IMAGE, CATEGORY_MARQUEE } from "@/lib/cafeData";

export const Hero = () => {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative min-h-screen w-full overflow-hidden bg-[#0E1A0F]"
    >
      {/* Background image */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img
          src={HERO_IMAGE}
          alt="Misty Kolli Hills mountains at sunrise"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E1A0F]/70 via-[#0E1A0F]/40 to-[#0E1A0F]/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A0F]/60 via-transparent to-[#0E1A0F]/60" />

      {/* Top badge */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute top-28 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 text-[#D4AF37] text-xs tracking-[0.4em] uppercase"
      >
        <span className="h-px w-10 bg-[#D4AF37]" />
        Karavalli · Kolli Hills · Tamil Nadu
        <span className="h-px w-10 bg-[#D4AF37]" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-10"
        >
          <div className="absolute -inset-6 rounded-full bg-[#D4AF37]/20 blur-2xl animate-pulse" />
          <img
            src={BRAND.logo}
            alt="Kolli Hills Fresh Cafe logo"
            className="relative w-40 h-40 md:w-48 md:h-48 rounded-full ring-4 ring-[#D4AF37]/60 shadow-[0_20px_80px_rgba(0,0,0,0.6)] bg-white/5"
          />
        </motion.div>

        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          data-testid="hero-headline"
          className="font-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-5xl"
        >
          Taste the <span className="italic text-[#D4AF37]">Freshness</span>
          <br /> of Kolli Hills
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          className="mt-8 text-white/85 max-w-2xl text-base md:text-lg leading-relaxed"
        >
          A warm mountain stop for travellers — brewed coffee, cold-pressed
          juices, hand-crafted sandwiches and authentic hill produce. Order
          ahead. Pick up fresh.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="#best-sellers"
            data-testid="hero-order-btn"
            className="group inline-flex items-center gap-3 bg-[#D4AF37] text-[#1F1F1F] px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-[#e6c157] transition-all duration-500"
          >
            Order for Pickup
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#categories"
            data-testid="hero-menu-btn"
            className="group inline-flex items-center gap-3 border border-white/60 text-white px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-[#1E3F20] transition-all duration-500"
          >
            Explore Menu
            <Sparkles className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Meta info bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-3 text-white/80 text-xs md:text-sm tracking-widest uppercase"
        >
          <span className="inline-flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" /> Open 24 Hours
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" /> Karavalli · Pickup Only
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Ready in 10–15 mins
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#marquee"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 flex flex-col items-center gap-2"
        data-testid="hero-scroll-indicator"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <span className="relative block w-px h-14 bg-white/30 overflow-hidden">
          <motion.span
            className="absolute inset-x-0 top-0 h-6 bg-[#D4AF37]"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>

      {/* Bottom marquee strip */}
      <div
        id="marquee"
        className="absolute bottom-0 left-0 right-0 z-10 bg-[#1E3F20]/95 border-t border-[#D4AF37]/20 overflow-hidden"
      >
        <div className="marquee-track flex whitespace-nowrap py-3 text-[#FDFBF7]/80 text-xs tracking-[0.35em] uppercase">
          {[...CATEGORY_MARQUEE, ...CATEGORY_MARQUEE].map((item, i) => (
            <span key={i} className="mx-8 inline-flex items-center gap-8">
              {item}
              <span className="text-[#D4AF37]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
