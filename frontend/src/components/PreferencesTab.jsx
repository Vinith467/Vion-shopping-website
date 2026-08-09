import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Briefcase, Shirt, Music, Sun, Gift, Plane, Heart, Home as HomeIcon, Check, CheckSquare, Square, Edit2, LayoutGrid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

import { supabase } from '../services/supabaseClient';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useEffect } from 'react';

export default function PreferencesTab() {
  const location = useLocation();
  const { members } = useAppContext();
  const primaryMember = members?.find(m => m.isPrimary);
  const [selectedMemberId, setSelectedMemberId] = useState(location.state?.memberId || primaryMember?.id);
  const targetMember = members?.find(m => m.id === selectedMemberId) || primaryMember;

  const [view, setView] = useState('form'); // 'form' or 'results'
  const [selectedStyles, setSelectedStyles] = useState(['minimal', 'elegant', 'traditional']);
  const [selectedColors, setSelectedColors] = useState(['black', 'grey', 'navy']);
  const [selectedFit, setSelectedFit] = useState('regular');
  const [selectedOccasions, setSelectedOccasions] = useState(['work', 'casual', 'party', 'festive', 'wedding']);
  const [selectedFabrics, setSelectedFabrics] = useState(['cotton', 'linen', 'silk', 'denim']);
  const [selectedContent, setSelectedContent] = useState(['new_arrivals', 'style_tips', 'outfit_recs', 'sale_offers']);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [dynamicTags, setDynamicTags] = useState({});
  const [recommendedOutfits, setRecommendedOutfits] = useState([]);

  useEffect(() => {
    async function loadPreferences() {
      if (!targetMember) return;
      setIsLoading(true);
      
      // Fetch dynamic tags from DB
      const { data: tagData } = await supabase.from('preference_tags').select('*');
      const grouped = (tagData || []).reduce((acc, tag) => {
        if (!acc[tag.type]) acc[tag.type] = [];
        acc[tag.type].push(tag);
        return acc;
      }, {});
      setDynamicTags(grouped);

      // Reset to defaults
      setSelectedStyles([]);
      setSelectedColors([]);
      setSelectedFit('');
      setSelectedOccasions([]);
      setSelectedFabrics([]);
      setSelectedContent([]);

      try {
        const { data: prefs, error } = await supabase
          .from('preferences')
          .select('*')
          .eq('consumer_id', targetMember.id)
          .single();

        if (prefs) {
          if (prefs.preferred_styles) setSelectedStyles(prefs.preferred_styles);
          if (prefs.preferred_colors) setSelectedColors(prefs.preferred_colors);
          if (prefs.preferred_fit) setSelectedFit(prefs.preferred_fit);
          if (prefs.preferred_fabrics) setSelectedFabrics(prefs.preferred_fabrics);
          if (prefs.preferred_occasions) setSelectedOccasions(prefs.preferred_occasions);
          if (prefs.preferred_content) setSelectedContent(prefs.preferred_content);
        }
      } catch (err) {
        console.error("No existing preferences found or error loading them", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPreferences();
  }, [targetMember]);

  // Fetch recommended outfits when in results view
  useEffect(() => {
    if (view === 'results') {
      const fetchMatches = async () => {
        const { data } = await supabase.from('products').select('*');
        if (!data) return;

        // Simple scoring algorithm based on preferences
        const allSelectedTags = [
          ...selectedStyles,
          ...selectedColors,
          selectedFit,
          ...selectedFabrics,
          ...selectedOccasions
        ].filter(Boolean);

        const scoredProducts = data.map(product => {
          let score = 0;
          const productTags = [
            ...(product.style_tags || []),
            ...(product.color_tags || []),
            product.fit_tag,
            ...(product.fabric_tags || []),
            ...(product.occasion_tags || [])
          ].filter(Boolean);

          productTags.forEach(tag => {
            if (allSelectedTags.includes(tag)) {
              score += 1;
            }
          });

          return { ...product, score };
        });

        // Sort by score descending and take the ones with at least some match or just the top ones
        const sorted = scoredProducts.sort((a, b) => b.score - a.score);
        setRecommendedOutfits(sorted);
      };
      fetchMatches();
    }
  }, [view]);

  const toggleSelection = (id, list, setList) => {
    if (list.includes(id)) {
      setList(list.filter(item => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (!targetMember) throw new Error("No member selected.");
      
      const consumerId = targetMember.id;

      // Upsert preferences
      const { error: upsertErr } = await supabase
        .from('preferences')
        .upsert({
          consumer_id: consumerId,
          preferred_styles: selectedStyles,
          preferred_colors: selectedColors,
          preferred_fit: selectedFit,
          preferred_fabrics: selectedFabrics,
          preferred_occasions: selectedOccasions,
          preferred_content: selectedContent,
          updated_at: new Date()
        }, { onConflict: 'consumer_id' }); // Note: We need a unique constraint on consumer_id

      if (upsertErr) throw upsertErr;

      toast.success("Preferences saved to your profile!");
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save preferences.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveLook = () => {
    toast.success('Look saved to your Outfits collection!');
  };

  if (view === 'results') {
    return (
      <div className="w-full flex flex-col gap-6 -mt-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Top Navigation */}
        <button 
          onClick={() => setView('form')}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ChevronLeft size={16} /> Back to Preferences
        </button>

        {/* Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[28px] font-bold text-gray-900 font-serif flex items-center gap-2">
                <Sparkles size={24} className="text-[#3A10E5]" /> Recommended Outfits
              </h2>
              <div className="flex items-center gap-1.5 bg-purple-50 text-[#3A10E5] px-2.5 py-1 rounded-full border border-purple-100">
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                  <img src={targetMember?.image || "/images/body_hourglass_1785826886362.jpg"} alt={targetMember?.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold">{targetMember?.name}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium ml-8">Handpicked styles based on {targetMember?.name}'s preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('form')} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Edit2 size={16} className="text-[#3A10E5]" /> Edit Preferences
            </button>
            <button onClick={handleSaveLook} className="px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50 text-sm font-bold text-[#3A10E5] hover:bg-purple-100 transition-colors flex items-center gap-2">
              <Heart size={16} /> Save This Look
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col xl:flex-row justify-between gap-4 mt-2">
          <div className="flex flex-wrap items-center gap-3">
            {['Category', 'Occasion', 'Color', 'Size', 'Price', 'Sort by: Relevance'].map((filter, i) => (
              <button key={i} className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                {filter} <ChevronRight size={14} className="rotate-90 text-gray-400" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-sm font-semibold text-gray-600">24 Results</span>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button className="p-1.5 rounded bg-white text-[#3A10E5] shadow-sm"><LayoutGrid size={18} /></button>
              <button className="p-1.5 rounded text-gray-400 hover:text-gray-600"><List size={18} /></button>
            </div>
          </div>
        </div>

        {/* Applied Preferences Banner */}
        <div className="bg-[#F8F6FF] rounded-2xl p-4 border border-purple-100 flex items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 shrink-0">
              <Sparkles size={16} className="text-[#3A10E5]" /> Your Preferences
            </div>
            <div className="text-xs text-gray-600 font-medium leading-relaxed">
              Elegant • Regular Fit • Navy, Beige, White, Grey • Casual, Work, Party • Cotton, Linen, Silk +2
            </div>
          </div>
          <button className="text-xs font-bold text-[#3A10E5] hover:underline shrink-0">
            Clear All
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
          {recommendedOutfits.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* Match Badge */}
                {product.score > 0 && (
                  <div className="absolute top-3 left-3 bg-[#3A10E5] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    {Math.min(100, Math.round((product.score / 5) * 100))}% Match
                  </div>
                )}
                
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-colors">
                  <Heart size={16} />
                </button>
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[#3A10E5] transition-colors">{product.title}</h3>
                <div className="flex justify-between items-end">
                  <p className="text-sm font-bold text-gray-900">₹{parseFloat(product.price).toLocaleString()}</p>
                </div>
                
                {/* Style/Color Tags preview */}
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {(product.style_tags || []).slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{tag}</span>
                  ))}
                  {(product.color_tags || []).slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {recommendedOutfits.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Sparkles size={32} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-900">No matches found</h3>
              <p className="text-sm text-gray-500 mt-1">Try expanding your preferences or check back later for new arrivals.</p>
            </div>
          )}
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#F8F6FF] rounded-2xl p-6 border border-purple-100 mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0 text-[#3A10E5]">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Not finding what you're looking for?</h3>
              <p className="text-sm text-gray-600 font-medium">Try adjusting a few preferences or explore more styles.</p>
            </div>
          </div>
          <button 
            onClick={() => setView('form')}
            className="bg-white border-2 border-[#3A10E5] text-[#3A10E5] px-8 py-3 rounded-xl text-sm font-bold hover:bg-purple-50 transition-colors shadow-sm flex items-center justify-center gap-2 w-full md:w-auto whitespace-nowrap"
          >
            Refine Preferences
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 -mt-4 pb-12">
      
      {/* Header Area */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <h2 className="text-[28px] font-bold text-gray-900 font-serif">Preferences</h2>
            
            {/* Profile Selector */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-50 shrink-0">
                <img src={targetMember?.image || "/images/body_hourglass_1785826886362.jpg"} alt={targetMember?.name} className="w-full h-full object-cover" />
              </div>
              <div className="relative">
                <select 
                  value={selectedMemberId || ''} 
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="appearance-none bg-transparent text-gray-900 py-1 pl-1 pr-6 rounded text-sm font-bold focus:outline-none cursor-pointer"
                >
                  {members?.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} {member.isPrimary ? '(You)' : ''}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-gray-500">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Help us understand {targetMember?.isPrimary ? 'your' : `${targetMember?.name}'s`} style so we can show outfits {targetMember?.isPrimary ? "you'll" : "they'll"} love.</p>
        </div>
        <div className="bg-[#F8F6FF] text-[#3A10E5] px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium border border-purple-100">
          <Sparkles size={18} />
          These preferences help us personalize the shopping experience.
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Style Preference */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Style Preference</h3>
            <p className="text-xs text-gray-500 mt-1">Choose the styles you love</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(dynamicTags.style || []).map(style => (
              <div 
                key={style.id} 
                onClick={() => toggleSelection(style.id, selectedStyles, setSelectedStyles)}
                className={`flex flex-col items-center gap-2 cursor-pointer group rounded-xl p-2 transition-all ${
                  selectedStyles.includes(style.id) ? 'border-2 border-[#3A10E5] bg-purple-50/30' : 'border border-gray-100 hover:border-purple-200 hover:bg-gray-50'
                }`}
              >
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                  <img src={style.image_url || '/images/tailored-wool-coat.jpg'} alt={style.name} className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 right-1.5">
                    {selectedStyles.includes(style.id) ? (
                      <div className="w-5 h-5 bg-[#3A10E5] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-white/80 rounded-full border border-gray-300"></div>
                    )}
                  </div>
                </div>
                <span className={`text-[11px] font-bold text-center ${selectedStyles.includes(style.id) ? 'text-[#3A10E5]' : 'text-gray-600'}`}>
                  {style.name}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-[#3A10E5] text-xs font-bold flex items-center justify-center gap-1 hover:underline">
            View more styles <ChevronRight size={14} />
          </button>
        </div>

        {/* Color Preference */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Color Preference</h3>
            <p className="text-xs text-gray-500 mt-1">Choose the colors you're drawn to</p>
          </div>
          <div className="grid grid-cols-4 gap-y-4 gap-x-2 flex-1">
            {(dynamicTags.color || []).map(color => (
              <div 
                key={color.id}
                onClick={() => toggleSelection(color.id, selectedColors, setSelectedColors)}
                className="flex flex-col items-center gap-1.5 cursor-pointer relative"
              >
                <div className="relative">
                  <div 
                    className={`w-10 h-10 rounded-full ${color.hex_color === '#FFFFFF' || color.hex_color === '#ffffff' ? 'border border-gray-200' : ''}`}
                    style={{ background: color.hex_color || '#ccc' }}
                  />
                  {selectedColors.includes(color.id) && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#3A10E5] rounded-full flex items-center justify-center text-white border border-white shadow-sm">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-gray-600">{color.name}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-[#3A10E5] text-xs font-bold flex items-center justify-center gap-1 hover:underline">
            View more colors <ChevronRight size={14} />
          </button>
        </div>

        {/* Fit Preference */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Fit Preference</h3>
            <p className="text-xs text-gray-500 mt-1">How do you prefer your outfits to fit?</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(dynamicTags.fit || []).map(fit => (
              <div 
                key={fit.id} 
                onClick={() => setSelectedFit(fit.id)}
                className={`flex flex-col items-center gap-2 cursor-pointer group rounded-xl p-2 transition-all ${
                  selectedFit === fit.id ? 'border-2 border-[#3A10E5] bg-purple-50/30' : 'border border-gray-100 hover:border-purple-200 hover:bg-gray-50'
                }`}
              >
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                  <img src={fit.image_url || '/images/linen-overshirt.jpg'} alt={fit.name} className="w-full h-full object-contain mix-blend-multiply" />
                  <div className="absolute top-1.5 right-1.5">
                    {selectedFit === fit.id && (
                      <div className="w-5 h-5 bg-[#3A10E5] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
                <span className={`text-[11px] font-bold text-center ${selectedFit === fit.id ? 'text-[#3A10E5]' : 'text-gray-600'}`}>
                  {fit.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto bg-[#F8F9FA] rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <span className="text-lg">📏</span>
            </div>
            <p className="text-xs text-gray-600 font-medium">We'll use this to recommend the best fit for you.</p>
          </div>
        </div>

        {/* Occasion Preference */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Occasion Preference</h3>
            <p className="text-xs text-gray-500 mt-1">Select occasions you shop for</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(dynamicTags.occasion || []).map(occ => {
              const isSelected = selectedOccasions.includes(occ.id);
              return (
                <div 
                  key={occ.id} 
                  onClick={() => toggleSelection(occ.id, selectedOccasions, setSelectedOccasions)}
                  className={`flex flex-col items-center justify-center gap-2 cursor-pointer group rounded-xl p-3 transition-all relative aspect-square ${
                    isSelected ? 'border-2 border-[#3A10E5] bg-purple-50/30 text-[#3A10E5]' : 'border border-gray-200 hover:border-purple-200 hover:bg-gray-50 text-gray-500'
                  }`}
                >
                  {occ.image_url ? (
                    <img src={occ.image_url} alt={occ.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <Sun size={20} className={isSelected ? 'text-[#3A10E5]' : 'text-gray-400'} />
                  )}
                  <span className="text-[10px] font-bold text-center leading-tight">
                    {occ.name}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#3A10E5] rounded-full flex items-center justify-center text-white border border-white shadow-sm">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button className="mt-4 text-[#3A10E5] text-xs font-bold flex items-center justify-center gap-1 hover:underline">
            View more occasions <ChevronRight size={14} />
          </button>
        </div>

        {/* Fabric Preference */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Fabric Preference</h3>
            <p className="text-xs text-gray-500 mt-1">Choose the fabrics you like most</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(dynamicTags.fabric || []).map(fabric => {
              const isSelected = selectedFabrics.includes(fabric.id);
              return (
                <div 
                  key={fabric.id} 
                  onClick={() => toggleSelection(fabric.id, selectedFabrics, setSelectedFabrics)}
                  className={`flex flex-col items-center justify-center gap-2 cursor-pointer group rounded-xl p-2 transition-all relative ${
                    isSelected ? 'border-2 border-[#3A10E5] bg-purple-50/30 text-[#3A10E5]' : 'border border-gray-100 hover:border-purple-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-gray-100">
                      {fabric.image_url ? (
                        <img src={fabric.image_url} alt={fabric.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Shirt size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">
                    {fabric.name}
                  </span>
                  <div className="absolute top-1 right-1">
                    {isSelected ? (
                      <div className="w-4 h-4 bg-[#3A10E5] rounded-full flex items-center justify-center text-white border border-white shadow-sm">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-4 h-4 bg-white/80 rounded-full border border-gray-300"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button className="mt-4 text-[#3A10E5] text-xs font-bold flex items-center justify-center gap-1 hover:underline">
            View more fabrics <ChevronRight size={14} />
          </button>
        </div>

        {/* Content Preference */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
          <div className="mb-5">
            <h3 className="text-base font-bold text-gray-900">Content Preference</h3>
            <p className="text-xs text-gray-500 mt-1">What would you like to see more of?</p>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {(dynamicTags.content || []).map(content => {
              const isSelected = selectedContent.includes(content.id);
              return (
                <div 
                  key={content.id}
                  onClick={() => toggleSelection(content.id, selectedContent, setSelectedContent)}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-purple-50 text-[#3A10E5] flex items-center justify-center">
                      {content.image_url ? (
                        <img src={content.image_url} alt="" className="w-4 h-4 rounded object-cover" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{content.name}</span>
                  </div>
                  <div className="text-[#3A10E5]">
                    {isSelected ? <CheckSquare size={18} className="fill-[#3A10E5] text-white" /> : <Square size={18} className="text-gray-300" />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 bg-[#F8F6FF] rounded-xl p-4 flex items-center gap-3">
            <Sparkles size={16} className="text-[#3A10E5] shrink-0" />
            <p className="text-xs text-[#3A10E5] font-medium">We'll customize your feed and notifications.</p>
          </div>
        </div>

      </div>

      {/* Bottom CTA */}
      <div className="bg-[#F8F6FF] rounded-2xl p-6 border border-purple-100 mt-2 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0 text-[#3A10E5]">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Ready to see outfits you'll love?</h3>
            <p className="text-sm text-gray-600 font-medium">We'll show you the best picks based on your preferences.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-[#3A10E5] hover:bg-[#2A08B5] text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-70 whitespace-nowrap"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>Show My Outfits <ChevronRight size={18} /></>
          )}
        </button>
      </div>

    </div>
  );
}
