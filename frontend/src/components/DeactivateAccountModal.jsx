import React, { useState } from 'react';
import { X, UserMinus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DeactivateAccountModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout } = useAppContext();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDeactivate = async () => {
    setIsSubmitting(true);
    try {
      // Mocking account deactivation
      await logout();
      toast.success('Your account has been deactivated.');
      navigate('/');
    } catch (err) {
      toast.error('Failed to deactivate account');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="glass-panel-darker rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col p-0 border border-white/60 animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-white/30 bg-white/20 dark:bg-[#151515]/20 transition-colors duration-500 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 text-gray-900 dark:text-[#F5F0E8]">
            <UserMinus size={20} className="text-orange-500" />
            <h2 className="text-xl font-bold font-serif">Deactivate Account</h2>
          </div>
          <button onClick={onClose} className="text-gray-700 hover:text-black hover:bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 rounded-full p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-800 dark:text-[#F5F0E8] font-medium">
            Deactivating your account is temporary. Your profile, photos, and saved outfits will be hidden until you log back in.
          </p>

          <button 
            onClick={handleDeactivate}
            disabled={isSubmitting} 
            className="w-full glass-button-danger text-white font-bold py-3 rounded-xl transition-all mt-6 flex justify-center items-center h-12"
          >
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Deactivate My Account'}
          </button>
          
          <button 
            onClick={onClose}
            className="w-full bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 hover:bg-white/70 dark:bg-[#151515]/70 transition-colors duration-500 backdrop-blur-md border border-white/40 text-gray-800 dark:text-[#F5F0E8] font-bold py-3 rounded-xl transition-all shadow-sm flex justify-center items-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
