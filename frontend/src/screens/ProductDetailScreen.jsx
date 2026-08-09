import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MoreVertical, Star, Info, Share2, ShoppingBag, Box, User2, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import SizeSelectionModal from "../components/SizeSelectionModal";
import { useAppContext } from "../context/AppContext";

function MissingProfileDataModal({ isOpen, onClose, onSave, defaultValues }) {
  const [selectedTone, setSelectedTone] = useState(defaultValues?.skinTone || "Light");
  const [selectedShape, setSelectedShape] = useState(defaultValues?.bodyShape || "Hourglass");
  const [heightCm, setHeightCm] = useState(defaultValues?.height ? parseInt(defaultValues.height) : 165);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar shadow-2xl p-6">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Personalize Your View</h3>
        <p className="text-sm text-gray-600 mb-6">Complete your profile to see the best color matches and fits for this product.</p>
        
        {/* Skin Tone */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Skin Tone</label>
          <div className="flex justify-between gap-2">
            {[
              { id: 'Very Light', color: '#F5D0B5' },
              { id: 'Light', color: '#E8BE95' },
              { id: 'Medium Light', color: '#D89F70' },
              { id: 'Medium', color: '#B57B52' },
              { id: 'Medium Deep', color: '#8B5A33' },
              { id: 'Deep', color: '#5C3A21' }
            ].map(tone => (
              <button 
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center transition-all ${selectedTone === tone.id ? 'ring-2 ring-offset-2 ring-[#4328eb]' : 'hover:scale-105'}`}
                style={{ backgroundColor: tone.color }}
              >
                {selectedTone === tone.id && (
                  <svg className="w-5 h-5 text-[#4328eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Body Shape */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Body Shape</label>
          <div className="grid grid-cols-5 gap-2 overflow-x-auto pb-2">
            {[
              { id: "Inverted Triangle", image: "/images/shapes/inverted_triangle.png" },
              { id: "Apple", name: "Apple", image: "/images/shapes/apple.png" },
              { id: "Hourglass", image: "/images/shapes/hourglass.png" },
              { id: "Pear", image: "/images/shapes/pear.png" },
              { id: "Rectangle", image: "/images/shapes/rectangle.png" }
            ].map(shape => (
              <button 
                key={shape.id}
                onClick={() => setSelectedShape(shape.id)}
                className={`relative flex flex-col overflow-hidden rounded-xl border-2 transition-all min-w-[70px] flex-1 ${selectedShape === shape.id ? 'border-[#4328eb] ring-1 ring-[#4328eb]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="w-full aspect-[4/5] bg-gray-50 flex items-center justify-center">
                  <img src={shape.image} alt={shape.name || shape.id} className="object-cover h-full w-full" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                  <div className="hidden text-[8px] text-gray-400 text-center leading-tight">Image here</div>
                </div>
                <div className={`w-full py-1.5 text-center border-t ${selectedShape === shape.id ? 'bg-[#F8F6FF] border-[#4328eb]/20' : 'bg-white border-gray-100'}`}>
                  <span className="text-[9px] font-bold text-gray-700 leading-tight">{shape.name || shape.id}</span>
                </div>
                {selectedShape === shape.id && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-[#4328eb] rounded-full flex items-center justify-center text-white shadow-sm">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Height */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Height</label>
          <div className="space-y-2">
            {[
              { value: 155, label: "5'3\" and less", sub: "(160cm and less)" },
              { value: 165, label: "5'3.1\" - 5'6\"", sub: "(161cm - 168cm)" },
              { value: 175, label: "5'6.1\" and above", sub: "(169cm and above)" }
            ].map(range => (
              <button 
                key={range.value}
                onClick={() => setHeightCm(range.value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${heightCm === range.value ? 'border-[#4328eb] bg-[#F8F6FF]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-bold ${heightCm === range.value ? 'text-[#4328eb]' : 'text-gray-700'}`}>{range.label}</span>
                  <span className="text-[10px] text-gray-500">{range.sub}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${heightCm === range.value ? 'border-[#4328eb]' : 'border-gray-300'}`}>
                  {heightCm === range.value && <div className="w-2.5 h-2.5 rounded-full bg-[#4328eb]"></div>}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={async () => {
            setIsSubmitting(true);
            await onSave({ skinTone: selectedTone, bodyShape: selectedShape, height: heightCm });
            setIsSubmitting(false);
            onClose();
          }}
          disabled={isSubmitting}
          className="w-full bg-[#6344D4] text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#5235B8] transition-colors flex justify-center"
        >
          {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Save & View Product"}
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Try On");
  const [activeView, setActiveView] = useState("Front");
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const { members, updateMember } = useAppContext();
  const primaryMember = members?.find(m => m.isPrimary);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset image index when variation changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeVariationIndex]);

  useEffect(() => {
    async function loadProduct() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
    }
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product && primaryMember && !primaryMember.skinTone && activeTab === "Try On") {
      setShowProfileModal(true);
    }
  }, [product, primaryMember, activeTab]);

  useEffect(() => {
    if (product?.variations && product.variations.length > 0 && primaryMember) {
      // Logic to auto-select best variation based on skinTone and height
      const userHeightCm = parseInt(primaryMember.height) || 160;
      let heightRange = 'Average';
      if (userHeightCm < 160) heightRange = 'Short';
      if (userHeightCm > 170) heightRange = 'Tall';
      
      const userSkinTone = primaryMember.skinTone || 'Medium';
      const userBodyShape = primaryMember.bodyShape || 'Hourglass';
      
      // Find exact match first
      let bestMatchIndex = product.variations.findIndex(v => 
        (v.skinTone === userSkinTone || v.skinTone === 'all') && 
        (v.heightRange === heightRange || v.heightRange === 'all') &&
        (!v.bodyShape || v.bodyShape === userBodyShape || v.bodyShape === 'all')
      );
      
      if (bestMatchIndex !== -1) {
        setActiveVariationIndex(bestMatchIndex);
      }
    }
  }, [product, primaryMember, showProfileModal]);

  const handleSaveProfile = async (data) => {
    if (!primaryMember) return;
    await updateMember(primaryMember.id, {
      ...primaryMember,
      height: data.height,
      bodyShape: data.bodyShape,
      skinTone: data.skinTone
    });
  };

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  const activeVariation = product.variations && product.variations[activeVariationIndex];
  
  // Combine image_urls array with fallback image_url
  const variationImages = [];
  if (activeVariation?.image_urls && activeVariation.image_urls.length > 0) {
    variationImages.push(...activeVariation.image_urls);
  } else if (activeVariation?.image_url) {
    variationImages.push(activeVariation.image_url);
  } else {
    if (product.images && product.images.length > 0) {
      variationImages.push(...product.images);
    } else {
      variationImages.push('/images/placeholder.jpg');
    }
  }

  const currentImage = variationImages[activeImageIndex] || variationImages[0];
  const currentColorName = activeVariation?.colorName || 'Standard';

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col bg-white min-h-screen">
      
      <MissingProfileDataModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)}
        onSave={handleSaveProfile}
        defaultValues={{
          skinTone: primaryMember?.skinTone,
          bodyShape: primaryMember?.bodyShape,
          height: primaryMember?.height
        }}
      />
      
      {/* Mobile Top App Bar (Hidden on Desktop) */}
      <div className="md:hidden flex items-center justify-between px-6 pt-12 pb-4 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-gray-50 rounded-full">
          <ArrowLeft size={20} className="text-gray-900" />
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2 bg-gray-50 rounded-full"><Heart size={20} className="text-gray-900" /></button>
          <button className="p-2 bg-gray-50 rounded-full"><MoreVertical size={20} className="text-gray-900" /></button>
        </div>
      </div>

      {/* Desktop Breadcrumb & Back (Hidden on Mobile) */}
      <div className="hidden md:flex items-center gap-2 px-10 py-6 max-w-7xl mx-auto w-full">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#6344D4] transition-colors font-medium text-sm">
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-0 md:px-10 pb-32 md:pb-12 gap-10">
        
        {/* LEFT COLUMN: Media / Try On Viewer (Expands on Desktop) */}
        <div className="w-full md:w-[60%] flex flex-col">
          
          {/* Mobile Only Tabs (On desktop, these are above the viewer) */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 md:px-0 mb-6">
            {["Product", "3D Avatar", "Try On"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 pb-4 text-sm font-bold text-center border-b-2 transition-colors ${
                  activeTab === tab ? "border-[#6344D4] text-[#6344D4]" : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab === "Try On" ? "Try On (You)" : tab}
              </button>
            ))}
          </div>

          {/* Try On Viewer Container */}
          {activeTab === "Try On" && (
            <div className="flex flex-col md:flex-row gap-4 px-6 md:px-0">
              
              {/* Vertical Views Selector (Left of image) */}
              <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
                {variationImages.map((img, idx) => {
                  return (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex flex-col items-center justify-center h-20 rounded-2xl border-2 overflow-hidden transition-all ${
                        activeImageIndex === idx ? "border-[#6344D4] ring-2 ring-[#6344D4]/30" : "border-transparent hover:border-gray-200"
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>

              {/* Main Image Area */}
              <div className="flex-1 aspect-[3/4] md:aspect-auto md:min-h-[600px] bg-gray-50 rounded-3xl relative overflow-hidden flex items-center justify-center border border-gray-100">
                <img src={currentImage} className="w-full h-full object-cover mix-blend-multiply" />
                
                {/* Image Navigation Arrows */}
                {variationImages.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImageIndex(prev => prev > 0 ? prev - 1 : variationImages.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={20} className="text-gray-900" />
                    </button>
                    <button 
                      onClick={() => setActiveImageIndex(prev => prev < variationImages.length - 1 ? prev + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronRight size={20} className="text-gray-900" />
                    </button>
                  </>
                )}

                {/* Mobile horizontal view selector (overlay at bottom) */}
                {variationImages.length > 1 && (
                  <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-white/90 backdrop-blur p-1.5 rounded-full shadow-lg border border-gray-100 gap-1">
                    {variationImages.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          activeImageIndex === idx ? "bg-[#6344D4] w-6" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* "Try different looks" Vertical Carousel (Right of image) */}
              <div className="hidden md:flex flex-col gap-3 w-24 shrink-0">
                <span className="text-xs font-bold text-gray-900 text-center bg-gray-50 py-2 rounded-lg border border-gray-100">Different<br/>Looks</span>
                <div className="flex flex-col gap-3 overflow-y-auto hide-scrollbar pb-4">
                    {product.variations && product.variations.length > 0 ? (
                      product.variations.map((v, i) => {
                        const thumb = (v.image_urls && v.image_urls.length > 0) ? v.image_urls[0] : (v.image_url || currentImage);
                        return (
                          <div key={i} onClick={() => setActiveVariationIndex(i)} className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-[3px] cursor-pointer hover:opacity-80 transition-opacity ${i === activeVariationIndex ? 'border-[#6344D4]' : 'border-transparent'}`}>
                            <img src={thumb} className="w-full h-full object-cover bg-gray-50 mix-blend-multiply" />
                            {i === activeVariationIndex && (
                              <div className="absolute inset-0 bg-[#6344D4]/10"></div>
                            )}
                          </div>
                        );
                      })
                  ) : (
                    <div className={`w-full aspect-[3/4] rounded-2xl overflow-hidden border-[3px] border-[#6344D4] cursor-pointer`}>
                      <img src={currentImage} className="w-full h-full object-cover bg-gray-50 mix-blend-multiply" />
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Mobile "Try different looks" Horizontal Carousel (Below image) */}
          <div className="md:hidden mt-6 px-6">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Try different looks</h4>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {product.variations && product.variations.length > 0 ? (
                product.variations.map((v, i) => {
                  const thumb = (v.image_urls && v.image_urls.length > 0) ? v.image_urls[0] : (v.image_url || currentImage);
                  return (
                    <div key={i} onClick={() => setActiveVariationIndex(i)} className={`relative w-20 shrink-0 aspect-[3/4] rounded-xl overflow-hidden border-2 ${i === activeVariationIndex ? 'border-[#6344D4]' : 'border-transparent'}`}>
                      <img src={thumb} className="w-full h-full object-cover bg-gray-50 mix-blend-multiply" />
                    </div>
                  );
                })
              ) : (
                <div className={`w-20 shrink-0 aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#6344D4]`}>
                  <img src={currentImage} className="w-full h-full object-cover bg-gray-50 mix-blend-multiply" />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Product Info & Actions */}
        <div className="w-full md:w-[40%] flex flex-col px-6 md:px-0">
          
          <div className="space-y-3 mt-4 md:mt-0">
            <span className="inline-block text-[10px] md:text-xs font-bold text-[#6344D4] uppercase tracking-widest bg-[#F8F6FF] px-3 py-1.5 rounded-full border border-[#6344D4]/10">New Arrival</span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
              <span className="font-bold text-gray-900">4.8</span>
              <span className="underline decoration-gray-300 underline-offset-4">(128 reviews)</span>
              <span className="px-1 text-gray-300">|</span>
              <span className="font-medium">Sold 1.2k</span>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-bold text-gray-900">₹{parseFloat(product.price).toLocaleString()}</span>
              <span className="text-lg text-gray-400 line-through font-medium">₹3,999</span>
              <span className="text-sm font-bold text-[#D93025] bg-red-50 px-2 py-1 rounded">37% OFF</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-[#F8F6FF] rounded-2xl p-5 flex flex-col items-center justify-center border border-[#6344D4]/15 shadow-sm">
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Fit Score</p>
              <p className="text-3xl font-black text-[#6344D4]">{product.score ? `${Math.min(100, Math.round((product.score / 5) * 100))}%` : '95%'}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center justify-center border border-gray-200 relative shadow-sm">
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Recommended Size</p>
              <p className="text-3xl font-black text-gray-900">M</p>
              <Info size={16} className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-900" />
            </div>
          </div>

          <div className="space-y-3 mt-8 bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <User2 size={18} className="text-[#6344D4] mt-0.5" />
              <p className="font-medium leading-relaxed">Perfect fit for your body type <span className="font-bold text-gray-900">(Hourglass)</span></p>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <Sparkles size={18} className="text-[#6344D4] mt-0.5" />
              <p className="font-medium leading-relaxed">Looks great in this color palette</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-900">Color: <span className="text-gray-600 font-medium">{currentColorName}</span></p>
            </div>
            {product.variations && product.variations.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {product.variations.map((v, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveVariationIndex(i)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${i === activeVariationIndex ? 'border-[#6344D4] bg-[#F8F6FF] text-[#6344D4]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {v.colorName || `Look ${i+1}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop "Why this looks perfect" & Actions */}
          <div className="mt-10 bg-[#F8F6FF] rounded-2xl p-5 flex gap-4 border border-[#6344D4]/10 items-start">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Sparkles size={24} className="text-[#6344D4]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Why this looks perfect on you</h4>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed font-medium">This image specifically demonstrates how it will fit {primaryMember?.height ? `your ${primaryMember.height}` : 'you'} and complements your {primaryMember?.skinTone || 'selected'} skin tone.</p>
              <button className="text-sm font-bold text-[#6344D4] mt-3 hover:underline underline-offset-4">View AI Details</button>
            </div>
          </div>

          {/* Desktop Add to Bag (Inline) */}
          <div className="hidden md:flex items-center gap-4 mt-8 pt-8 border-t border-gray-100">
            <button className="w-14 h-14 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors shadow-sm">
              <Heart size={24} />
            </button>
            <button 
              onClick={() => setIsSizeModalOpen(true)}
              className="flex-1 bg-[#6344D4] text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#6344D4]/30 hover:bg-[#5235B8] hover:-translate-y-0.5 transition-all"
            >
              <ShoppingBag size={22} />
              Add to Bag
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 pb-6 z-50 flex items-center gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <button className="flex flex-col items-center justify-center w-12 h-12 bg-gray-50 rounded-full border border-gray-200 text-gray-700">
          <Heart size={20} />
        </button>
        <button 
          onClick={() => setIsSizeModalOpen(true)}
          className="flex-1 bg-[#6344D4] text-white h-12 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#6344D4]/30"
        >
          <ShoppingBag size={18} />
          Add to Bag
        </button>
      </div>

      {/* Size Selection Modal */}
      <SizeSelectionModal 
        isOpen={isSizeModalOpen} 
        onClose={() => setIsSizeModalOpen(false)} 
        product={product}
        activeVariation={activeVariation}
      />
    </div>
  );
}
