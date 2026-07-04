import { motion } from "framer-motion";
import { GALLERY } from "@/lib/cafeData";

// Bento layout classes for masonry feel
const layout = [
  "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto",
  "aspect-[4/5]",
  "aspect-[4/5]",
  "md:col-span-2 aspect-[16/9]",
  "aspect-[4/5]",
  "aspect-[4/5]",
];

export const Gallery = () => {
  return (
    <section
      id="gallery"
      data-testid="gallery-section"
      className="relative py-24 md:py-32 bg-[#FAF8F5]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-xs tracking-[0.4em] uppercase text-[#4A2E15] mb-4"
            >
              — From the Cafe
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1E3F20] max-w-3xl leading-[1.05]"
            >
              A little peek inside our world.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#5C5C5C] max-w-md text-base leading-relaxed"
          >
            Real moments from our shelves, our counter, and the misty roads of
            Kolli Hills that lead you here.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {GALLERY.slice(0, 6).map((src, i) => (
            <motion.div
              key={src}
              data-testid={`gallery-item-${i}`}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden bg-[#1E3F20]/5 ${layout[i]}`}
            >
              <img
                src={src}
                alt={`Kolli Hills Fresh Cafe gallery ${i + 1}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3F20]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <p className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]">
                  Karavalli
                </p>
                <p className="font-display text-lg">Kolli Hills Fresh Cafe</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
