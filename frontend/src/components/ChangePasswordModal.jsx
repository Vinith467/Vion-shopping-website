import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 text-gray-900">
            <Lock size={20} className="text-[#3A10E5]" />
            <h2 className="text-xl font-bold font-serif">Change Password</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Password (optional)</label>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white transition-colors" 
              placeholder="Enter current password"
            />
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">New Password</label>
            <input 
              required 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white transition-colors" 
              placeholder="Must be at least 6 characters"
              minLength={6}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirm New Password</label>
            <input 
              required 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white transition-colors" 
              placeholder="Re-enter new password"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-[#3A10E5] hover:bg-[#2A08B5] text-white font-bold py-3 rounded-xl transition-all shadow-sm mt-6 flex justify-center items-center h-12"
          >
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
