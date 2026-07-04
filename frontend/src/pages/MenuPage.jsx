import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Star, ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { CartDrawer, useCartDrawer } from "@/components/site/CartDrawer";
import { useCategories, useProducts } from "@/lib/hooks";
import { useCart } from "@/context/CartContext";

const VariantPicker = ({ product, onPick }) => {
  const [sel, setSel] = useState(0);
  const variants = product.variants && product.variants.length
    ? product.variants
    : [{ label: "Regular", price: product.price }];
  const v = variants[sel];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {variants.map((vv, i) => (
          <button
            key={vv.label}
            onClick={() => setSel(i)}
            data-testid={`variant-${product.slug}-${vv.label}`}
            className={`text-[11px] tracking-widest uppercase px-3 py-2 border transition-colors ${
              i === sel
                ? "bg-[#1E3F20] text-white border-[#1E3F20]"
                : "border-[#E8E2D9] text-[#4A2E15] hover:border-[#1E3F20]"
            }`}
          >
            {vv.label}
          </button>
        ))}
      </div>
      <div className="flex items-end justify-between pt-3 border-t border-[#E8E2D9]">
        <div>
          {v.price == null ? (
            <>
              <p className="text-[10px] uppercase tracking-widest text-[#4A2E15]">
                Price on pickup
              </p>
              <p className="text-xs text-[#5C5C5C] italic max-w-[180px] leading-snug">
                Final price will be confirmed before pickup.
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-widest text-[#4A2E15]">
                Price
              </p>
              <p className="font-display text-2xl text-[#1E3F20]">₹{v.price}</p>
            </>
          )}
        </div>
        <button
          onClick={() => onPick(v)}
          data-testid={`menu-add-${product.slug}`}
          className="inline-flex items-center gap-2 bg-[#1E3F20] text-white px-4 py-3 text-xs tracking-widest uppercase hover:bg-[#152C16]"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
    </div>
  );
};

const ProductTile = ({ product, index }) => {
  const { add } = useCart();
  const handleAdd = (variant) => {
    add(product, variant);
    toast.success(`${product.name} added`, {
      description:
        variant.price == null
          ? "Final price will be confirmed before pickup."
          : `₹${variant.price} · ${variant.label}`,
    });
  };
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-[#FDFBF7] border border-[#E8E2D9] flex flex-col overflow-hidden"
      data-testid={`menu-product-${product.slug}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#1E3F20] text-[#D4AF37] px-2 py-1 text-[11px]">
          <Star className="w-3 h-3 fill-[#D4AF37] stroke-[#D4AF37]" />
          {Number(product.rating || 5).toFixed(1)}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div>
          <h3 className="font-display text-xl text-[#1F1F1F] leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-[#5C5C5C] mt-1 leading-relaxed">
            {product.note}
          </p>
        </div>
        <VariantPicker product={product} onPick={handleAdd} />
      </div>
    </motion.article>
  );
};

const MenuPage = () => {
  const { data: categories } = useCategories();
  const { data: products, loading } = useProducts({});
  const { open, setOpen } = useCartDrawer();

  const grouped = useMemo(() => {
    const map = {};
    for (const p of products) {
      (map[p.category_slug] = map[p.category_slug] || []).push(p);
    }
    return map;
  }, [products]);

  const activeCategories = (categories || []).filter(
    (c) => (grouped[c.slug] || []).length > 0
  );

  return (
    <div className="bg-[#FDFBF7] text-[#1F1F1F] font-body min-h-screen">
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar onCartOpen={() => setOpen(true)} solid />

      {/* Hero band */}
      <section className="relative bg-[#1E3F20] text-white pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#D4AF37] hover:text-white"
            data-testid="menu-back-home"
          >
            <ArrowLeft className="w-4 h-4" /> Back Home
          </Link>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] mt-6 max-w-3xl">
            The Menu.
            <br />
            <em className="text-[#D4AF37]">Freshly made, mountain crafted.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-white/75">
            Browse every category. Add items to your basket, then place your
            pickup order — we'll have it ready in 10–15 minutes.
          </p>
        </div>
      </section>

      {/* Category nav */}
      <nav
        className="sticky top-20 z-30 bg-[#FDFBF7]/95 backdrop-blur border-b border-[#E8E2D9]"
        data-testid="menu-category-nav"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex gap-6 overflow-x-auto py-4 text-xs tracking-widest uppercase">
          {activeCategories.map((c) => (
            <a
              key={c.slug}
              href={`#cat-${c.slug}`}
              className="whitespace-nowrap text-[#1E3F20] hover:text-[#D4AF37]"
            >
              {c.name}
            </a>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-24 space-y-24">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={`sk-${i}`} className="h-40 bg-[#F0EBE3] animate-pulse" />
          ))}
        {!loading &&
          activeCategories.map((cat) => (
            <section id={`cat-${cat.slug}`} key={cat.slug} className="scroll-mt-32">
              <div className="mb-10 flex items-end justify-between gap-6 border-b border-[#E8E2D9] pb-6">
                <div>
                  <p className="text-xs tracking-[0.4em] uppercase text-[#4A2E15] mb-3">
                    — {cat.tag}
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl text-[#1E3F20]">
                    {cat.name}
                  </h2>
                </div>
                <p className="text-xs uppercase tracking-widest text-[#5C5C5C]">
                  {(grouped[cat.slug] || []).length} item
                  {(grouped[cat.slug] || []).length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {(grouped[cat.slug] || []).map((p, i) => (
                  <ProductTile key={p.slug} product={p} index={i} />
                ))}
              </div>
            </section>
          ))}
      </main>

      <Footer />
      <CartDrawer open={open} onClose={() => setOpen(false)} />
      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          style: {
            background: "#FDFBF7",
            color: "#1F1F1F",
            border: "1px solid #E8E2D9",
            borderRadius: 0,
          },
        }}
      />
    </div>
  );
};

export default MenuPage;
