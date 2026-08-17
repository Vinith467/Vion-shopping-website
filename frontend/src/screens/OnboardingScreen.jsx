import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Users, Gift, Check, ChevronRight, ChevronDown, Edit2, ShieldCheck, Heart, Award, ArrowRight, ArrowLeft, RotateCcw, Search, ShoppingBag, Sparkles, Diamond, Truck, Headphones, Camera, Plus, Ruler, Palette, Scissors, UserPlus, Shirt, X, Trash2, Info, Box, RefreshCw, Calendar, Clock, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';

const sizes = [
  { id: 'S', name: 'S', femaleImg: '/images/size/female/f1.png', maleImg: '/images/size/male/m1.png' },
  { id: 'M', name: 'M', femaleImg: '/images/size/female/f2.png', maleImg: '/images/size/male/m2.png' },
  { id: 'L', name: 'L', femaleImg: '/images/size/female/f3.png', maleImg: '/images/size/male/m3.png' },
  { id: 'XL', name: 'XL', femaleImg: '/images/size/female/f4.png', maleImg: '/images/size/male/m4.png' },
  { id: 'XXL', name: 'XXL', femaleImg: '/images/size/female/f5.png', maleImg: '/images/size/male/m5.png' }
];

const heights = [
  { id: 'Below 5\'0"', name: 'Below 5\'0"', femaleImg: '/height/1.png', maleImg: '/images/male height/h1.png' },
  { id: '5\'0" - 5\'3"', name: '5\'0" - 5\'3"', femaleImg: '/height/2.png', maleImg: '/images/male height/h2.png' },
  { id: '5\'4" - 5\'7"', name: '5\'4" - 5\'7"', femaleImg: '/height/3.png', maleImg: '/images/male height/h3.png' },
  { id: '5\'8" - 6\'0"', name: '5\'8" - 6\'0"', femaleImg: '/height/4.png', maleImg: '/images/male height/h4.png' },
  { id: 'Above 6\'0"', name: 'Above 6\'0"', femaleImg: '/height/5.png', maleImg: '/images/male height/h5.png' }
];

const skinTones = [
  { id: 'Light', name: 'Light', color: '#F4D3B6' },
  { id: 'Medium', name: 'Medium', color: '#C28E66' },
  { id: 'Wheatish', name: 'Wheatish', color: '#985F35' },
  { id: 'Tan', name: 'Tan', color: '#6A3B18' }
];

const categoriesToShop = [
  { id: 'Casual', name: 'Casual', femaleImg: '/images/herobannerimage/casual.png', maleImg: '/images/herobannerimage/male version/casual.png', desc: 'Effortless everyday pieces.' },
  { id: 'Exclusive', name: 'Exclusive', femaleImg: '/images/herobannerimage/exclusive.png', maleImg: '/images/herobannerimage/male version/exclusive.png', desc: 'Elevated craftsmanship.' },
  { id: 'Exclusive Plus', name: 'Exclusive Plus', femaleImg: '/images/herobannerimage/exclusiveplus.png', maleImg: '/images/herobannerimage/male version/exclusiveplus.png', desc: 'Fully bespoke creations.' }
];

const occasionsList = [
  { id: 'Office / Work', icon: 'Briefcase' },
  { id: 'Casual Outing', icon: 'Coffee' },
  { id: 'Party / Evening', icon: 'GlassWater' },
  { id: 'Wedding / Festive', icon: 'Gift' },
  { id: 'Date Night', icon: 'Heart' },
  { id: 'Travel / Vacation', icon: 'Plane' },
  { id: 'Others', icon: 'MoreHorizontal' }
];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const { addToCart, addMember, updateMember, deleteMember, setSelectedConsumerId, setPrimaryMember, members } = useAppContext();
  const [step, setStep] = useState(1);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [shoppingFor, setShoppingFor] = useState('Myself');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState(() => {
    if (members && members.length > 0) {
      return members.map(m => ({
        id: m.id,
        name: m.name,
        isPrimary: m.isPrimary,
        gender: m.gender,
        size: m.measurements?.size || 'M',
        height: m.height,
        skinTone: m.skinTone,
        category: m.measurements?.category || 'Casual',
        occasions: m.measurements?.occasions || ['Office / Work'],
        avatarUrl: m.image,
        measurements: m.measurements || { bust: '', waist: '', hips: '' }
      }));
    }
    return [];
  });

  const defaultProfile = {
    id: '',
    name: 'Myself',
    gender: '',
    size: 'M',
    height: '5\'4" - 5\'7"',
    skinTone: 'Medium',
    category: 'Casual',
    occasions: ['Office / Work'],
    avatarUrl: '',
    measurements: { bust: '', waist: '', hips: '' }
  };
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [activeCollectionTab, setActiveCollectionTab] = useState('All Recommendations');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [skinToneColors, setSkinToneColors] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Product Details UI States
  const [selectedFitMode, setSelectedFitMode] = useState('size');
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
  
  // Profile Data
  const [profile, setProfile] = useState(() => savedProfiles.length > 0 ? savedProfiles[0] : defaultProfile);

  // Sync when members are loaded after component mounts
  React.useEffect(() => {
    if (members && members.length > 0) {
      const mappedProfiles = members.map(m => ({
        id: m.id,
        name: m.name,
        isPrimary: m.isPrimary,
        gender: m.gender,
        size: m.measurements?.size || 'M',
        height: m.height,
        skinTone: m.skinTone,
        category: m.measurements?.category || 'Casual',
        occasions: m.measurements?.occasions || ['Office / Work'],
        avatarUrl: m.image,
        measurements: m.measurements || { bust: '', waist: '', hips: '' }
      }));
      setSavedProfiles(mappedProfiles);
      // If we are currently showing the "Myself" placeholder, or the currently selected profile is no longer in the list, auto-select the first valid one
      setProfile(current => {
        if (!current.id || !mappedProfiles.find(p => p.id === current.id)) {
          return mappedProfiles[0];
        }
        return current;
      });
    }
  }, [members]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    async function fetchSkinToneColors() {
      if (!profile?.skinTone) {
        setSkinToneColors([]);
        return;
      }
      try {
        const { data, error } = await supabase.from('products').select('variations').not('variations', 'eq', '[]');
        if (error) throw error;
        
        const matchingColorsMap = new Map();
        if (data && data.length > 0) {
          data.forEach(product => {
            if (product.variations) {
              product.variations.forEach(variation => {
                if (variation.skinTone === profile.skinTone && variation.colorName) {
                  if (!matchingColorsMap.has(variation.colorName) || variation.shade_image_url) {
                    matchingColorsMap.set(variation.colorName, variation.shade_image_url);
                  }
                }
              });
            }
          });
        }
        setSkinToneColors(Array.from(matchingColorsMap.entries()).map(([colorName, shade_image_url]) => ({ colorName, shade_image_url })));
      } catch (err) {
        console.error('Error fetching skin tone colors:', err);
      }
    }
    fetchSkinToneColors();
  }, [profile?.skinTone]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-[100dvh] font-sans relative overflow-clip bg-[#e8d5c4]">
      {/* Background Image & Gradient - Hide on Step 4 for clean layout */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${step === 4 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-0 right-0 w-full lg:w-2/3 h-full">
          <img src="/images/onboarding_bg.jpg" alt="Background" className="w-full h-full object-cover object-center opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#e8d5c4]/50 to-[#e8d5c4] lg:via-[#e8d5c4]/80 lg:to-[#e8d5c4]"></div>
        </div>
        <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full bg-[#e8d5c4]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-[100dvh]">


        {/* Progress Bar Header */}
        <div className="px-0 md:px-6 lg:px-12 pt-5 pb-3 w-full max-w-7xl mx-auto relative overflow-hidden">
          <div className="flex items-center justify-start md:justify-between gap-8 md:gap-0 relative overflow-x-auto hide-scrollbar px-6 md:px-0 snap-x">
            <div className="absolute top-1/2 left-[5%] w-[90%] h-[1px] bg-black/10 -z-10 -translate-y-1/2 hidden md:block"></div>
            
            <div className={`items-center gap-2.5 pr-6 md:pr-4 shrink-0 z-10 snap-start cursor-pointer hover:opacity-80 transition-opacity ${step === 1 || (step === 2 && false) || (step === 4 && false) ? 'flex' : 'hidden md:flex'}`} onClick={() => setStep(1)}>
              <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold text-base shadow-md transition-colors ${step >= 1 ? 'bg-[#986427] text-white shadow-[0_4px_12px_rgba(152,100,39,0.3)]' : 'bg-[#EAE1D7] text-[#5A4232] border border-[#E5D5C5] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]'}`}>1</div>
              <span className={`text-[14px] md:text-[15px] font-[700] leading-tight ${step >= 1 ? 'text-[#3E2312]' : 'text-[#1A0A08]/80'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>Who are you<br/>shopping for?</span>
            </div>

            <div className={`items-center gap-2.5 px-6 md:px-4 shrink-0 z-10 snap-start cursor-pointer hover:opacity-80 transition-opacity ${step === 2 || step === 1 ? 'flex' : 'hidden md:flex'}`} onClick={() => setStep(2)}>
              <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold text-base shadow-md transition-colors ${step >= 2 ? 'bg-[#986427] text-white shadow-[0_4px_12px_rgba(152,100,39,0.3)]' : 'bg-[#EAE1D7] text-[#5A4232] border border-[#E5D5C5] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]'}`}>2</div>
              <span className={`text-[14px] md:text-[15px] font-[700] leading-tight ${step >= 2 ? 'text-[#3E2312]' : 'text-[#1A0A08]/80'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>Tell us about them<br/><span className={`text-[12px] md:text-[13px] ${step >= 2 ? 'font-[600]' : 'font-[600] text-[#1A0A08]/60'}`}>(Profile Details)</span></span>
            </div>

            <div className={`items-center gap-2.5 px-6 md:px-4 shrink-0 z-10 snap-start cursor-pointer hover:opacity-80 transition-opacity ${step === 3 || step === 2 || (step === 4) ? 'flex' : 'hidden md:flex'}`} onClick={() => setStep(3)}>
              <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold text-base shadow-md transition-colors ${step >= 3 ? 'bg-[#986427] text-white shadow-[0_4px_12px_rgba(152,100,39,0.3)]' : 'bg-[#EAE1D7] text-[#5A4232] border border-[#E5D5C5] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]'}`}>3</div>
              <span className={`text-[14px] md:text-[15px] font-[700] leading-tight ${step >= 3 ? 'text-[#3E2312]' : 'text-[#1A0A08]/80'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your VION Collection<br/><span className={`text-[12px] md:text-[13px] ${step >= 3 ? 'font-[600]' : 'font-[600] text-[#1A0A08]/60'}`}>(Recommended for them)</span></span>
            </div>

            <div className={`items-center gap-2.5 pl-6 md:pl-4 shrink-0 z-10 snap-start cursor-default ${step === 4 || step === 3 ? 'flex' : 'hidden md:flex'}`}>
              <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold text-base shadow-md transition-colors ${step >= 4 ? 'bg-[#986427] text-white shadow-[0_4px_12px_rgba(152,100,39,0.3)]' : 'bg-[#EAE1D7] text-[#5A4232] border border-[#E5D5C5] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]'}`}>4</div>
              <span className={`text-[14px] md:text-[15px] font-[700] leading-tight ${step >= 4 ? 'text-[#3E2312]' : 'text-[#1A0A08]/80'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>Shop with<br/>Confidence</span>
            </div>
          </div>
        </div>

      <div className="px-6 lg:px-12 max-w-7xl mx-auto flex-1 w-full pb-8">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              {/* Left Column */}
              <div className="flex-1 min-w-0 flex flex-col">
                
                {savedProfiles.length > 0 && !isAddingNew ? (
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                       <div>
                          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1A0A08] mb-4 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                            Who are you <br className="hidden sm:block"/>
                            <span className="italic text-[#986427] pr-1.5" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>shopping for?</span>
                          </h1>
                          <p className="text-[#3E2312]/90 text-[15px] md:text-[16px] lg:text-[18px] max-w-md" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, lineHeight: 1.6 }}>Select a profile to get personalised outfit recommendations.</p>
                       </div>
                    </div>
                    
                    <div>
                      <h3 className="font-serif text-[#1A0A08] text-2xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>Your Profiles</h3>
                      
                      <div className="relative group">
                         {/* Removed scroll fade indicators to prevent border blur */ }

                         <div className="flex gap-4 overflow-x-auto px-1 pt-3 pb-6 snap-x hide-scrollbar relative z-0">
                           {/* Add Someone New Card */}
                           <div onClick={() => setIsAddingNew(true)} className="relative cursor-pointer min-w-[200px] rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 bg-white/5 border-[1.5px] border-dashed border-[#986427]/40 hover:bg-white/10 hover:border-[#986427]/60 snap-center">
                             <div className="w-16 h-16 rounded-full bg-white/30 border border-white/60 flex items-center justify-center text-[#1A0A08] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_4px_12px_rgba(0,0,0,0.05)] mb-4">
                               <Plus size={28} strokeWidth={1.5} />
                             </div>
                             <span className="font-bold text-[#1A0A08] text-[18px] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Add<br/>Someone New</span>
                           </div>

                           {savedProfiles.map(p => {
                             const isMe = p.isPrimary;
                             return (
                               <div key={p.id} onClick={() => { setProfile(p); nextStep(); }} className={`group/card relative cursor-pointer min-w-[240px] max-w-[240px] rounded-2xl p-6 flex flex-col items-center transition-all duration-300 bg-white/10 backdrop-blur-xl border shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] snap-center ${profile.id === p.id ? 'border-[#986427]/60 bg-white/20 -translate-y-1' : 'border-white/45 hover:bg-white/20 hover:border-white/60'}`}>
                                 {profile.id === p.id ? (
                                   <div className="absolute top-4 right-4 bg-[#986427] text-white rounded-full p-1 shadow-sm"><Check size={14} strokeWidth={3} /></div>
                                 ) : (
                                   <div className="absolute top-4 right-4 w-5 h-5 rounded-full border border-[#986427]/40"></div>
                                 )}
                                 
                                 {isMe && <div className="absolute top-4 left-4 bg-[#986427] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">ME</div>}
                                 
                                 {!isMe && (
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setProfileToDelete(p); }}
                                     className="absolute top-4 left-4 w-7 h-7 rounded-full bg-white/50 border border-white/80 flex items-center justify-center text-red-500 opacity-0 group-hover/card:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm z-20"
                                     title="Delete Profile"
                                   >
                                     <Trash2 size={14} />
                                   </button>
                                 )}
                              
                              <div className="w-24 h-24 rounded-full mb-4 mt-2 overflow-hidden shadow-inner border-[3px] border-white/50 bg-[#E8DFD8]">
                                {p.avatarUrl ? <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#986427]"><User size={36} /></div>}
                              </div>
                              <h4 className="font-bold text-[#1A0A08] mb-5 text-[22px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</h4>
                              
                              <div className="w-full space-y-4 text-left">
                                 <div className="flex items-start gap-3">
                                   <span className="text-[#8B6544] mt-0.5"><Shirt size={16} strokeWidth={1.5} /></span>
                                   <div>
                                     <div className="text-[11px] font-bold uppercase tracking-wider text-[#1A0A08]/60">Size</div>
                                     <div className="text-[14px] font-medium text-[#1A0A08]">{p.size || '-'}</div>
                                   </div>
                                 </div>
                                 <div className="flex items-start gap-3">
                                   <span className="text-[#8B6544] mt-0.5"><Ruler size={16} strokeWidth={1.5} /></span>
                                   <div>
                                     <div className="text-[11px] font-bold uppercase tracking-wider text-[#1A0A08]/60">Height</div>
                                     <div className="text-[14px] font-medium text-[#1A0A08]">{p.height || '-'}</div>
                                   </div>
                                 </div>
                                 <div className="flex items-start gap-3">
                                   <span className="text-[#8B6544] mt-0.5"><Palette size={16} strokeWidth={1.5} /></span>
                                   <div>
                                     <div className="text-[11px] font-bold uppercase tracking-wider text-[#1A0A08]/60">Skin Tone</div>
                                     <div className="text-[14px] font-medium text-[#1A0A08]">{p.skinTone || '-'}</div>
                                   </div>
                                 </div>
                                 {p.measurements && (p.measurements.bust || p.measurements.waist || p.measurements.hips) ? (
                                   <div className="flex items-start gap-3">
                                     <span className="text-[#8B6544] mt-0.5"><Scissors size={16} strokeWidth={1.5} /></span>
                                     <div>
                                       <div className="text-[11px] font-bold uppercase tracking-wider text-[#1A0A08]/60">Measurement</div>
                                       <div className="text-[14px] font-medium text-[#1A0A08]">{p.measurements.bust || '-'}-{p.measurements.waist || '-'}-{p.measurements.hips || '-'} in</div>
                                     </div>
                                   </div>
                                 ) : (
                                   <div className="flex items-start gap-3">
                                     <span className="text-[#8B6544] mt-0.5"><Scissors size={16} strokeWidth={1.5} /></span>
                                     <div>
                                       <div className="text-[11px] font-bold uppercase tracking-wider text-[#1A0A08]/60">Measurement</div>
                                       <div className="text-[14px] font-medium text-[#1A0A08]">-</div>
                                     </div>
                                   </div>
                                 )}
                              </div>
                           </div>
                               );})}
                         </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h1 className="text-5xl lg:text-6xl font-serif text-[#1A0A08] mb-4 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                        Who are you <br/>
                        <span 
                          className="italic text-[#986427] pr-1.5"
                          style={{ 
                            fontFamily: "'Cormorant Garamond', serif", 
                            fontWeight: 600
                          }}>
                          shopping for
                        </span> today?
                      </h1>
                      <p className="text-[#3E2312]/90 text-[16px] lg:text-[18px] max-w-md" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, lineHeight: 1.6 }}>Create a profile for yourself or someone else to get personalised outfit recommendations.</p>
                    </div>

                    <div className="space-y-6">
                      <h3 className="font-serif text-[#1A0A08] text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>Create a Profile</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                        {/* Myself */}
                        <div 
                          onClick={() => { 
                            setShoppingFor('Myself'); 
                            setProfile(prev => ({...defaultProfile, name: 'Myself', gender: ''}));
                            setShowNameModal(true);
                          }}
                          className={`relative cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 bg-white/10 backdrop-blur-xl border border-white/45 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] hover:bg-white/20 hover:border-white/60 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-2px_4px_rgba(0,0,0,0.15),_0_14px_36px_rgba(0,0,0,0.12)] ${shoppingFor === 'Myself' ? 'bg-white/25 border-white/70 -translate-y-1' : ''}`}
                        >
                          {shoppingFor === 'Myself' ? (
                            <div className="absolute top-4 right-4 bg-[#986427] text-white rounded-full p-1 shadow-sm"><Check size={14} strokeWidth={3} /></div>
                          ) : (
                            <div className="absolute top-4 right-4"><div className="w-6 h-6 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[#986427] text-sm font-bold">+</div></div>
                          )}
                          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-[#986427] text-white">
                            <User size={24} />
                          </div>
                          <h4 className="font-bold text-[#1A0A08] mb-2 text-[18px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>For Myself</h4>
                          <p className="text-[14px] text-[#3E2312]/90 leading-relaxed font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Find styles that suit your unique body, height, skin tone and style.</p>
                        </div>

                        {/* Someone Else */}
                        <div 
                          onClick={() => { 
                            setShoppingFor('Someone Else'); 
                            setProfile(prev => ({...defaultProfile, name: '', gender: ''}));
                            setShowNameModal(true);
                          }}
                          className={`relative cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 bg-white/10 backdrop-blur-xl border border-white/45 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] hover:bg-white/20 hover:border-white/60 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-2px_4px_rgba(0,0,0,0.15),_0_14px_36px_rgba(0,0,0,0.12)] ${shoppingFor === 'Someone Else' ? 'bg-white/25 border-white/70 -translate-y-1' : ''}`}
                        >
                          {shoppingFor === 'Someone Else' ? (
                            <div className="absolute top-4 right-4 bg-[#986427] text-white rounded-full p-1 shadow-sm"><Check size={14} strokeWidth={3} /></div>
                          ) : (
                            <div className="absolute top-4 right-4"><div className="w-6 h-6 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[#986427] text-sm font-bold">+</div></div>
                          )}
                          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-[#986427] text-white">
                            <Users size={24} />
                          </div>
                          <h4 className="font-bold text-[#1A0A08] mb-2 text-[18px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>For Someone Else</h4>
                          <p className="text-[14px] text-[#3E2312]/90 leading-relaxed font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Create a profile for your loved one and find the perfect outfits for them.</p>
                        </div>

                        {/* Gift */}
                        <div 
                          onClick={() => { 
                            setShoppingFor('Gift'); 
                            setProfile(prev => ({...defaultProfile, name: '', gender: ''}));
                            setShowNameModal(true);
                          }}
                          className={`relative cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 bg-white/10 backdrop-blur-xl border border-white/45 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] hover:bg-white/20 hover:border-white/60 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-2px_4px_rgba(0,0,0,0.15),_0_14px_36px_rgba(0,0,0,0.12)] ${shoppingFor === 'Gift' ? 'bg-white/25 border-white/70 -translate-y-1' : ''}`}
                        >
                          {shoppingFor === 'Gift' ? (
                            <div className="absolute top-4 right-4 bg-[#986427] text-white rounded-full p-1 shadow-sm"><Check size={14} strokeWidth={3} /></div>
                          ) : (
                            <div className="absolute top-4 right-4"><div className="w-6 h-6 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[#986427] text-sm font-bold">+</div></div>
                          )}
                          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-[#986427] text-white">
                            <Gift size={24} />
                          </div>
                          <h4 className="font-bold text-[#1A0A08] mb-2 text-[18px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>For a Gift</h4>
                          <p className="text-[14px] text-[#3E2312]/90 leading-relaxed font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Not sure who yet? You can update the details later.</p>
                        </div>
                      </div>


                    </div>
                  </>
                )}
                  {/* Safety bar */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5 flex items-center gap-4 border border-white/45 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] mt-2">
                    <ShieldCheck className="text-[#8B6544] w-6 h-6 shrink-0" strokeWidth={2} />
                    <div>
                      <h4 className="font-bold text-[15px] text-[#1A0A08] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your information is safe with VION</h4>
                      <p className="text-[13px] text-[#555] font-medium leading-snug">We never share your data. Your privacy is our priority.</p>
                    </div>
                  </div>
                  
                  {/* Bottom Trust Banner */}
                  <div className="hidden lg:flex items-center justify-between bg-white/10 backdrop-blur-2xl border border-white/50 rounded-2xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.85),_inset_0_-1.5px_3px_rgba(0,0,0,0.1),_0_12px_32px_rgba(0,0,0,0.08)] py-5 px-6 mt-4">
                    {[
                      { icon: <RotateCcw size={20} className="text-[#8B6544]" strokeWidth={2} />, title: "Easy Returns", desc: "15 days return" },
                      { icon: <ShieldCheck size={20} className="text-[#8B6544]" strokeWidth={2} />, title: "Secure Payment", desc: "100% protected" },
                      { icon: <Award size={20} className="text-[#8B6544]" strokeWidth={2} />, title: "Premium Quality", desc: "Finest fabrics" },
                      { icon: <Heart size={20} className="text-[#8B6544]" strokeWidth={2} />, title: "Loved by 10,000+ Women", desc: "For personalised fashion" }
                    ].map((item, idx, arr) => (
                      <div key={idx} className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="shrink-0">{item.icon}</div>
                          <div>
                            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">{item.title}</p>
                            <p className="text-[12px] text-[#555] font-medium leading-snug">{item.desc}</p>
                          </div>
                        </div>
                        {idx < arr.length - 1 && <div className="hidden lg:block w-[1px] h-10 bg-[#C5B8A8]"></div>}
                      </div>
                    ))}
                  </div>

                </div>

              {/* Info Sidebar (when no profiles or adding new) */}
              {(savedProfiles.length === 0 || isAddingNew) && (
                <div className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-[#8B6544]/5 backdrop-blur-xl border border-[#8B6544]/20 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6)] rounded-3xl p-7 sticky top-24">
                    <h4 className="font-bold text-[#1A0A08] mb-6 text-[20px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Why create a profile?</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/40 p-2 rounded-full shrink-0 text-[#8B6544] shadow-sm border border-white/50"><User size={16} strokeWidth={2.5} /></div>
                        <span className="text-[14px] font-bold text-[#3E2312]/90">Personalised for You</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/40 p-2 rounded-full shrink-0 text-[#8B6544] shadow-sm border border-white/50"><Sparkles size={16} strokeWidth={2.5} /></div>
                        <span className="text-[14px] font-bold text-[#3E2312]/90">Better Recommendations</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/40 p-2 rounded-full shrink-0 text-[#8B6544] shadow-sm border border-white/50"><Heart size={16} strokeWidth={2.5} /></div>
                        <span className="text-[14px] font-bold text-[#3E2312]/90">Shop for Everyone</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/40 p-2 rounded-full shrink-0 text-[#8B6544] shadow-sm border border-white/50"><ShoppingBag size={16} strokeWidth={2.5} /></div>
                        <span className="text-[14px] font-bold text-[#3E2312]/90">Faster Checkout</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/40 p-2 rounded-full shrink-0 text-[#8B6544] shadow-sm border border-white/50"><Diamond size={16} strokeWidth={2.5} /></div>
                        <span className="text-[14px] font-bold text-[#3E2312]/90">Exclusive Perks</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/40 p-2 rounded-full shrink-0 text-[#8B6544] shadow-sm border border-white/50"><Headphones size={16} strokeWidth={2.5} /></div>
                        <span className="text-[14px] font-bold text-[#3E2312]/90">Priority Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Sidebar */}
              {savedProfiles.length > 0 && !isAddingNew && (
                <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/45 rounded-3xl p-6 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] sticky top-24">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl text-[#1A0A08] font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Selected Profile</h3>
                      <button onClick={() => nextStep()} className="text-[14px] font-bold flex items-center gap-1.5 text-[#1A0A08] hover:text-[#5E422B] transition-colors">Edit <Edit2 size={14} /></button>
                    </div>
                    
                    {profile.isPrimary ? (
                      <div className="bg-[#E8DFD8]/80 text-[#8B6544] text-[11px] font-bold px-3 py-1 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] w-fit mb-6 border border-white/50">Default</div>
                    ) : (
                      <button 
                        onClick={() => {
                          setPrimaryMember(profile.id);
                          setProfile(prev => ({ ...prev, isPrimary: true }));
                          setSavedProfiles(prev => prev.map(p => ({ ...p, isPrimary: p.id === profile.id })));
                        }}
                        className="bg-white/40 hover:bg-white/70 text-[#1A0A08] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm w-fit mb-6 border border-white/60 transition-colors"
                      >
                        Set as Default
                      </button>
                    )}
                    
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-[100px] h-[100px] rounded-full mb-3 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-4 border-white/60 bg-[#E8DFD8]">
                        {profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#986427]"><User size={40} /></div>}
                      </div>
                      <h4 className="font-bold text-[24px] text-[#1A0A08]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{profile.name}</h4>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-start gap-4 pb-4 border-b border-[#1A0A08]/5">
                        <span className="text-[#8B6544] mt-0.5"><Shirt size={18} strokeWidth={1.5} /></span>
                        <div>
                          <div className="text-[13px] font-bold text-[#1A0A08] mb-0.5">Size</div>
                          <div className="text-[14px] font-medium text-[#555]">{profile.size || '-'}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 pb-4 border-b border-[#1A0A08]/5">
                        <span className="text-[#8B6544] mt-0.5"><Ruler size={18} strokeWidth={1.5} /></span>
                        <div>
                          <div className="text-[13px] font-bold text-[#1A0A08] mb-0.5">Height</div>
                          <div className="text-[14px] font-medium text-[#555]">{profile.height || '-'}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 pb-4 border-b border-[#1A0A08]/5">
                        <span className="text-[#8B6544] mt-0.5"><Palette size={18} strokeWidth={1.5} /></span>
                        <div>
                          <div className="text-[13px] font-bold text-[#1A0A08] mb-0.5">Skin Tone</div>
                          <div className="text-[14px] font-medium text-[#555]">{profile.skinTone || '-'}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 pb-4 border-b border-[#1A0A08]/5">
                        <span className="text-[#8B6544] mt-0.5"><Scissors size={18} strokeWidth={1.5} /></span>
                        <div>
                          <div className="text-[13px] font-bold text-[#1A0A08] mb-0.5">Measurement</div>
                          <div className="text-[14px] font-medium text-[#555]">
                            {profile.measurements?.bust || profile.measurements?.waist || profile.measurements?.hips 
                              ? `${profile.measurements.bust || '-'}-${profile.measurements.waist || '-'}-${profile.measurements.hips || '-'} in` 
                              : '-'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 pb-4">
                        <span className="text-[#8B6544] mt-0.5"><User size={18} strokeWidth={1.5} /></span>
                        <div>
                          <div className="text-[13px] font-bold text-[#1A0A08] mb-0.5">Lifestyle Preference</div>
                          <div className="text-[14px] font-medium text-[#555]">{profile.occasions?.length > 0 ? profile.occasions.join(' & ') : 'Work & Everyday'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 bg-white/20 backdrop-blur-md rounded-2xl p-4 flex gap-3 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.7)] border border-white/40">
                      <Sparkles size={20} className="text-[#8B6544] shrink-0 mt-0.5" />
                      <p className="text-[13px] font-medium text-[#3E2312]/90 leading-snug">
                        We'll show outfits based on this profile and preferences. You can change them anytime during your shopping.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col lg:flex-row gap-10">
            
            <div className="flex-1 w-full space-y-8">
              <div className="mb-6">
                <h1 className="text-4xl font-serif text-gray-900 mb-2">Let's find what suits <span className="italic text-[#A3523B]">you</span> best</h1>
                <p className="text-gray-600">Answer a few simple questions and we'll handpick outfits that flatter you and match your style.</p>
              </div>

              <div className="space-y-6">
                
                {/* Size */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/45 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] rounded-3xl p-7">
                  <h3 className="font-bold text-[#1A0A08] mb-5 text-[18px] flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>1. Size</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {sizes.map(sizeObj => {
                      const sizeImg = (profile.gender === 'Male') ? sizeObj.maleImg : sizeObj.femaleImg;
                      return (
                        <button 
                          key={sizeObj.id} 
                          onClick={() => setProfile({...profile, size: sizeObj.id})}
                          className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all duration-300 ${profile.size === sizeObj.id ? 'border-white/80 bg-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.8),_0_4px_12px_rgba(0,0,0,0.05)] -translate-y-1' : 'border-white/30 bg-white/10 hover:bg-white/30 hover:border-white/60 shadow-[inset_0_1px_4px_rgba(255,255,255,0.5)] hover:-translate-y-0.5'}`}
                        >
                          {profile.size === sizeObj.id && <div className="absolute -top-1 -right-1 bg-[#986427] text-white rounded-full p-0.5 z-10 shadow-md"><Check size={10} strokeWidth={3} /></div>}
                          <div className="h-20 flex items-end justify-center mb-2">
                            <img src={sizeImg} alt={sizeObj.name} className="h-full w-auto object-contain opacity-90 drop-shadow-sm mix-blend-multiply" />
                          </div>
                          <span className="text-[11px] font-bold tracking-widest text-[#1A0A08] text-center leading-tight uppercase">{sizeObj.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Height & Skin Tone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Height */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/45 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] rounded-3xl p-7">
                    <h3 className="font-bold text-[#1A0A08] mb-5 text-[18px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>2. Height</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {heights.map(h => {
                        const heightImg = (profile.gender === 'Male') ? h.maleImg : h.femaleImg;
                        return (
                          <button 
                            key={h.id} 
                            onClick={() => setProfile({...profile, height: h.id})}
                            className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all duration-300 ${profile.height === h.id ? 'border-white/80 bg-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.8),_0_4px_12px_rgba(0,0,0,0.05)] -translate-y-1' : 'border-white/30 bg-white/10 hover:bg-white/30 hover:border-white/60 shadow-[inset_0_1px_4px_rgba(255,255,255,0.5)] hover:-translate-y-0.5'}`}
                          >
                            {profile.height === h.id && <div className="absolute -top-1 -right-1 bg-[#986427] text-white rounded-full p-0.5 z-10 shadow-md"><Check size={10} strokeWidth={3} /></div>}
                            <div className="h-20 flex items-end justify-center mb-2">
                              <img src={heightImg} alt={h.name} className="h-full w-auto object-contain opacity-90 drop-shadow-sm mix-blend-multiply" />
                            </div>
                            <span className="text-[9px] font-bold tracking-widest text-[#1A0A08] text-center leading-tight uppercase">{h.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skin Tone */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/45 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] rounded-3xl p-7">
                    <h3 className="font-bold text-[#1A0A08] mb-5 text-[18px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>3. Skin Tone</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {skinTones.map(tone => (
                        <button 
                          key={tone.id} 
                          onClick={() => setProfile({...profile, skinTone: tone.id})}
                          className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all duration-300 ${profile.skinTone === tone.id ? 'border-white/80 bg-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.8),_0_4px_12px_rgba(0,0,0,0.05)] -translate-y-1' : 'border-white/30 bg-white/10 hover:bg-white/30 hover:border-white/60 shadow-[inset_0_1px_4px_rgba(255,255,255,0.5)] hover:-translate-y-0.5'}`}
                        >
                          {profile.skinTone === tone.id && <div className="absolute -top-1 -right-1 bg-[#986427] text-white rounded-full p-0.5 z-10 shadow-md"><Check size={10} strokeWidth={3} /></div>}
                          <div className="w-10 h-10 rounded-full mb-2 shadow-inner border-[1.5px] border-white/60" style={{ backgroundColor: tone.color }}></div>
                          <span className="text-[9px] font-bold tracking-widest text-[#1A0A08] uppercase">{tone.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>


                {/* Category to Shop */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/45 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] rounded-3xl p-7">
                  <h3 className="font-bold text-[#1A0A08] mb-5 text-[18px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>4. Category to Shop</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categoriesToShop.map(cat => {
                      const catImg = (profile.gender === 'Male') ? cat.maleImg : cat.femaleImg;
                      return (
                      <button 
                        key={cat.id} 
                        onClick={() => setProfile({...profile, category: cat.id})}
                        className={`relative w-full aspect-[16/11] flex items-stretch rounded-2xl overflow-hidden transition-all duration-300 text-left group
                          ${profile.category === cat.id 
                            ? 'shadow-[0_10px_30px_rgba(152,100,39,0.25)] -translate-y-1' 
                            : 'shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
                          }`}
                      >
                        {/* Overall Glossy 3D Overlay for the entire card */}
                        <div className={`absolute inset-0 z-20 pointer-events-none rounded-2xl border-[1.5px] transition-colors duration-300
                          ${profile.category === cat.id 
                            ? 'border-white/90 shadow-[inset_0_0_20px_rgba(255,255,255,0.8)]' 
                            : 'border-white/50 group-hover:border-white/80 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6)]'
                          }`}
                        >
                           {/* Subtle top reflection for extra gloss */}
                           <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl"></div>
                        </div>

                        {/* Full Image Background */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                           <img 
                             src={catImg} 
                             alt={cat.name} 
                             className={`w-full h-full object-cover object-top transition-transform duration-700 ${profile.category === cat.id ? 'scale-105' : 'group-hover:scale-105'}`} 
                             onError={(e) => {
                               e.target.src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80&auto=format&fit=crop";
                             }}
                           />
                           <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/20"></div>
                        </div>

                        {/* Left Side: Text Area (No background to prevent white effect) */}
                        <div className="w-[75%] p-3 xl:p-4 flex flex-col justify-center relative z-10">
                           <h4 className="text-[13px] xl:text-[15px] tracking-[0.08em] text-white drop-shadow-md mb-1 uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                             {cat.name}
                           </h4>
                           <p className="text-[9px] xl:text-[10px] text-white/90 leading-snug font-medium mb-3 pr-6 drop-shadow-md">
                             {cat.desc}
                           </p>
                           
                           {/* Button */}
                           <div className={`px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-[0.1em] w-fit flex items-center gap-1 transition-colors relative z-30
                              ${profile.category === cat.id 
                                ? 'bg-[#986427] text-white shadow-md border border-[#986427]' 
                                : 'border border-white/80 text-white bg-white/20 group-hover:border-white group-hover:bg-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.05)]'
                              }`}
                           >
                             {profile.category === cat.id ? (
                               <>SELECTED <Check size={8} strokeWidth={3} /></>
                             ) : (
                               <>SELECT <ArrowRight size={8} strokeWidth={2} className="text-white" /></>
                             )}
                           </div>
                        </div>
                      </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-8 pb-4">
                  <button onClick={prevStep} className="relative overflow-hidden w-32 bg-white/20 backdrop-blur-md text-[#1A0A08] rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition-all duration-300 border border-white/40 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.5),_0_8px_16px_rgba(0,0,0,0.05)] group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform text-[#8B6544]" />
                    <span className="relative z-10 text-[16px] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.05em' }}>Back</span>
                  </button>

                  <button 
                    disabled={isGenerating}
                    onClick={async () => {
                      if (isGenerating) return;
                      setIsGenerating(true);
                      try {
                        setIsAddingNew(false);
                        // Generate a temporary ID or save to backend
                        let memberId = profile.id;
                        if (!memberId) {
                          const newId = await addMember(profile);
                          if (newId) {
                            memberId = newId;
                            setProfile(prev => ({...prev, id: newId}));
                            setSelectedConsumerId(newId);
                          }
                        } else {
                          await updateMember(memberId, profile);
                          setSelectedConsumerId(memberId);
                        }
                        
                        setSavedProfiles(prev => {
                          const exists = prev.find(p => p.id === memberId);
                          if (exists) return prev.map(p => p.id === memberId ? profile : p);
                          return [...prev, profile];
                        });
                        
                        nextStep();
                        
                        // Fetch products based on profile
                        setIsLoadingProducts(true);
                        let query = supabase.from('products').select('*, category:categories(name)');
                        // Only fetch active products
                        query = query.eq('status', 'active');
                        
                        // Strict filters based on profile
                        if (profile.gender) {
                          query = query.contains('target_genders', [profile.gender]);
                        }
                        if (profile.category) { // Collection Class (Casual, Exclusive, etc)
                          query = query.contains('target_body_shapes', [profile.category]);
                        }
                        if (profile.size) {
                          query = query.or(`size.eq.all,size.ilike.%${profile.size}%`);
                        }
                        if (profile.height) {
                          query = query.or(`body_shape.eq.all,body_shape.ilike.%${profile.height}%`);
                        }
                        // Occasions are handled by frontend tabs, so we don't strictly filter them in the DB query here.
                        
                        const { data } = await query.order('created_at', { ascending: false }).limit(20);
                        if (data) setFetchedProducts(data);
                        setIsLoadingProducts(false);
                      } finally {
                        setIsGenerating(false);
                      }
                  }} className={`relative overflow-hidden flex-1 max-w-[320px] text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 transition-all duration-300 border border-white/20 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3),_inset_0_-2px_6px_rgba(0,0,0,0.8),_0_12px_24px_rgba(26,10,8,0.3)] group ${isGenerating ? 'bg-[#3A2419] opacity-70 cursor-not-allowed' : 'bg-gradient-to-b from-[#3A2419] to-[#1A0A08] hover:from-[#4A3022] hover:to-[#240E0C]'}`}>
                    {/* Top glass reflection */}
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none"></div>
                    
                    <span className="relative z-10 flex items-center gap-2 tracking-wide drop-shadow-md text-[16px] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.05em' }}>
                      {isGenerating ? 'Generating...' : 'Generate My Collection'}
                      {!isGenerating && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </span>
                  </button>
                </div>
              </div>
            </div>

             {/* Profile Summary Sidebar */}
             <div className="w-full lg:w-80 shrink-0">
                 <div className="bg-white/10 backdrop-blur-xl border border-white/45 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] rounded-3xl p-7 sticky top-24">
                  <div className="flex items-center justify-between mb-6 border-b border-white/20 pb-4">
                    <h3 className="font-bold text-[#1A0A08] text-[20px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your VION Profile</h3>
                  </div>
                  
                  <div className="flex flex-col items-center mb-6">
                    <label className="relative cursor-pointer group block mb-4 w-24 h-24 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.15)] border-4 border-white/80 overflow-hidden">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover transition-opacity group-hover:opacity-70" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f5ece3] to-[#e8d5c4] text-[#986427] transition-opacity group-hover:opacity-70"><User size={36} /></div>}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <Camera size={24} className="text-white drop-shadow-md" />
                      </div>
                    </label>
                    {isEditingName ? (
                      <input 
                        type="text" 
                        value={profile.name} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        onBlur={() => setIsEditingName(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                        className="bg-white/50 border border-white/60 rounded-lg px-2 py-1 text-xl font-bold text-[#1A0A08] text-center w-40 focus:outline-none focus:ring-2 focus:ring-[#986427]/50 shadow-inner"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xl text-[#1A0A08]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{profile.name}</h4>
                        <button onClick={() => setIsEditingName(true)} className="text-[#8B6544] hover:text-[#5E422B] transition-colors"><Edit2 size={14} /></button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start justify-between pb-4 border-b border-white/20">
                      <div className="flex items-start gap-3">
                         <Users size={18} className="text-[#8B6544] mt-0.5" />
                         <div>
                           <p className="text-[10px] text-[#3E2312]/60 font-bold uppercase tracking-wider mb-0.5">Gender</p>
                           {isEditingGender ? (
                              <div className="flex gap-2 mt-1">
                                <button onClick={() => { setProfile({...profile, gender: 'Female'}); setIsEditingGender(false); }} className={`text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-md border transition-all ${profile.gender === 'Female' || !profile.gender ? 'bg-[#986427] text-white border-[#986427] shadow-sm' : 'bg-white/50 border-white/60 text-[#1A0A08] hover:bg-white/70'}`}>Female</button>
                                <button onClick={() => { setProfile({...profile, gender: 'Male'}); setIsEditingGender(false); }} className={`text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-md border transition-all ${profile.gender === 'Male' ? 'bg-[#986427] text-white border-[#986427] shadow-sm' : 'bg-white/50 border-white/60 text-[#1A0A08] hover:bg-white/70'}`}>Male</button>
                              </div>
                           ) : (
                              <p className="text-sm font-bold text-[#1A0A08]">{profile.gender || 'Female'}</p>
                           )}
                         </div>
                      </div>
                      {!isEditingGender && (
                        <button onClick={() => setIsEditingGender(true)} className="text-[#8B6544] hover:text-[#5E422B] transition-colors mt-0.5"><Edit2 size={14} /></button>
                      )}
                    </div>
                    <div className="flex items-start gap-3 pb-4 border-b border-white/20">
                       <User size={18} className="text-[#8B6544] mt-0.5" />
                       <div>
                         <p className="text-[10px] text-[#3E2312]/60 font-bold uppercase tracking-wider mb-0.5">Size</p>
                         <p className="text-sm font-bold text-[#1A0A08]">{profile.size}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3 pb-4 border-b border-white/20">
                       <div className="w-[18px] flex justify-center text-[#8B6544] mt-0.5 font-bold">I</div>
                       <div>
                         <p className="text-[10px] text-[#3E2312]/60 font-bold uppercase tracking-wider mb-0.5">Height</p>
                         <p className="text-sm font-bold text-[#1A0A08]">{profile.height}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3 pb-4 border-b border-white/20">
                       <div className="w-[18px] h-[18px] rounded-full border-2 border-white/80 shadow-sm mt-0.5" style={{ backgroundColor: skinTones.find(t=>t.id === profile.skinTone)?.color }}></div>
                       <div>
                         <p className="text-[10px] text-[#3E2312]/60 font-bold uppercase tracking-wider mb-0.5">Skin Tone</p>
                         <p className="text-sm font-bold text-[#1A0A08]">{profile.skinTone}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3 pb-4 border-b border-white/20">
                       <Award size={18} className="text-[#8B6544] mt-0.5" />
                       <div>
                         <p className="text-[10px] text-[#3E2312]/60 font-bold uppercase tracking-wider mb-0.5">Category</p>
                         <p className="text-sm font-bold text-[#1A0A08]">{profile.category}</p>
                       </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-white/20 p-4 rounded-xl border border-white/40 shadow-[inset_0_1px_4px_rgba(255,255,255,0.6)]">
                    <p className="text-[12px] text-[#1A0A08] leading-relaxed font-medium">
                      <Sparkles size={14} className="inline text-[#986427] mr-1" />
                      We'll curate outfits that flatter your size {profile.size}, suit your height and complement your skin tone.
                    </p>
                  </div>
                </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-serif text-gray-900">Your VION Collection for <span className="italic text-[#A3523B]">{profile.name}</span></h1>
              <Heart className="text-gray-400 w-6 h-6 ml-2" />
            </div>
            <p className="text-gray-600 mb-8">Handpicked styles that fit size {profile.size}, {profile.height} height and {profile.skinTone} skin tone.</p>

            <div className="flex flex-col lg:flex-row gap-8">
              
              <div className="flex-1 w-full min-w-0">
                {/* Filters Row */}
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),_0_4px_12px_rgba(0,0,0,0.05)] rounded-full px-4 py-2 text-sm font-bold text-[#1A0A08] drop-shadow-sm">
                    <User size={16} /> Size: {profile.size}
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),_0_4px_12px_rgba(0,0,0,0.05)] rounded-full px-4 py-2 text-sm font-bold text-[#1A0A08] drop-shadow-sm">
                    <div className="w-4 flex justify-center font-bold">I</div> Height: {profile.height}
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),_0_4px_12px_rgba(0,0,0,0.05)] rounded-full px-4 py-2 text-sm font-bold text-[#1A0A08] drop-shadow-sm">
                    <div className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: skinTones.find(t=>t.id === profile.skinTone)?.color }}></div> Skin Tone: {profile.skinTone}
                  </div>
                  <button onClick={prevStep} className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),_0_4px_12px_rgba(0,0,0,0.08)] rounded-full px-4 py-2 text-sm font-bold text-[#1A0A08] hover:bg-white/30 transition-all ml-auto">
                    Edit Preference <Edit2 size={14} />
                  </button>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/45 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl p-5 mb-8 flex items-start gap-3">
                  <Sparkles className="text-[#8B6544] shrink-0 mt-0.5" size={18} />
                  <p className="text-sm font-medium text-[#1A0A08]/90">These outfits are chosen to enhance proportion, highlight your best features, and match your category preference.</p>
                </div>

                {/* Tabs */}
                <div className="flex items-center border-b border-white/30 mb-6 overflow-x-auto hide-scrollbar">
                  {['All Recommendations', 'Work & Everyday', 'Elegant & Festive', 'Smart Casual', 'Occasion Wear'].map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveCollectionTab(tab)}
                      className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeCollectionTab === tab ? 'text-[#1A0A08] border-b-2 border-[#1A0A08] drop-shadow-sm' : 'text-[#1A0A08]/60 hover:text-[#1A0A08]'}`}
                    >
                      {tab}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-2 pb-2 pl-4">
                     <span className="text-sm font-medium text-[#1A0A08]/70">Sort by:</span>
                     <select className="bg-transparent text-sm font-bold text-[#1A0A08] focus:outline-none cursor-pointer">
                        <option>Recommended</option>
                        <option>Newest</option>
                        <option>Price: Low to High</option>
                     </select>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {isLoadingProducts ? (
                    <div className="col-span-full py-20 flex justify-center">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#986427] rounded-full animate-spin"></div>
                    </div>
                  ) : fetchedProducts.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-500 font-serif text-lg">
                      No exact matches found for your profile. Try adjusting your preferences.
                    </div>
                  ) : (
                    fetchedProducts.filter(item => {
                      if (activeCollectionTab === 'All Recommendations') return true;
                      return item.occasion_tags?.includes(activeCollectionTab);
                    }).map((item) => {
                      const matchingVar = item.variations?.find(v => v.skinTone === profile.skinTone || v.skin_tone === profile.skinTone);
                      const displayImage = (matchingVar?.image_urls?.[0]) || (item.images && item.images[0]) || "/images/herobannerimage/casual.png";
                      const displayColor = matchingVar?.color_name || "";
                      const displayTitle = item.title + (displayColor ? ` - ${displayColor}` : '');

                      return (
                      <div 
                        key={item.id} 
                        onClick={() => {
                          setSelectedProduct({
                            id: item.id,
                            name: displayTitle,
                            price: `₹ ${(item.price || 0).toLocaleString()}`,
                            image: displayImage,
                            description: item.description || "A beautifully crafted piece for your wardrobe.",
                            highlights: ["Premium breathable fabric", "Flattering silhouette", "Easy care"],
                            originalItem: item
                          });
                          setStep(4);
                        }}
                        className="group cursor-pointer bg-white/10 backdrop-blur-md border border-white/40 rounded-2xl p-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),_0_8px_16px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                      >
                        <div className="relative rounded-xl overflow-hidden mb-3 aspect-[3/4] bg-black/5 shadow-inner">
                          <img src={displayImage} alt={item.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                          <button onClick={(e) => { e.stopPropagation(); }} className="absolute top-3 right-3 p-2 bg-white/40 hover:bg-white/60 rounded-full text-[#1A0A08] hover:text-red-500 transition-colors backdrop-blur-md border border-white/50 shadow-sm">
                            <Heart size={16} />
                          </button>
                        </div>
                        <h4 className="font-bold text-[#1A0A08] text-sm mb-1 px-1 drop-shadow-sm line-clamp-1">{displayTitle}</h4>
                        <div className="flex justify-between items-center px-1 mb-1">
                          <span className="font-bold text-[#1A0A08]/80 text-sm">₹ {(item.price || 0).toLocaleString()}</span>
                        </div>
                        <div className="mt-auto pt-2">
                          <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] rounded-xl text-xs font-bold text-[#1A0A08] transition-all uppercase tracking-wider">
                            View Details
                          </button>
                        </div>
                      </div>
                    )})
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-full lg:w-80 shrink-0">
               <div className="bg-white/10 backdrop-blur-xl border border-white/45 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)] rounded-3xl p-7 sticky top-24">
                 <div className="flex items-center justify-between mb-6 border-b border-white/20 pb-4">
                   <h3 className="font-bold text-[#1A0A08] text-[20px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Profile Summary</h3>
                   <button onClick={prevStep} className="text-[#8B6544] hover:text-[#5E422B] transition-colors flex items-center gap-1"><span className="text-xs font-bold uppercase tracking-wider">Edit</span> <Edit2 size={12} /></button>
                 </div>
                 
                 <div className="flex flex-col items-center mb-6">
                   <div className="relative">
                    <label className="relative cursor-pointer group block mb-2 w-24 h-24 rounded-full border-4 border-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.15)] overflow-hidden">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover transition-opacity group-hover:opacity-70" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f5ece3] to-[#e8d5c4] text-[#986427] transition-opacity group-hover:opacity-70"><User size={36} /></div>}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <Camera size={24} className="text-white drop-shadow-md" />
                      </div>
                    </label>
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1A0A08] px-3 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md whitespace-nowrap">{profile.name}</span>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-3 border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]">
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center shadow-inner"><User size={16} className="text-[#1A0A08]" /></div>
                      <div>
                        <p className="text-[9px] text-[#1A0A08]/60 font-bold uppercase tracking-wider mb-0.5">Size</p>
                        <p className="text-sm font-bold text-[#1A0A08] drop-shadow-sm">{profile.size}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-3 border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]">
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center shadow-inner"><div className="w-[18px] flex justify-center text-[#1A0A08] font-bold">I</div></div>
                      <div>
                        <p className="text-[9px] text-[#1A0A08]/60 font-bold uppercase tracking-wider mb-0.5">Height</p>
                        <p className="text-sm font-bold text-[#1A0A08] drop-shadow-sm">{profile.height}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-3 border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]">
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center shadow-inner"><div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: skinTones.find(t=>t.id === profile.skinTone)?.color }}></div></div>
                      <div>
                        <p className="text-[9px] text-[#1A0A08]/60 font-bold uppercase tracking-wider mb-0.5">Skin Tone</p>
                        <p className="text-sm font-bold text-[#1A0A08] drop-shadow-sm">{profile.skinTone}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-3 border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]">
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center shadow-inner"><Award size={16} className="text-[#1A0A08]" /></div>
                      <div>
                        <p className="text-[9px] text-[#1A0A08]/60 font-bold uppercase tracking-wider mb-0.5">Category</p>
                        <p className="text-sm font-bold text-[#1A0A08] drop-shadow-sm">{profile.category}</p>
                      </div>
                   </div>
                 </div>

                  <div className="mt-6 bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),_0_4px_12px_rgba(0,0,0,0.05)]">
                    <h4 className="font-bold text-sm text-[#1A0A08] mb-2 drop-shadow-sm">Best color collection for you</h4>
                    <p className="text-xs text-[#1A0A08]/80 mb-4 leading-relaxed font-medium">These colours complement {profile.gender === 'Male' ? 'his' : 'her'} skin tone beautifully and enhance {profile.gender === 'Male' ? 'his' : 'her'} natural glow.</p>
                    
                    {(() => {
                      if (skinToneColors.length > 0) {
                        return (
                          <div className="grid grid-cols-4 gap-3">
                            {skinToneColors.map((color, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.1)] border border-white/30 overflow-hidden bg-[#e8d5c4]/50 flex items-center justify-center">
                                  {color.shade_image_url ? (
                                    <img src={color.shade_image_url} alt={color.colorName} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-[10px] text-[#1A0A08]/40">?</span>
                                  )}
                                </div>
                                <span className="text-[9px] text-center font-bold text-[#1A0A08]/70 leading-tight uppercase tracking-wider line-clamp-1 w-full px-1">{color.colorName}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      
                      return <p className="text-xs text-[#1A0A08]/60 italic font-medium">We are curating colors for your skin tone.</p>;
                    })()}
                  </div>

               </div>
              </div>
            </div>

          </div>
        )}

        {step === 4 && selectedProduct && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setStep(3)} className={`p-2 rounded-full transition-colors shadow-sm ${step === 4 ? 'bg-white border border-gray-200 hover:bg-gray-50' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 text-[#1A0A08]'}`}>
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-4xl font-serif text-gray-900">Shop with Confidence</h1>
            </div>

            {/* Top Product Section */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-12 lg:mb-16 items-start">
              {/* LEFT COLUMN: Gallery */}
              <div className="flex gap-4 w-full lg:w-[42%] xl:w-[45%]">
                <div className="flex flex-col gap-3 w-16 xl:w-20 shrink-0 hidden sm:flex">
                  {/* Thumbnails */}
                  {(selectedProduct.images?.length > 0 ? selectedProduct.images : [selectedProduct.image]).map((img, idx) => (
                    <div key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-full aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeImageIndex === idx ? 'border-[#986427]' : 'border-transparent hover:border-[#986427]/50'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 bg-white/50 rounded-2xl overflow-hidden relative h-auto flex items-start justify-center group shadow-sm border border-gray-100">
                  <img src={selectedProduct.images?.[activeImageIndex] || selectedProduct.image} alt={selectedProduct.name} className="w-full h-auto mix-blend-multiply" />
                  <button className="absolute top-4 right-4 p-2.5 bg-white/60 hover:bg-white rounded-full text-[#1A0A08] hover:text-red-500 transition-colors shadow-sm backdrop-blur-md">
                    <Heart size={18} />
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Details & Actions */}
              <div className="flex-1 flex flex-col pt-2 lg:pr-4">
                
                {/* Header & Title */}
                <div className="mb-6">
                  <div className="mb-3">
                    <span className="bg-[#f0e6dd] text-[#986427] text-[9px] font-extrabold px-2.5 py-1 rounded-sm tracking-widest uppercase shadow-sm">Bestseller</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#1A0A08] leading-tight mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{selectedProduct.name}</h2>
                  
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="flex text-[#986427] gap-0.5">
                      {'★★★★☆'.split('').map((star, i) => <span key={i} className="text-[14px]">{star}</span>)}
                    </div>
                    <span className="text-[11px] text-gray-500 font-bold underline cursor-pointer hover:text-[#1A0A08] transition-colors">128 Reviews</span>
                  </div>
                  
                  <p className="text-2xl text-[#1A0A08] font-bold font-serif flex items-baseline gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {selectedProduct.price} 
                    <span className="text-[9px] font-sans font-bold text-gray-400 tracking-wider uppercase">Inclusive of all taxes</span>
                  </p>
                </div>

                <div className="w-full h-[1px] bg-gray-100 mb-6"></div>

                <p className="text-[13px] text-gray-600 leading-relaxed font-medium mb-8 max-w-[95%]">{selectedProduct.description}</p>

                <div className="space-y-6">
                  {/* Colors - Dynamic from Variations */}
                  {(() => {
                    const uniqueColors = Array.from(new Set(
                      (selectedProduct?.originalItem?.variations || [])
                        .map(v => v.color)
                        .filter(c => c && c.trim() !== '')
                    ));
                    
                    if (uniqueColors.length > 0) {
                      return (
                        <div className="mb-2">
                          <span className="text-[11px] font-bold text-[#1A0A08] block mb-3 uppercase tracking-wide">Color</span>
                          <div className="flex gap-2">
                            {uniqueColors.map((color, idx) => (
                              <button key={idx} title={color} className={`px-5 py-2 rounded-md border-2 text-[11px] font-bold transition-all shadow-sm ${idx === 0 ? 'border-[#986427] text-[#986427] bg-[#F9F7F5]' : 'border-gray-200 text-gray-600 bg-white hover:border-[#986427]/50'}`}>
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Size Top & Bottom */}
                  <div className="flex gap-8">
                    <div className="flex-1 max-w-[120px]">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-bold text-[#1A0A08] uppercase tracking-wide">Size (Top)</span>
                        <span className="text-[9px] font-bold text-gray-400 hover:text-[#986427] cursor-pointer transition-colors underline">Guide</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="min-w-[56px] h-[40px] flex items-center justify-center border-2 border-[#986427] bg-[#F9F7F5] text-[#986427] font-bold text-[13px] rounded-md shadow-sm transition-all hover:bg-[#986427]/10">{profile.size || 'S'}</button>
                      </div>
                    </div>
                    <div className="flex-1 max-w-[120px]">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-bold text-[#1A0A08] uppercase tracking-wide">Size (Bottom)</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="min-w-[56px] h-[40px] flex items-center justify-center border-2 border-[#986427] bg-[#F9F7F5] text-[#986427] font-bold text-[13px] rounded-md shadow-sm transition-all hover:bg-[#986427]/10">{profile.size || 'S'}</button>
                      </div>
                    </div>
                  </div>

                  {/* Fit Options */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[12px] font-bold text-[#1A0A08] uppercase tracking-wide">Select Fit</span>
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 cursor-pointer hover:text-[#986427] transition-colors"><Info size={12}/> Help me choose</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <label className={`flex flex-col items-start p-3.5 rounded-xl border-2 cursor-pointer transition-all ${selectedFitMode === 'size' ? 'border-[#986427] bg-[#986427]/5 shadow-[0_2px_8px_rgba(152,100,39,0.08)]' : 'border-gray-100 bg-white hover:border-[#986427]/30 hover:shadow-sm'}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selectedFitMode === 'size' ? 'border-[#986427]' : 'border-gray-300'}`}>
                            {selectedFitMode === 'size' && <div className="w-2 h-2 rounded-full bg-[#986427]" />}
                          </div>
                          <p className={`text-[13px] font-bold transition-colors ${selectedFitMode === 'size' ? 'text-[#986427]' : 'text-[#1A0A08]'}`}>Standard Size</p>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium pl-6 leading-tight">We'll use your saved profile sizes.</p>
                      </label>
                      
                      <label className={`flex flex-col items-start p-3.5 rounded-xl border-2 cursor-pointer transition-all ${selectedFitMode === 'expert' ? 'border-[#986427] bg-[#986427]/5 shadow-[0_2px_8px_rgba(152,100,39,0.08)]' : 'border-gray-100 bg-white hover:border-[#986427]/30 hover:shadow-sm'}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selectedFitMode === 'expert' ? 'border-[#986427]' : 'border-gray-300'}`}>
                            {selectedFitMode === 'expert' && <div className="w-2 h-2 rounded-full bg-[#986427]" />}
                          </div>
                          <p className={`text-[13px] font-bold transition-colors ${selectedFitMode === 'expert' ? 'text-[#986427]' : 'text-[#1A0A08]'}`}>Bespoke Fit</p>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium pl-6 leading-tight">Expert takes your exact measurements.</p>
                      </label>
                    </div>

                    {/* Expandable expert form */}
                    {selectedFitMode === 'expert' && (
                      <div className="animate-in slide-in-from-top-2 duration-300 mb-6">
                        <div className="bg-[#F9F7F5] p-5 rounded-xl border border-[#E5D5C5] space-y-4 shadow-inner">
                          <p className="text-[12px] font-bold text-[#1A0A08] mb-1">Schedule an Appointment</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2.5 hover:border-gray-300 transition-colors shadow-sm">
                              <Calendar size={14} className="text-[#986427]" />
                              <input type="date" className="text-[11px] w-full focus:outline-none text-[#1A0A08] font-bold bg-transparent" />
                            </div>
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2.5 hover:border-gray-300 transition-colors shadow-sm">
                              <Clock size={14} className="text-[#986427]" />
                              <input type="time" className="text-[11px] w-full focus:outline-none text-[#1A0A08] font-bold bg-transparent" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2.5 hover:border-gray-300 transition-colors shadow-sm">
                            <MapPin size={14} className="text-[#986427] shrink-0" />
                            <input type="text" placeholder="Enter full address for the visit" className="text-[11px] w-full focus:outline-none text-[#1A0A08] font-bold bg-transparent" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="fixed bottom-[72px] left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] lg:static lg:p-0 lg:border-none lg:shadow-none lg:bg-transparent lg:pt-2">
                    <button 
                      onClick={() => {
                        const numericPrice = selectedProduct.price.replace(/[^0-9.]/g, '');
                        addToCart({
                          id: 'rec-' + Date.now().toString(),
                          title: selectedProduct.name,
                          price: numericPrice,
                          images: [selectedProduct.image],
                          fitMode: selectedFitMode,
                          size_top: profile.size,
                          size_bottom: profile.size
                        }, profile.size);
                        navigate('/cart');
                      }}
                      className="flex-1 bg-[#1A0A08] hover:bg-black text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2.5 text-[13px] tracking-wide"
                    >
                      <ShoppingBag size={16} /> Add to Bag
                    </button>
                    <button className="flex-1 bg-white hover:bg-[#F9F7F5] border-2 border-[#1A0A08] text-[#1A0A08] py-4 rounded-xl font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2.5 text-[13px] tracking-wide">
                      <Heart size={16} /> Wishlist
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Bottom Section: Recommendations & Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                
                {/* Complete the Look */}
                <div className="bg-[#F9F7F5] rounded-2xl p-5 border border-gray-100 flex flex-col">
                   <div className="flex justify-between items-center mb-3">
                     <h3 className="font-bold text-sm text-[#1A0A08]">Complete the Look</h3>
                     <span className="text-[10px] font-bold text-gray-500 cursor-pointer flex items-center">View All <ArrowRight size={10} className="ml-0.5"/></span>
                   </div>
                   <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                     {/* Using fetchedProducts as accessories */}
                     {fetchedProducts.filter(p => p.id !== selectedProduct.id).slice(0, 3).map((item, i) => (
                       <div key={i} className="w-[100px] shrink-0 bg-[#F9F7F5] rounded-xl p-2 pb-3 border border-gray-100 flex flex-col group relative">
                         <div className="w-full aspect-[4/5] rounded-lg overflow-hidden mb-2 bg-white flex items-center justify-center">
                           <img src={(item.images && item.images[0]) || "/images/herobannerimage/casual.png"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                         </div>
                         <h4 className="text-[9px] font-bold text-[#1A0A08] leading-tight mb-1 truncate">{item.title}</h4>
                         <span className="text-[10px] font-bold text-gray-600">₹ {(item.price || 0).toLocaleString()}</span>
                         <button className="absolute bottom-2 right-2 w-5 h-5 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[#986427] hover:border-[#986427] border transition-colors">
                           <Plus size={10}/>
                         </button>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Why it suits you */}
                <div className="bg-[#F9F7F5] rounded-2xl p-5 border border-gray-100">
                  <h4 className="font-bold text-sm text-[#1A0A08] mb-4">Why it suits you</h4>
                  <ul className="space-y-3 text-xs text-gray-700 font-medium">
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-gray-700 shrink-0 mt-0.5" />
                      <span>Flattering for your <strong className="text-[#1A0A08]">Hourglass</strong> body shape</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-gray-700 shrink-0 mt-0.5" />
                      <span>Perfect for your <strong className="text-[#1A0A08]">{profile.height}</strong> height</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-gray-700 shrink-0 mt-0.5" />
                      <span>Colors that complement your <strong className="text-[#1A0A08]">{profile.skinTone}</strong> skin tone</span>
                    </li>
                  </ul>
                  <button className="text-[10px] font-bold text-gray-500 underline mt-4 hover:text-[#1A0A08]">View Details</button>
                </div>

                {/* Our Services */}
                <div>
                   <div className="flex justify-between items-center mb-3">
                     <h3 className="font-bold text-sm text-[#1A0A08]">Our Services</h3>
                     <span className="text-[10px] font-bold text-gray-500 cursor-pointer flex items-center">Explore all services <ArrowRight size={10} className="ml-0.5"/></span>
                   </div>
                   <div className="bg-[#F9F7F5] rounded-2xl border border-gray-100 divide-y divide-gray-200/60">
                     <div className="p-3 flex gap-3 items-start group">
                       <div className="w-8 h-8 rounded-full bg-[#f0e6dd] text-[#986427] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"><User size={14}/></div>
                       <div>
                         <h4 className="text-xs font-bold text-[#986427] mb-0.5">Casual</h4>
                         <p className="text-[10px] text-gray-500 leading-tight">Affordable styles for everyday you.<br/>Give size or measurements.</p>
                       </div>
                     </div>
                     <div className="p-3 flex gap-3 items-start group">
                       <div className="w-8 h-8 rounded-full bg-[#f0e6dd] text-[#986427] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"><User size={14}/><User size={14} className="-ml-1"/></div>
                       <div>
                         <h4 className="text-xs font-bold text-[#1A0A08] mb-0.5">Exclusive</h4>
                         <p className="text-[10px] text-gray-500 leading-tight">Perfect fit guaranteed.<br/>We send an expert for measurements.</p>
                       </div>
                     </div>
                     <div className="p-3 flex gap-3 items-start group">
                       <div className="w-8 h-8 rounded-full bg-[#f0e6dd] text-[#986427] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"><Sparkles size={14}/></div>
                       <div>
                         <h4 className="text-xs font-bold text-[#1A0A08] mb-0.5">Exclusive Plus</h4>
                         <p className="text-[10px] text-gray-500 leading-tight">Personal shopper. Curated just for you.<br/>Style, fit & delivery - we handle it all.</p>
                       </div>
                     </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {/* End of content wrapping div */}
      </div>
      </div>
      {/* Name & Gender Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNameModal(false)}></div>
          <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),_0_20px_40px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowNameModal(false)} className="absolute top-4 right-4 text-[#1A0A08] hover:opacity-70"><X size={20} /></button>
            <h3 className="text-2xl font-bold text-[#1A0A08] mb-6 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {shoppingFor === 'Myself' ? 'Tell us about yourself' : 'Who are you shopping for?'}
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold tracking-wider uppercase text-[#1A0A08]/70 mb-2">Name</label>
                <input 
                  type="text" 
                  value={profile.name === 'Myself' || profile.name === 'Gift Recipient' ? '' : profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder={shoppingFor === 'Myself' ? 'Enter your name' : "Enter their name (e.g. Sister, John)"} 
                  className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-[#1A0A08] font-medium placeholder:text-[#1A0A08]/40 focus:outline-none focus:ring-2 focus:ring-[#986427]/50 shadow-inner transition-all"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-bold tracking-wider uppercase text-[#1A0A08]/70 mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Female', 'Male'].map(g => (
                    <button 
                      key={g}
                      onClick={() => setProfile({...profile, gender: g})}
                      className={`py-3 rounded-xl font-bold transition-all border ${profile.gender === g ? 'bg-[#986427] text-white border-[#986427] shadow-md' : 'bg-white/40 text-[#1A0A08] border-white/60 hover:bg-white/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => {
                   if (!profile.name || profile.name.trim() === '') {
                     setProfile(prev => ({...prev, name: shoppingFor === 'Myself' ? 'Myself' : (shoppingFor === 'Gift' ? 'Gift Recipient' : 'Someone Else')}));
                   }
                   setShowNameModal(false);
                   nextStep();
                }}
                className="w-full mt-4 bg-gradient-to-b from-[#3A2419] to-[#1A0A08] text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_12px_rgba(26,10,8,0.3)] hover:from-[#4A3022] hover:to-[#240E0C]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {profileToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#E8DFD8] p-8 rounded-3xl max-w-sm w-full mx-4 shadow-2xl border border-white/40 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-serif font-bold text-[#1A0A08] mb-3">Delete Profile?</h3>
            <p className="text-[#3E2312]/80 mb-6 font-medium">Are you sure you want to permanently delete <strong>{profileToDelete.name}'s</strong> profile? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setProfileToDelete(null)}
                className="flex-1 py-3 rounded-xl border border-[#8B6544]/30 text-[#1A0A08] font-bold hover:bg-white/50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    await deleteMember(profileToDelete.id);
                    setSavedProfiles(prev => prev.filter(p => p.id !== profileToDelete.id));
                    if (profile.id === profileToDelete.id) {
                       setProfile(defaultProfile);
                    }
                    setProfileToDelete(null);
                  } catch (err) {
                    console.error('Failed to delete profile', err);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-red-600/90 text-white font-bold hover:bg-red-700 transition-colors shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
