import React, { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Users, Sparkles, Heart, ChevronRight, Star, UserCheck, RefreshCcw, ShoppingBag, ChevronLeft, Camera, Loader2, X, AlertCircle, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';

const CATEGORIES = [
  { id: 'for_you', name: 'For You', icon: Star, image: null, isSpecial: true },
  { id: 'business_suits', name: 'Business Suits', image: '/images/business_suits.jpg' },
  { id: 'formal_dresses', name: 'Formal Dresses', image: '/images/formal_dresses.jpg' },
  { id: 'business_casual', name: 'Business Casual', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'smart_casual', name: 'Smart Casual', image: '/images/smart_casual.png' },
  { id: 'coord_sets', name: 'Co-Ord Sets', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'jumpsuits', name: 'Jumpsuits', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'power_dressing', name: 'Power Dressing', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'indo_western_formal', name: 'Indo-Western Formal', image: 'https://images.unsplash.com/photo-1610030469983-98e550d61dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'premium_executive', name: 'Premium Executive', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'friday_office_wear', name: 'Friday Office Wear', image: 'https://images.unsplash.com/photo-1550614000-4b95d46f5b9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
];

const RECOMMENDED_PRODUCTS = [
  { id: 1, name: 'Black Classic Blazer', price: '4,499', originalPrice: '5,000', discount: '10% off', image: '/product1_model.jpg', matchScore: 98, tag: 'HIGH MATCH', faceProps: { top: '10%', left: '48%', width: '12%' } },
  { id: 2, name: 'Essential Black Blazer', price: '3,999', originalPrice: '4,500', discount: '11% off', image: '/product2.jpg', matchScore: 95, tag: 'NEW IN', faceProps: { top: '8%', left: '45%', width: '13%' } },
  { id: 3, name: 'Beige Silk Blouse', price: '2,899', originalPrice: '3,499', discount: '17% off', image: '/product3.jpg', matchScore: 92, tag: 'ELEGANT', faceProps: { top: '5%', left: '42%', width: '14%' } },
  { id: 4, name: 'Black Peplum Top', price: '4,299', originalPrice: '4,999', discount: '14% off', image: '/product4.jpg', matchScore: 90, tag: 'TRENDING', faceProps: { top: '12%', left: '48%', width: '12%' } },
  { id: 5, name: 'Navy Blue Tunic', price: '3,199', originalPrice: '3,800', discount: '15% off', image: '/product5.jpg', matchScore: 88, tag: 'CLASSIC', faceProps: { top: '14%', left: '50%', width: '12%' } },
  { id: 6, name: 'White Button-Down Shirt', price: '1,999', originalPrice: '2,500', discount: '20% off', image: '/product6.jpg', matchScore: 85, tag: 'CASUAL', faceProps: { top: '12%', left: '50%', width: '12%' } },
  { id: 7, name: 'Navy Belted Blouse', price: '3,499', originalPrice: '4,200', discount: '16% off', image: '/product7.jpg', matchScore: 94, tag: 'NEW IN', faceProps: { top: '15%', left: '45%', width: '15%' } },
];

export default function HomeTab({ customConsumer, onBack }) {
  const navigate = useNavigate();
  const { members, updateMemberImage } = useAppContext();

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  // Find the selected consumer
  const consumer = customConsumer || members.find(m => m.isPrimary) || members[0] || {
    name: 'Loading...',
    image: '',
    height: '',
    bodyShape: '',
    age: ''
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      await supabase
        .from('consumers')
        .update({ avatar_url: publicUrl })
        .eq('id', consumer.id);
        
      updateMemberImage(consumer.id, publicUrl);
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100 bg-white rounded-3xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer shrink-0" onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}>
            <img 
              src={consumer.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'} 
              alt={consumer.name} 
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-gray-100 shadow-sm transition-opacity ${isUploadingAvatar ? 'opacity-50' : 'group-hover:opacity-80'}`}
            />
            {isUploadingAvatar ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={avatarInputRef}
              onChange={handleAvatarUpload}
            />
          </div>
          <div>
            <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Shopping for</p>
            <div className="flex items-center gap-2 mb-1 cursor-pointer hover:bg-gray-50 p-1 -ml-1 rounded-md transition-colors" onClick={() => navigate('/account', { state: { activeTab: 'members' } })}>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-none">{consumer.name}</h1>
              <ChevronDownIcon />
            </div>
            <p className="text-[#5D3FD3] text-xs md:text-sm font-semibold">
              {consumer.height} • {consumer.bodyShape} • {consumer.age} yrs
            </p>
          </div>
        </div>
        
        {customConsumer ? (
          <button 
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-purple-200 rounded-xl text-[#5D3FD3] font-semibold text-sm hover:bg-purple-50 transition-colors"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        ) : (
          <button 
            onClick={() => navigate('/account', { state: { activeTab: 'members' } })}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-purple-200 rounded-xl text-[#5D3FD3] font-semibold text-sm hover:bg-purple-50 transition-colors"
          >
            <Users size={18} />
            Switch Consumer
          </button>
        )}
      </div>

      {/* Welcome Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            Looks perfect on you, <span className="text-[#5D3FD3]">{consumer.name.split(' ')[0]}</span> <Sparkles className="text-yellow-400" size={24} />
          </h2>
          <button className="text-[#5D3FD3] font-semibold text-sm hover:underline hidden md:flex items-center gap-1">
            View all <ChevronRight size={16} />
          </button>
        </div>

        {/* Categories Row */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 hide-scrollbar">
          {CATEGORIES.map((cat, index) => (
            <div key={cat.id} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center p-[2px] transition-all ${cat.isSpecial ? 'bg-gradient-to-tr from-[#5D3FD3] to-purple-400' : 'bg-transparent group-hover:bg-purple-100'}`}>
                {cat.isSpecial ? (
                  <div className="w-full h-full bg-[#5D3FD3] rounded-full flex items-center justify-center shadow-inner">
                    <cat.icon className="text-white w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
              </div>
              <span className={`text-xs font-semibold text-center ${cat.isSpecial ? 'text-[#5D3FD3] border-b-2 border-[#5D3FD3] pb-1' : 'text-gray-700 group-hover:text-[#5D3FD3]'}`}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>



      {/* Body Type Match Banner */}
      <div className="bg-gradient-to-r from-[#F3F0FF] to-[#FAF8FF] rounded-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between border border-purple-100/50 relative">
        
        <div className="p-8 md:p-12 md:pr-0 flex-1 z-10 relative">
          <Sparkles className="absolute top-6 left-6 text-purple-300 w-5 h-5" />
          <Sparkles className="absolute bottom-10 right-10 text-purple-300 w-4 h-4 hidden md:block" />
          
          <h3 className="text-2xl md:text-[28px] font-bold text-gray-900 leading-tight mb-3 max-w-sm">
            High match for your body type
          </h3>
          <p className="text-gray-600 mb-8 max-w-sm text-sm md:text-base leading-relaxed">
            We found styles that flatter you the most based on your {consumer.bodyShape} shape.
          </p>
          <button 
            onClick={() => navigate('/account', { state: { activeTab: 'preferences' } })}
            className="bg-[#1A1A1A] hover:bg-black text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg"
          >
            Preferences
          </button>
        </div>

        <div className="flex-1 w-full flex justify-end relative h-[250px] md:h-[280px]">
            {/* Abstract circle decoration */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-white/60 rounded-full blur-3xl z-0"></div>
            
            {/* Match Badge overlay */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white rounded-full w-24 h-24 shadow-xl flex flex-col items-center justify-center z-20 hidden md:flex border border-purple-50">
              <span className="text-[#5D3FD3] text-3xl font-black leading-none tracking-tighter">95<span className="text-xl">%</span></span>
              <span className="text-purple-400 text-[9px] font-bold uppercase tracking-wider mt-0.5 text-center px-2">Match Score</span>
            </div>

            <img 
              src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Models" 
              className="h-full w-full object-cover object-top mask-image-gradient hidden md:block"
              style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%)', maskImage: 'linear-gradient(to right, transparent, black 20%)' }}
            />
        </div>
      </div>

      {/* Recommended For You Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            Recommended for you <Heart className="text-[#5D3FD3] fill-[#5D3FD3]" size={20} />
          </h2>
          <button className="text-[#5D3FD3] font-semibold text-sm hover:underline hidden md:flex items-center gap-1">
            View all <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {RECOMMENDED_PRODUCTS.map((product) => (
            <div 
              key={product.id} 
              onClick={() => navigate(`/product/${product.id}`)}
              className="group cursor-pointer border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden group/img">
                <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                


                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-3 right-3 p-2 md:p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-colors border border-gray-100 z-20"
                >
                  <Heart size={18} />
                </button>
              </div>
              
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{product.name}</h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm md:text-base font-medium">₹{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Features Banner */}
      <div className="w-full bg-[#FBFBFC] rounded-2xl p-6 md:p-8 mt-2 border border-gray-100 flex flex-wrap md:flex-nowrap justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
            <UserCheck size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Personalised for You</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Outfits curated to fit your body type, style & preferences</p>
          </div>
        </div>
        


        <div className="flex items-start gap-4 flex-1">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
            <RefreshCcw size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Easy Returns</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Hassle-free returns within 7 days</p>
          </div>
        </div>
      </div>



    </div>
  );
}

// Small helper component for the chevron in the header
const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
