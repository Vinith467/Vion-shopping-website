import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(false);
  };

  const data = tooltipData[id];

  return (
    <div 
      className="relative flex flex-col h-full w-full"
      onClick={() => setIsOpen(true)}
    >
      {children}
      
      {isOpen && data && createPortal(
        <AnimatePresence>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[999998] pointer-events-auto"
            onClick={handleClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              zIndex: 999999
            }}
            className="w-[850px] max-w-[95vw] bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.4)] rounded-3xl overflow-hidden pointer-events-auto flex flex-col md:flex-row"
          >
            {/* Close button */}
            <button 
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors z-10 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Left: Image area */}
            <div className="w-full md:w-[45%] bg-gradient-to-br from-purple-50/80 to-purple-100/30 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
              <div className="w-64 h-64 flex items-center justify-center mb-6">
                <img src={img} alt={id} className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="text-center">
                <h3 className="text-4xl font-serif font-bold text-gray-900 leading-tight">{id}</h3>
                <p className="text-sm font-bold text-[#3A10E5] uppercase tracking-wider mt-2">Shape Guide</p>
              </div>
            </div>

            {/* Right: Content area */}
            <div className="w-full md:w-[55%] p-8 flex flex-col justify-between">
              
              <div className="space-y-6">
                {/* How to identify */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-[#3A10E5]" /> How to identify
                  </h4>
                  <ul className="space-y-3">
                    {data.how.map((point, i) => (
                      <li key={i} className="text-[15px] text-gray-700 flex items-start gap-3 leading-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3A10E5]/60 mt-2 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick check */}
                <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-100">
                  <h4 className="text-[11px] font-bold text-[#3A10E5] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle size={14} /> Quick check
                  </h4>
                  <p className="text-sm font-medium text-purple-900 leading-snug">
                    {data.quick}
                  </p>
                </div>

                {/* Best way to choose */}
                <div>
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Info size={14} className="text-gray-400" /> Best way to choose
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {data.best}
                  </p>
                </div>
              </div>
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
