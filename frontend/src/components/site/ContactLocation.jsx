import { motion } from "framer-motion";
import { Phone, Clock, MapPin, ArrowUpRight, Wallet, Package } from "lucide-react";
import { BRAND } from "@/lib/cafeData";

const InfoRow = ({ icon: Icon, label, value, testid }) => (
  <div
    data-testid={testid}
    className="flex items-start gap-4 py-5 border-b border-white/10"
  >
    <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-[#D4AF37]" />
    </div>
    <div>
      <p className="text-[11px] tracking-[0.3em] uppercase text-white/60">
        {label}
      </p>
      <p className="text-white text-base md:text-lg mt-1">{value}</p>
    </div>
  </div>
);

export const ContactLocation = () => {
  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative bg-[#1E3F20] text-white overflow-hidden"
    >
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #D4AF37 0px, transparent 1px), radial-gradient(circle at 80% 80%, #D4AF37 0px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 md:py-32 grid lg:grid-cols-12 gap-12">
        {/* Left: copy + info */}
        <div className="lg:col-span-6 xl:col-span-5">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-xs tracking-[0.4em] uppercase text-[#D4AF37] mb-5"
          >
            — Visit & Pickup
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]"
          >
            Find us on the road to <em className="text-[#D4AF37]">Kolli Hills.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-white/75 max-w-md leading-relaxed"
          >
            Order ahead, drive up, park, and pick up. Fresh, warm and waiting —
            any hour of the day or night.
          </motion.p>

          <div className="mt-10">
            <InfoRow
              icon={Phone}
              label="Call the counter"
              value={BRAND.phone}
              testid="contact-phone"
            />
            <InfoRow
              icon={Clock}
              label="Hours"
              value="Open 24 Hours · All days"
              testid="contact-hours"
            />
            <InfoRow
              icon={Package}
              label="Ordering"
              value="Pickup Only · Ready in 10–15 minutes"
              testid="contact-pickup"
            />
            <InfoRow
              icon={Wallet}
              label="Payment"
              value="Pay at counter"
              testid="contact-payment"
            />
            <InfoRow
              icon={MapPin}
              label="Where"
              value="Karavalli, Kolli Hills, Tamil Nadu"
              testid="contact-address"
            />
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href={BRAND.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="get-directions-btn"
              className="group inline-flex items-center justify-center gap-3 bg-[#D4AF37] text-[#1F1F1F] px-8 py-4 text-sm tracking-widest uppercase hover:bg-[#e6c157] transition-colors"
            >
              Get Directions
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <a
              href={BRAND.phoneHref}
              data-testid="contact-call-btn"
              className="inline-flex items-center justify-center gap-3 border border-white/40 text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-[#1E3F20] transition-colors"
            >
              <Phone className="w-4 h-4" /> Call Cafe
            </a>
          </div>
        </div>

        {/* Right: map */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="lg:col-span-6 xl:col-span-7"
        >
          <div className="relative h-full min-h-[420px] lg:min-h-[600px] border border-[#D4AF37]/30 overflow-hidden">
            <iframe
              title="Kolli Hills Fresh Cafe location"
              src={BRAND.mapsEmbed}
              className="absolute inset-0 w-full h-full grayscale-[0.2] contrast-[0.95]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="absolute top-4 left-4 bg-[#1E3F20]/90 backdrop-blur px-4 py-2 text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]">
              Karavalli · Kolli Hills
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactLocation;
