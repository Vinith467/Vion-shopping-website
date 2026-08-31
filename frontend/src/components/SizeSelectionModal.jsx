import { X, Camera, Pencil, Sparkles, Check, ArrowLeft, Ruler } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function SizeSelectionModal({ isOpen, onClose, product, activeVariation }) {
  const navigate = useNavigate();
  const { addToCart, measurements, updateMember, selectedConsumerId } = useAppContext();
  const [selectedSize, setSelectedSize] = useState("Custom");
  const [isRendered, setIsRendered] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);

  const hasMeasurements = measurements && Object.keys(measurements).some(key => !['heightUnit', 'size'].includes(key) && measurements[key]);

  // Form state for 11 measurements
  const [customMeasurements, setCustomMeasurements] = useState({
    height: measurements?.height || "",
    chest: "",
    biceps: "",
    waist: "",
    hips: "",
    thigh: "",
    ankle: "",
    shoulder: "",
    armsLength: "",
    wrist: "",
    calf: ""
  });

  // Trigger animation after render
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsManualMode(false);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isRendered) return null;

  const handleMeasurementChange = (field, value) => {
    setCustomMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handleAddToCart = async () => {
    if (product) {
      if (selectedSize === "Custom") {
        addToCart(product, "Custom", activeVariation, customMeasurements);
        
        // Save to profile
        if (selectedConsumerId) {
          try {
            await updateMember(selectedConsumerId, { measurements: customMeasurements });
          } catch (e) {
            console.error("Failed to save measurements to profile", e);
          }
        }
      } else {
        addToCart(product, selectedSize, activeVariation);
      }
    }
    onClose();
    navigate("/cart");
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Modal / Bottom Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white dark:bg-[#151515] transition-colors duration-500 rounded-t-3xl md:rounded-3xl md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-[101] overflow-hidden flex flex-col transition-transform duration-300 ease-out shadow-2xl ${isOpen ? 'translate-y-0 md:scale-100' : 'translate-y-full md:scale-95'}`} style={{ maxHeight: '90vh' }}>
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0 bg-white dark:bg-[#151515] transition-colors duration-500 z-10 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {isManualMode && (
              <button onClick={() => setIsManualMode(false)} className="p-1.5 -ml-1.5 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100">
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-[#F5F0E8] leading-tight">
                {isManualMode ? "Enter Measurements" : "Select Fit"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Get the perfect fit, your way.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto hide-scrollbar flex-1 relative">
          
          {isManualMode ? (
            <div className="p-6 space-y-4">
              <div className="bg-[#F8F6FF] rounded-xl p-4 flex gap-3 border border-[#6344D4]/10 mb-2">
                <Ruler className="text-[#6344D4] shrink-0" size={20} />
                <p className="text-xs text-gray-700 leading-relaxed font-medium">Provide your exact measurements for a custom stitched garment that fits you perfectly.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'height', label: '1. Height' },
                  { id: 'shoulder', label: '2. Shoulder Width' },
                  { id: 'chest', label: '3. Chest / Bust' },
                  { id: 'armsLength', label: '4. Arms Length' },
                  { id: 'biceps', label: '5. Biceps (Around)' },
                  { id: 'waist', label: '6. Waist' },
                  { id: 'hips', label: '7. Hips' },
                  { id: 'wrist', label: '8. Wrist' },
                  { id: 'thigh', label: '9. Thigh' },
                  { id: 'calf', label: '10. Calf' },
                  { id: 'ankle', label: '11. Ankle' },
                ].map((field) => (
                  <div key={field.id} className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">{field.label}</label>
                    <div className="relative">
                      <input 
                        type="number"
                        value={customMeasurements[field.id]}
                        onChange={(e) => handleMeasurementChange(field.id, e.target.value)}
                        placeholder="0"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#6344D4] focus:ring-1 focus:ring-[#6344D4] transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">in</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Primary: Best Stitching / Measurements */}
              <div className="px-6 mt-6 mb-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-[#F5F0E8] mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#6344D4]" />
                  {hasMeasurements ? "Best Stitching - Edit Saved Measurements" : "Best Stitching - Give Measurement"}
                </h3>
                <div className="w-full">
                  <button 
                    onClick={() => {
                      setSelectedSize("Custom");
                      setIsManualMode(true);
                    }}
                    className={`w-full flex items-center justify-between p-4 h-auto rounded-2xl transition-all border-2 group ${selectedSize === "Custom" ? "bg-gradient-to-r from-[#F8F6FF] to-white dark:to-[#0A0A0A] transition-colors duration-500 border-[#6344D4] shadow-md shadow-[#6344D4]/10" : "bg-white dark:bg-[#151515] transition-colors duration-500 border-gray-100 hover:border-[#6344D4]/50 hover:shadow-sm"}`}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${selectedSize === "Custom" ? "bg-[#6344D4] text-white" : "bg-gray-50 text-gray-400 group-hover:bg-[#F8F6FF] group-hover:text-[#6344D4]"}`}>
                        <Ruler size={22} />
                      </div>
                      <div>
                        <span className={`block text-sm font-bold ${selectedSize === "Custom" ? "text-[#6344D4]" : "text-gray-900 dark:text-[#F5F0E8] group-hover:text-[#6344D4]"}`}>{hasMeasurements ? "Edit Custom Measurements" : "Add Custom Measurements"}</span>
                        <span className="block text-xs font-medium text-gray-500 mt-0.5">{hasMeasurements ? "Review or update your saved fit for this order" : "We will stitch this garment exactly to your size"}</span>
                      </div>
                    </div>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors ${selectedSize === "Custom" ? "border-[#6344D4] bg-[#6344D4] text-white" : "border-gray-200 text-transparent"}`}>
                      <Check size={14} strokeWidth={4} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Separator */}
              <div className="flex items-center gap-4 px-6 my-2">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="text-xs font-bold text-gray-400 tracking-wider">OR</span>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>

              {/* Secondary: Standard Sizes */}
              <div className="px-6 mt-6 mb-8">
                <h3 className="text-sm font-bold text-gray-900 dark:text-[#F5F0E8] mb-3 text-center">Select a standard size</h3>
                <div className="grid grid-cols-5 gap-3">
                  {["XS", "S", "M", "L", "XL"].map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative flex flex-col items-center justify-center h-16 rounded-xl border-2 transition-all ${
                        selectedSize === size 
                          ? "bg-white dark:bg-[#151515] transition-colors duration-500 border-gray-900 text-gray-900 dark:text-[#F5F0E8] shadow-md" 
                          : "bg-gray-50 border-gray-50 text-gray-600 hover:border-gray-200"
                      }`}
                    >
                      {selectedSize === size && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white dark:bg-[#151515] transition-colors duration-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                          <Check size={10} className="text-gray-900 dark:text-[#F5F0E8]" strokeWidth={4} />
                        </div>
                      )}
                      <span className="font-bold text-lg">{size}</span>
                      <span className={`text-[9px] font-medium mt-0.5 ${selectedSize === size ? "text-gray-500" : "text-gray-400"}`}>
                        UK {size === 'XS' ? '4-6' : size === 'S' ? '8' : size === 'M' ? '10-12' : size === 'L' ? '14' : '16'}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-3">
                  <button className="text-xs font-bold text-gray-400 hover:text-gray-900 dark:text-[#F5F0E8] underline underline-offset-2">Size Guide</button>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Sticky Action Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white dark:bg-[#151515] transition-colors duration-500 shrink-0">
          <button 
            onClick={isManualMode ? () => setIsManualMode(false) : handleAddToCart}
            className="w-full bg-[#6344D4] text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center shadow-lg shadow-[#6344D4]/30 hover:bg-[#5235B8] transition-colors"
          >
            {isManualMode ? "Save Measurements" : `Continue with ${selectedSize}`}
          </button>
        </div>

      </div>
    </>
  );
}
