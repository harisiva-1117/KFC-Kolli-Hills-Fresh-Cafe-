import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import { toast } from "sonner";
import { useBestSellers } from "@/lib/hooks";

const ProductCard = ({ product, index }) => {
  const firstVariantLabel =
    product.variants && product.variants.length ? product.variants[0].label : null;
  const handleAdd = () => {
    toast.success(`${product.name} added`, {
      description:
        product.price === null || product.price === undefined
          ? "Final price will be confirmed before pickup."
          : `₹${product.price}${firstVariantLabel ? ` · ${firstVariantLabel}` : ""}`,
    });
  };

  return (
    <motion.article
      data-testid={`product-card-${product.slug}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-[#FDFBF7] border border-[#E8E2D9] flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF8F5]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-[#FDFBF7]/95 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest text-[#1E3F20]">
          {product.category_slug ? product.category_slug.replace(/-/g, " ") : ""}
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#1E3F20] text-[#D4AF37] px-3 py-1 text-xs">
          <Star className="w-3 h-3 fill-[#D4AF37] stroke-[#D4AF37]" />
          {Number(product.rating || 5).toFixed(1)}
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div>
          <h3 className="font-display text-2xl text-[#1F1F1F] leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-[#5C5C5C] mt-2 leading-relaxed">
            {product.note}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          {(product.variants || []).map((v) => (
            <span
              key={v.label}
              className="text-[11px] tracking-widest uppercase border border-[#E8E2D9] text-[#4A2E15] px-3 py-1"
            >
              {v.label}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between pt-4 border-t border-[#E8E2D9]">
          <div>
            {product.price === null || product.price === undefined ? (
              <>
                <p className="text-[10px] uppercase tracking-widest text-[#4A2E15]">
                  Price on pickup
                </p>
                <p className="text-sm text-[#5C5C5C] italic max-w-[180px] leading-snug">
                  Final price will be confirmed before pickup.
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] uppercase tracking-widest text-[#4A2E15]">
                  Starts at
                </p>
                <p className="font-display text-3xl text-[#1E3F20]">
                  ₹{product.price}
                </p>
              </>
            )}
          </div>
          <button
            onClick={handleAdd}
            data-testid={`add-to-cart-${product.slug}`}
            className="inline-flex items-center gap-2 bg-[#1E3F20] text-white px-4 py-3 text-xs tracking-widest uppercase hover:bg-[#152C16] transition-colors"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export const BestSellers = () => {
  const { data: products, loading } = useBestSellers();
  return (
    <section
      id="best-sellers"
      data-testid="bestsellers-section"
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
              — Travellers&apos; Favourites
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1E3F20] max-w-3xl leading-[1.05]"
            >
              The most-loved picks from the pass.
            </motion.h2>
          </div>
          <motion.a
            href="#categories"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm tracking-widest uppercase text-[#1E3F20] border-b border-[#1E3F20] pb-1 hover:text-[#4A2E15] hover:border-[#4A2E15] transition-colors self-start md:self-end"
          >
            See Full Menu →
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`ps-${i}`}
                data-testid={`bestseller-skeleton-${i}`}
                className="border border-[#E8E2D9] bg-[#FDFBF7]"
              >
                <div className="aspect-[4/3] bg-[#F0EBE3] animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-6 w-3/4 bg-[#F0EBE3] animate-pulse" />
                  <div className="h-4 w-full bg-[#F0EBE3] animate-pulse" />
                  <div className="h-10 w-1/3 bg-[#F0EBE3] animate-pulse" />
                </div>
              </div>
            ))}
          {!loading &&
            products.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
