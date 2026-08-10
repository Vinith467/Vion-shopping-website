import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const tooltipData = {
  'Hourglass': {
    how: ['Shoulders and hips are about the same width', 'Waist is noticeably narrower', 'Bust and hips are usually well balanced'],
    quick: 'If your shoulders/bust and hips are similar in width and your waist is clearly smaller → Hourglass',
    best: 'Compare your shoulder/bust width, waist, and hip width rather than focusing on overall size or weight.'
  },
  'Pear': {
    how: ['Hips are wider than your shoulders/bust', 'Waist is usually defined', 'Lower body appears fuller than the upper body'],
    quick: 'If your hips are noticeably wider than your shoulders/bust → Pear',
    best: 'Measure or compare your shoulder/bust and hip widths. If your lower body is clearly wider, choose Pear.'
  },
  'Inverted Triangle': {
    how: ['Shoulders are wider than the hips', 'Bust/upper body may appear more prominent', 'Hips are comparatively narrow', 'Waist can be defined or relatively straight'],
    quick: 'If your shoulders or bust are noticeably wider than your hips → Inverted Triangle',
    best: 'Focus on the relationship between your shoulders/bust and hips, not your overall body size.'
  },
  'Rectangle': {
    how: ['Shoulders, waist and hips are relatively similar in width', 'Waist has less definition', 'Body appears straighter from shoulders to hips'],
    quick: 'If your shoulders and hips are similar in width and your waist isn\'t dramatically narrower → Rectangle',
    best: 'Compare your shoulder/bust, waist and hip measurements. Look for similar proportions rather than absolute measurements.'
  },
  'Apple': {
    how: ['Midsection is the most prominent area', 'Bust may be fuller', 'Waist is less defined', 'Hips can be narrower compared with the midsection'],
    quick: 'If your midsection is fuller than your hips and your waist is less defined → Apple',
    best: 'Look at where your body carries the most width, particularly around the bust, waist and midsection compared with the hips.'
  }
};

const BodyShapeTooltip = ({ id, img, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      // Attempt to place it above, or below if not enough space
      let top = rect.top - 420; // Tooltip is ~380px tall
      let left = rect.left + rect.width / 2;
      
      if (top < 20) {
        top = rect.bottom + 20; // place below
      }
      
      // Ensure it doesn't go off screen horizontally
      if (left < 200) left = 200;
      if (left > window.innerWidth - 200) left = window.innerWidth - 200;

      setCoords({ x: left, y: top });
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const data = tooltipData[id];

  return (
    <div 
      className="relative flex flex-col h-full w-full"
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isHovered && data && createPortal(
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ 
              position: 'fixed',
              top: coords.y,
              left: coords.x,
              transform: 'translateX(-50%)',
              zIndex: 999999
            }}
            className="w-[380px] bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl overflow-hidden pointer-events-none"
          >
            {/* Header / Image area */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 pb-4 border-b border-gray-100 flex items-end gap-4">
              <div className="w-24 h-28 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-2 shrink-0">
                <img src={img} alt={id} className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 leading-tight">{id}</h3>
                <p className="text-xs font-semibold text-[#3A10E5] uppercase tracking-wider mt-1">Shape Guide</p>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 space-y-5">
              
              {/* How to identify */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#3A10E5]" /> How to identify
                </h4>
                <ul className="space-y-2">
                  {data.how.map((point, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2 leading-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3A10E5]/60 mt-1.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick check */}
              <div className="bg-purple-50/80 rounded-xl p-3 border border-purple-100">
                <h4 className="text-[10px] font-bold text-[#3A10E5] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <AlertCircle size={12} /> Quick check
                </h4>
                <p className="text-xs font-medium text-purple-900 leading-snug">
                  {data.quick}
                </p>
              </div>

              {/* Best way to choose */}
              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Info size={12} className="text-gray-400" /> Best way to choose
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {data.best}
                </p>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default BodyShapeTooltip;
