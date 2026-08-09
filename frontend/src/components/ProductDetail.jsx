import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

export default function ProductDetail({ activeProduct, section }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  if (section === "material") {
    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex flex-col md:flex-row items-center justify-center p-8 md:p-24 gap-12"
      >
        <motion.div 
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img 
            src={activeProduct.macroImage} 
            alt="Material Macro" 
            className="w-full max-w-[500px] aspect-square object-cover rounded-sm drop-shadow-xl"
          />
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 space-y-6"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase opacity-60">Material</p>
          <h2 className="text-3xl md:text-5xl font-serif italic">{activeProduct.material}</h2>
          <p className="text-sm md:text-base leading-relaxed opacity-80 max-w-md">
            Woven to perfection. {activeProduct.careInstructions} {activeProduct.origin}.
          </p>
        </motion.div>
      </div>
    );
  }

  if (section === "specs") {
    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex flex-col md:flex-row items-center justify-center p-8 md:p-24 gap-16"
      >
        <motion.div 
          className="w-full md:w-1/2 space-y-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div>
            <p className="text-xs tracking-[0.3em] uppercase opacity-60 mb-6">Specifications</p>
            <ul className="space-y-4 border-t border-current/20 pt-6">
              <li className="flex justify-between border-b border-current/10 pb-4">
                <span className="opacity-80">Origin</span>
                <span className="font-medium">{activeProduct.origin}</span>
              </li>
              <li className="flex justify-between border-b border-current/10 pb-4">
                <span className="opacity-80">Colors</span>
                <span className="font-medium">{activeProduct.colors.map(c => c.name).join(", ")}</span>
              </li>
              <li className="flex justify-between border-b border-current/10 pb-4">
                <span className="opacity-80">Sizes</span>
                <span className="font-medium uppercase">{activeProduct.sizes.join(", ")}</span>
              </li>
            </ul>
          </div>
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 space-y-8"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase opacity-60">Customer Reviews</p>
          <div className="space-y-8">
            {activeProduct.reviews.map((review, i) => (
              <div key={i} className="space-y-2">
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-lg font-serif italic">"{review.text}"</p>
                <p className="text-xs opacity-60 uppercase tracking-widest">— {review.author}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
