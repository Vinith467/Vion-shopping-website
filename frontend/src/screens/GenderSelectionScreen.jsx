import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export default function GenderSelectionScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/explore';
  
  const { selectedConsumerId, updateMember, members } = useAppContext();

  // If there's no selected profile, maybe we need to create one, or just update the default one.
  // In Vion, `selectedConsumerId` usually points to the active profile.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGenderSelect = async (gender) => {
    try {
      if (selectedConsumerId) {
        // Update local context
        updateMember(selectedConsumerId, { gender });
        
        // Update Supabase
        await supabase
          .from('consumers')
          .update({ gender })
          .eq('id', selectedConsumerId);
      } else {
        // If no consumer selected (edge case), try to update the first member or create one
        // For simplicity, we just save to sessionStorage as fallback if they aren't fully logged in
        sessionStorage.setItem('temp_gender', gender);
      }
      
      // Navigate to the next step
      navigate(redirectTo);
    } catch (error) {
      console.error("Error saving gender:", error);
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
          <span className="text-[#A87B45] text-[10px] font-bold uppercase tracking-[0.2em]">Step 01</span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 lg:px-12 pt-20 pb-10 flex flex-col items-center justify-center min-h-[100dvh]">
        
        <div className="text-center mb-8 md:mb-14 max-w-2xl mx-auto mt-4 md:mt-0">
          <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#A87B45] mb-2 md:mb-3">Your Journey Begins</h4>
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-[#1A0A08] mb-3 md:mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, lineHeight: 1.1 }}>
            What are you shopping for?
          </h1>
          <p className="text-[13px] md:text-[16px] text-[#555] font-medium px-4 md:px-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Select a collection to explore pieces tailored precisely for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 w-full max-w-4xl mx-auto">
          
          {/* Female Card */}
          <div 
            onClick={() => handleGenderSelect('Female')}
            className="group cursor-pointer relative overflow-hidden rounded-[1.25rem] md:rounded-3xl h-[260px] sm:h-[300px] md:h-[480px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-white border-2 border-transparent hover:border-[#C49A5C]/40 transition-all duration-500"
          >
            <img 
              src="/gender/female.png" 
              alt="Women's Collection" 
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col items-center text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h2 className="text-3xl md:text-4xl text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, letterSpacing: '0.05em' }}>WOMEN</h2>
              <div className="w-8 h-[1px] bg-[#C49A5C] mb-3 group-hover:w-16 transition-all duration-500"></div>
              <p className="text-white/80 text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Explore Collection</p>
            </div>
          </div>

          {/* Male Card */}
          <div 
            onClick={() => handleGenderSelect('Male')}
            className="group cursor-pointer relative overflow-hidden rounded-[1.25rem] md:rounded-3xl h-[260px] sm:h-[300px] md:h-[480px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-white border-2 border-transparent hover:border-[#C49A5C]/40 transition-all duration-500"
          >
            <img 
              src="/gender/male.png" 
              alt="Men's Collection" 
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col items-center text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h2 className="text-3xl md:text-4xl text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, letterSpacing: '0.05em' }}>MEN</h2>
              <div className="w-8 h-[1px] bg-[#C49A5C] mb-3 group-hover:w-16 transition-all duration-500"></div>
              <p className="text-white/80 text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Explore Collection</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
