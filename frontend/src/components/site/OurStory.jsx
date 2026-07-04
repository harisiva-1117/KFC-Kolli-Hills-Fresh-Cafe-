import { motion } from "framer-motion";
import { Coffee, Leaf, Mountain } from "lucide-react";

const STORY_PARAS = [
  "Every journey to Kolli Hills is filled with anticipation — winding roads, breathtaking landscapes, fresh mountain air, and moments waiting to be discovered. Along the way, every traveller deserves a place to pause, recharge, and enjoy the authentic flavours of the hills.",
  "Kolli Hills Fresh Cafe was created to be that place. More than just a café, we are a welcoming stop where freshness meets hospitality — whether you crave a perfectly brewed cup of coffee, a refreshing glass of fresh juice, a delicious sandwich, a creamy milkshake, or a quick snack before continuing your journey.",
  "Beyond our café favourites, we proudly offer authentic Kolli Hills specialties — natural honey, premium spices, dry fruits and locally inspired products. Place your order online before arriving; we prepare it fresh and have it ready when you reach the cafe.",
];

const STATS = [
  { icon: Coffee, k: "24 / 7", v: "Always open" },
  { icon: Leaf, k: "15+", v: "Hill categories" },
  { icon: Mountain, k: "10–15", v: "Minutes to pickup" },
];

export const OurStory = () => {
  return (
    <section
      id="story"
      data-testid="story-section"
      className="relative py-24 md:py-36 bg-[#FDFBF7] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Image collage */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1567726843492-df0484bb0b05?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwbGFudGF0aW9uJTIwbWlzdHxlbnwwfHx8fDE3ODMxMzg1OTN8MA&ixlib=rb-4.1.0&q=85"
              alt="Kolli Hills mountains"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40, x: -20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute -bottom-10 -right-4 md:-right-10 w-40 md:w-56 aspect-square overflow-hidden border-[10px] border-[#FDFBF7] shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxwdXJlJTIwaG9uZXklMjBqYXJ8ZW58MHx8fHwxNzgzMTM4NTg2fDA&ixlib=rb-4.1.0&q=85"
              alt="Wild honey jar"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute -top-6 -left-4 md:-left-8 font-display italic text-[#D4AF37]/40 text-[120px] md:text-[180px] leading-none pointer-events-none select-none">
            “
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-[0.4em] uppercase text-[#4A2E15] mb-6"
          >
            — Our Story
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1E3F20] leading-[1.05]"
          >
            Where every journey finds its <em className="text-[#4A2E15]">perfect pause.</em>
          </motion.h2>

          <div className="mt-10 space-y-6">
            {STORY_PARAS.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.1 }}
                className="text-[#3f3f3f] text-base md:text-[17px] leading-[1.85] max-w-2xl"
              >
                {p}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl"
          >
            {STATS.map(({ icon: Icon, k, v }) => (
              <div
                key={k}
                className="border-t border-[#E8E2D9] pt-5"
                data-testid={`story-stat-${k}`}
              >
                <Icon className="w-5 h-5 text-[#D4AF37] mb-3" />
                <p className="font-display text-2xl md:text-3xl text-[#1E3F20]">
                  {k}
                </p>
                <p className="text-xs uppercase tracking-widest text-[#5C5C5C] mt-1">
                  {v}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
