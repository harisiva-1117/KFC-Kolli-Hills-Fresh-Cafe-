import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCategories } from "@/lib/hooks";

const Card = ({ item, index, span }) => (
  <motion.a
    href="#best-sellers"
    data-testid={`category-card-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    className={`group relative block overflow-hidden bg-[#FAF8F5] border border-[#E8E2D9] aspect-[4/5] ${span}`}
  >
    <img
      src={item.image}
      alt={item.name}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1E3F20]/85 via-[#1E3F20]/20 to-transparent" />
    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FDFBF7]/90 backdrop-blur flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
      <ArrowUpRight className="w-4 h-4 text-[#1E3F20]" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
      <p className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-2">
        {item.tag}
      </p>
      <h3 className="font-display text-2xl leading-tight">
        <span className="gold-underline pb-1">{item.name}</span>
      </h3>
    </div>
  </motion.a>
);

// uniform grid — no spans to keep card heights consistent
const spans = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

export const Categories = () => {
  const { data: categories, loading } = useCategories();
  return (
    <section
      id="categories"
      data-testid="categories-section"
      className="relative py-24 md:py-32 bg-[#FDFBF7]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.4em] uppercase text-[#4A2E15] mb-4">
              — Our Menu
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1E3F20] max-w-3xl leading-[1.05]">
              From misty mornings to <em className="text-[#4A2E15]">midnight cravings</em>.
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-[#5C5C5C] max-w-md text-base leading-relaxed"
          >
            Fifteen carefully curated categories — brewed, baked and blended
            fresh, plus authentic hill produce you can carry back home.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                data-testid={`category-skeleton-${i}`}
                className="aspect-[4/5] bg-[#F0EBE3] animate-pulse"
              />
            ))}
          {!loading &&
            categories.map((c, i) => (
              <Card key={c.slug} item={c} index={i} span={spans[i] || ""} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
