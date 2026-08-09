import { X, Camera, Pencil, Sparkles, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function SizeSelectionModal({ isOpen, onClose, product, activeVariation }) {
  const navigate = useNavigate();
  const { addToCart } = useAppContext();
  const [selectedSize, setSelectedSize] = useState("M");
  const [isRendered, setIsRendered] = useState(false);

  // Trigger animation after render
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isRendered) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Modal / Bottom Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-[101] overflow-hidden transition-transform duration-300 ease-out shadow-2xl ${isOpen ? 'translate-y-0 md:scale-100' : 'translate-y-full md:scale-95'}`}>
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">Select Size or<br/>Measurements</h2>
            <p className="text-sm text-gray-500 mt-1">Get the perfect fit, your way.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* AI Banner */}
        <div className="mx-6 mt-2 bg-[#F8F6FF] rounded-xl p-3 flex items-center justify-between border border-[#6344D4]/10">
          <div className="flex items-center gap-2 text-sm font-bold text-[#6344D4]">
            <Sparkles size={16} />
            Recommended Size: M
          </div>
          <span className="text-xs font-bold bg-[#6344D4] text-white px-2 py-0.5 rounded-full">95% Match</span>
        </div>

        {/* Size Selection Grid */}
        <div className="px-6 mt-6">
          <div className="grid grid-cols-5 gap-3">
            {["XS", "S", "M", "L", "XL"].map(size => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`relative flex flex-col items-center justify-center h-16 rounded-xl border-2 transition-all ${
                  selectedSize === size 
                    ? "bg-[#6344D4] border-[#6344D4] text-white shadow-md shadow-[#6344D4]/30" 
                    : "bg-white border-gray-100 text-gray-900 hover:border-gray-300"
                }`}
              >
                {selectedSize === size && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-[#6344D4]">
                    <Check size={10} className="text-[#6344D4]" strokeWidth={4} />
                  </div>
                )}
                <span className="font-bold text-lg">{size}</span>
                <span className={`text-[9px] font-medium mt-0.5 ${selectedSize === size ? "text-purple-100" : "text-gray-400"}`}>
                  UK {size === 'XS' ? '4-6' : size === 'S' ? '8' : size === 'M' ? '10-12' : size === 'L' ? '14' : '16'}
                </span>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-3">
            <button className="text-xs font-bold text-gray-400 hover:text-gray-900 underline underline-offset-2">Size Guide</button>
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-4 px-6 my-6">
          <div className="h-px bg-gray-100 flex-1"></div>
          <span className="text-xs font-bold text-gray-400 tracking-wider">OR</span>
          <div className="h-px bg-gray-100 flex-1"></div>
        </div>

        {/* Add Measurements Section */}
        <div className="px-6 mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Add measurements for a custom fit</h3>
          <div className="flex gap-4">
            <button className="flex-1 flex flex-col items-center justify-center gap-2 h-24 bg-gray-50 border border-gray-100 rounded-2xl hover:border-gray-300 transition-colors">
              <Pencil size={24} className="text-gray-600" />
              <span className="text-xs font-bold text-gray-700">Enter Manually</span>
            </button>
            <button className="flex-1 flex flex-col items-center justify-center gap-2 h-24 bg-gray-50 border border-gray-100 rounded-2xl hover:border-gray-300 transition-colors relative overflow-hidden group">
              {/* Subtle background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6344D4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Camera size={24} className="text-[#6344D4]" />
              <span className="text-xs font-bold text-[#6344D4] relative z-10">Scan with Camera (AI)</span>
            </button>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white">
          <button 
            onClick={() => {
              if (product) {
                addToCart(product, selectedSize, activeVariation);
              }
              onClose();
              navigate("/cart");
            }}
            className="w-full bg-[#6344D4] text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center shadow-lg shadow-[#6344D4]/30 hover:bg-[#5235B8] transition-colors"
          >
            Continue with Size {selectedSize}
          </button>
        </div>

      </div>
    </>
  );
}
