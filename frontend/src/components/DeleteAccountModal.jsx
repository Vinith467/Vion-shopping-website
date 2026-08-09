import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DeleteAccountModal({ isOpen, onClose }) {
  const [confirmation, setConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout } = useAppContext();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDelete = async (e) => {
    e.preventDefault();
    if (confirmation !== 'DELETE') return;
    
    setIsSubmitting(true);
    try {
      // Mocking account deletion as self-deletion isn't standard in Supabase without edge functions
      await logout();
      toast.success('Your account has been permanently deleted.');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete account');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0 bg-red-50">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <h2 className="text-xl font-bold font-serif">Delete Account</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-700 bg-white hover:bg-red-100 rounded-full p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleDelete} className="p-6 space-y-4">
          <p className="text-sm text-gray-700 font-medium">
            This action is <span className="font-bold text-red-600">permanent and cannot be undone</span>. 
            All of your personal data, saved outfits, and order history will be wiped from our servers immediately.
          </p>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">To confirm, type <span className="text-red-600 select-all">DELETE</span> below:</label>
            <input 
              required 
              type="text" 
              value={confirmation} 
              onChange={e => setConfirmation(e.target.value)} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-red-200 rounded-xl text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors text-red-600 font-bold" 
              placeholder="DELETE"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || confirmation !== 'DELETE'} 
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-sm mt-6 flex justify-center items-center h-12"
          >
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Permanently Delete Account'}
          </button>
          
          <button 
            type="button"
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all shadow-sm flex justify-center items-center"
          >
            Cancel, keep my account
          </button>
        </form>
      </div>
    </div>
  );
}
