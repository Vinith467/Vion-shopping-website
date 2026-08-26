import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

const sizes = [
  { id: 'XS - M', name: 'XS - M', femaleImg: '/images/size/female/f1.png', maleImg: '/images/size/male/m1.png' },
  { id: 'L', name: 'L', femaleImg: '/images/size/female/f2.png', maleImg: '/images/size/male/m2.png' },
  { id: 'XL - XXL', name: 'XL - XXL', femaleImg: '/images/size/female/f3.png', maleImg: '/images/size/male/m3.png' },
  { id: '3XL - 4XL', name: '3XL - 4XL', femaleImg: '/images/size/female/f4.png', maleImg: '/images/size/male/m4.png' },
  { id: '5XL', name: '5XL', femaleImg: '/images/size/female/f5.png', maleImg: '/images/size/male/m5.png' }
];

export default function SizeSelectionScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const classParam = searchParams.get('class');
  
  const { selectedConsumerId, updateMember, members } = useAppContext();
  
  const [userGender, setUserGender] = useState('Female');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Find gender
    let gender = 'Female';
    if (selectedConsumerId && members) {
      const activeMember = members.find(m => m.id === selectedConsumerId);
      if (activeMember && activeMember.gender) {
        gender = activeMember.gender;
      }
    } else {
      const tempGender = sessionStorage.getItem('temp_gender');
      if (tempGender) gender = tempGender;
    }
    setUserGender(gender);
  }, [selectedConsumerId, members]);

  const handleSizeSelect = async (sizeId) => {
    try {
      if (selectedConsumerId) {
        // Update local context
        updateMember(selectedConsumerId, { measurements: { size: sizeId } });
        
        // Update Supabase (assuming measurements json or size column, vion seems to use measurements json or size column directly? Let's check AppContext or AdminInventory. In AdminInventory, profile.size is used. Let's update `size` directly and also inside `measurements` jsonb just in case)
        const activeMember = members.find(m => m.id === selectedConsumerId);
        const currentMeasurements = activeMember?.measurements || {};
        
        await supabase
          .from('consumers')
          .update({ 
            measurements: { ...currentMeasurements, size: sizeId } 
          })
          .eq('id', selectedConsumerId);
      }
      
      // Navigate to explore with category and size (or wherever redirect says)
      const redirectTo = searchParams.get('redirect') || '/explore';
      navigate(redirectTo);
    } catch (error) {
      console.error("Error saving size:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex w-full min-h-[100dvh] font-sans bg-[#F5F0E8] overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#E8DFD3] to-transparent pointer-events-none"></div>
      
      {/* Header */}
      <div className="absolute top-0 w-full p-6 lg:p-10 z-20 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center border border-white/60 hover:bg-white/60 transition-colors shadow-sm"
        >
          <ArrowLeft size={18} className="text-[#1A0A08]" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-12 h-[1px] bg-[#A87B45]"></div>
          <span className="text-[#A87B45] text-[10px] font-bold uppercase tracking-[0.2em]">Step 02</span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 lg:px-12 pt-20 pb-10 flex flex-col items-center justify-center min-h-[100dvh]">
        
        <div className="text-center mb-8 md:mb-14 max-w-2xl mx-auto mt-4 md:mt-0">
          <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#A87B45] mb-2 md:mb-3">Perfect Fit</h4>
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-[#1A0A08] mb-3 md:mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, lineHeight: 1.1 }}>
            What is your size?
          </h1>
          <p className="text-[13px] md:text-[16px] text-[#555] font-medium px-4 md:px-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Select your usual size group so we can tailor the collection precisely for you.
          </p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-4 w-full max-w-5xl mx-auto px-4 h-[350px] sm:h-[400px] md:h-[500px]">
          {sizes.map((s, idx) => {
            const imgUrl = userGender === 'Male' ? s.maleImg : s.femaleImg;
            
            return (
              <div 
                key={idx}
                onClick={() => handleSizeSelect(s.id)}
                className="group cursor-pointer relative overflow-hidden rounded-full border border-white/40 shadow-sm hover:shadow-xl hover:border-[#C49A5C]/60 transition-all duration-500 flex-1 max-w-[75px] sm:max-w-[120px] md:max-w-[160px] bg-white/30 backdrop-blur-sm"
              >
                <img 
                  src={imgUrl} 
                  alt={s.name} 
                  className="absolute inset-0 w-full h-full object-cover object-top mix-blend-multiply group-hover:scale-110 transition-transform duration-700 opacity-90" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 pb-8 sm:pb-10 flex flex-col items-center justify-end h-full">
                  <h3 className="text-white text-xl md:text-3xl font-bold tracking-widest group-hover:text-[#E5CDA7] transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {s.id}
                  </h3>
                  <span className="text-white/80 text-[8px] md:text-xs uppercase tracking-wider mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden sm:block">
                    {s.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
