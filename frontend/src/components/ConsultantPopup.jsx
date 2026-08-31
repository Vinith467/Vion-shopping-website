import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ConsultantPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has already seen the popup
    const hasSeenPopup = localStorage.getItem('hasSeenConsultantPopup');
    
    if (!hasSeenPopup) {
      // Show the popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenConsultantPopup', 'true');
  };

  const handleBookNow = () => {
    handleClose();
    // Dispatch an event so App.jsx or anywhere can open the Booking Modal
    window.dispatchEvent(new Event('openBookConsultantModal'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 w-full max-w-3xl flex flex-col md:flex-row rounded-lg overflow-hidden relative shadow-2xl animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-black bg-white/5 dark:bg-[#151515]/5 transition-colors duration-500 0 dark:bg-[#151515]/50 transition-colors duration-500 backdrop-blur-md rounded-full p-1 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <img 
            src="/New folder/manifesto_couple.jpg" 
            alt="VION Stylist" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <h3 className="text-white font-serif text-2xl tracking-widest uppercase">Bespoke<br/>Styling</h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center items-center bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 ">
          <h2 className="text-3xl font-serif font-bold text-[#1A0A08] dark:text-[#F5F0E8] mb-4">Elevate Your Wardrobe</h2>
          <div className="w-12 h-px bg-[#8B6544] mb-6"></div>
          
          <p className="text-[#3E2312] mb-8 leading-relaxed font-serif text-lg">
            Experience the pinnacle of Italian craftsmanship. Book a complimentary, personalized consultation with one of our expert stylists to curate your perfect look.
          </p>

          <button 
            onClick={handleBookNow}
            className="w-full bg-[#1A0A08] hover:bg-[#8B6544] text-white py-4 font-bold tracking-widest uppercase text-sm transition-colors"
          >
            Book Consultant
          </button>
          
          <button 
            onClick={handleClose}
            className="mt-4 text-xs font-bold text-gray-400 hover:text-gray-800 dark:text-[#F5F0E8] uppercase tracking-wider"
          >
            No, thanks
          </button>
        </div>
      </div>
    </div>
  );
}
