import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { products } from "../data/products";

export default function ProductShowcase({ activeProduct, activeIndex, direction, onNext, onPrev, totalProducts }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(activeProduct.colors[0]);

  // Update selected color when product changes
  useEffect(() => {
    setSelectedColor(activeProduct.colors[0]);
    setSelectedSize(null);
  }, [activeProduct]);

  // Keyboard navigation support is now handled in App.jsx

  return (
    <motion.div
      className="relative w-full h-[100dvh] overflow-hidden flex items-center justify-center font-sans transition-colors duration-700"
      animate={{ 
        backgroundColor: activeProduct.themeColor,
        color: activeProduct.textColor 
      }}
    >
      {/* Floating header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 z-30">
        <span className="tracking-[0.2em] text-sm font-light">ATELIER</span>
        <nav className="text-sm space-x-8 hidden md:flex font-light tracking-wide">
          <span className="cursor-pointer hover:opacity-70 transition-opacity">Women</span>
          <span className="cursor-pointer hover:opacity-70 transition-opacity">Men</span>
          <span className="cursor-pointer hover:opacity-70 transition-opacity">Accessories</span>
        </nav>
      </div>

      {/* Swipe arrows */}
      <button
        onClick={onPrev}
        className="hidden md:block absolute left-10 top-1/2 -translate-y-1/2 z-30 opacity-40 hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={40} strokeWidth={1} />
      </button>
      <button
        onClick={onNext}
        className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2 z-30 opacity-40 hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={40} strokeWidth={1} />
      </button>

      {/* Garment image with swipe/drag */}
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        
        {/* Floor shadow ellipse for grounding the floating product */}
        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] md:w-[40%] h-[15vh] rounded-[100%] bg-black/10 blur-xl z-0" />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={activeProduct.id}
            src={activeProduct.image}
            alt={activeProduct.title}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -100) onNext();
              else if (info.offset.x > 100) onPrev();
            }}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 80 : -80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction > 0 ? -80 : 80, scale: 0.95 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 1, 0.5, 1] 
            }}
            className="h-[60vh] md:h-[85vh] w-auto object-contain z-10 cursor-grab active:cursor-grabbing select-none drop-shadow-2xl"
          />
        </AnimatePresence>
      </div>

      {/* Bottom-left: size + color pickers */}
      <div className="absolute bottom-24 md:bottom-12 left-6 md:left-12 z-30 space-y-5">
        <div className="flex gap-3">
          {activeProduct.colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => setSelectedColor(c)}
              className={`w-5 h-5 rounded-full border transition-all duration-300 ${
                selectedColor.hex === c.hex ? "scale-125 border-current opacity-100" : "scale-100 border-current/30 opacity-40 hover:opacity-70"
              }`}
              style={{ backgroundColor: c.hex }}
              aria-label={c.name}
            />
          ))}
        </div>
        <div className="flex gap-4">
          {activeProduct.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`text-sm tracking-widest pb-1 border-b transition-colors font-light ${
                selectedSize === s ? "border-current opacity-100" : "border-transparent opacity-40 hover:opacity-80"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom-right: price + CTA */}
      <div className="absolute bottom-24 md:bottom-12 right-6 md:right-12 z-30 text-right space-y-3 flex flex-col items-end">
        <h1 className="text-4xl md:text-6xl font-serif italic tracking-wide drop-shadow-lg">
          {activeProduct.title}
        </h1>
        <button 
          onClick={() => window.dispatchEvent(new Event('openBookConsultantModal'))}
          className="mt-4 px-8 py-3 text-xs md:text-sm tracking-[0.15em] uppercase hover:opacity-80 transition-all font-medium"
          style={{ backgroundColor: activeProduct.textColor, color: activeProduct.themeColor }}
        >
          Book Stylist
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {Array.from({ length: totalProducts }).map((_, idx) => (
          <div 
            key={idx} 
            className={`h-[2px] transition-all duration-500 ${
              idx === activeIndex ? "w-8 opacity-100" : "w-4 opacity-30"
            }`}
            style={{ backgroundColor: activeProduct.textColor }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center opacity-40"
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] mb-1 font-medium">Scroll</span>
        <ChevronDown size={16} strokeWidth={1} />
      </motion.div>
    </motion.div>
  );
}
