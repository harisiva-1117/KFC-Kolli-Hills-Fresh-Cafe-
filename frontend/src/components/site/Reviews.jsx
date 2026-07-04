import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { REVIEWS } from "@/lib/cafeData";

export const Reviews = () => {
  return (
    <section
      id="reviews"
      data-testid="reviews-section"
      className="relative py-24 md:py-32 bg-[#FDFBF7]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-xs tracking-[0.4em] uppercase text-[#4A2E15] mb-4"
          >
            — Traveller Notes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1E3F20] leading-[1.05]"
          >
            Warm words from the road.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {REVIEWS.map((r, i) => (
            <motion.blockquote
              key={r.name}
              data-testid={`review-card-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative p-8 md:p-10 bg-[#FAF8F5] border border-[#E8E2D9] ${
                i % 3 === 0 ? "md:translate-y-6" : ""
              }`}
            >
              <Quote className="w-8 h-8 text-[#D4AF37] mb-6" />
              <p className="font-display text-xl md:text-2xl text-[#1F1F1F] leading-relaxed italic">
                “{r.quote}”
              </p>
              <div className="mt-8 flex items-center justify-between border-t border-[#E8E2D9] pt-6">
                <div>
                  <p className="text-sm text-[#1E3F20] font-medium tracking-wide">
                    {r.name}
                  </p>
                  <p className="text-xs text-[#5C5C5C] uppercase tracking-widest mt-1">
                    {r.location}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star
                      key={k}
                      className="w-4 h-4 fill-[#D4AF37] stroke-[#D4AF37]"
                    />
                  ))}
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
