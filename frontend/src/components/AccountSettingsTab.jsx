import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  ShieldCheck, Lock, User, Link2, Edit2, Mail, Smartphone, Bell, 
  Megaphone, ChevronRight, ChevronDown, Camera, Loader2
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';
import heic2any from 'heic2any';
import EditProfileModal from './EditProfileModal';
import AddMemberModal from './AddMemberModal';
import ChangePasswordModal from './ChangePasswordModal';
import Manage2FAModal from './Manage2FAModal';
import LoginActivityModal from './LoginActivityModal';
import DeleteAccountModal from './DeleteAccountModal';
import DeactivateAccountModal from './DeactivateAccountModal';

export default function AccountSettingsTab() {
  const location = useLocation();
  const { profile, members, updateMemberImage } = useAppContext();
  
  const targetMemberId = location.state?.memberId;
  const primaryMember = members?.find(m => m.isPrimary);
  const targetMember = targetMemberId ? members?.find(m => m.id === targetMemberId) : primaryMember;
  
  const isPrimary = targetMember?.isPrimary;
  const fullName = profile && profile.firstName && isPrimary ? `${profile.firstName} ${profile.lastName}`.trim() : (targetMember?.name || 'User Name');
  const email = profile?.email || 'user@example.com';
  const phone = profile?.phone || 'Not provided';
  const avatarUrl = targetMember?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E0E7FF&color=3A10E5`;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [marketingNotif, setMarketingNotif] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isLoginActivityModalOpen, setIsLoginActivityModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const [googleConnected, setGoogleConnected] = useState(true);
  const [facebookConnected, setFacebookConnected] = useState(false);
  const [appleConnected, setAppleConnected] = useState(false);

  React.useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata?.settings) {
        const s = user.user_metadata.settings;
        if (s.emailNotif !== undefined) setEmailNotif(s.emailNotif);
        if (s.smsNotif !== undefined) setSmsNotif(s.smsNotif);
        if (s.pushNotif !== undefined) setPushNotif(s.pushNotif);
        if (s.marketingNotif !== undefined) setMarketingNotif(s.marketingNotif);
        if (s.shareAnalytics !== undefined) setShareAnalytics(s.shareAnalytics);
        if (s.googleConnected !== undefined) setGoogleConnected(s.googleConnected);
        if (s.facebookConnected !== undefined) setFacebookConnected(s.facebookConnected);
        if (s.appleConnected !== undefined) setAppleConnected(s.appleConnected);
      }
    }
    loadSettings();
  }, []);

  const saveSettings = async (newSettings) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const currentSettings = user.user_metadata?.settings || {};
      await supabase.auth.updateUser({
        data: { settings: { ...currentSettings, ...newSettings } }
      });
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleToggle = (setter, value, name, key) => {
    setter(value);
    if (key) saveSettings({ [key]: value });
    toast.success(`${name} ${value ? 'enabled' : 'disabled'}`);
  };

  const toggleConnection = (setter, currentValue, platform, key) => {
    const newValue = !currentValue;
    setter(newValue);
    saveSettings({ [key]: newValue });
    toast.success(`${platform} account ${newValue ? 'connected' : 'disconnected'}`);
  };

  const handleAvatarUpload = async (e) => {
    let file = e.target.files[0];
    if (!file || !targetMember) return;

    setIsUploadingAvatar(true);
    
    try {
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        const toastId = toast.loading("Converting HEIC photo...");
        try {
          const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          file = new File([blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
          toast.dismiss(toastId);
        } catch (error) {
          toast.dismiss(toastId);
          toast.error("Could not process HEIC photo");
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        
      await supabase.from('consumers').update({ avatar_url: publicUrl }).eq('id', targetMember.id);
        
      updateMemberImage(targetMember.id, publicUrl);
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Helper for Toggle Button
  const ToggleSwitch = ({ isOn, onToggle }) => (
    <button 
      onClick={onToggle}
      className={`w-10 h-5 rounded-full transition-colors relative flex items-center shrink-0 ${isOn ? 'bg-[#3A10E5]' : 'bg-gray-200'}`}
    >
      <span className={`w-3.5 h-3.5 rounded-full bg-white absolute transition-transform ${isOn ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="w-full flex flex-col gap-6 -mt-4 pb-12">
      
      {/* Header */}
      <div>
        <h2 className="text-[28px] font-bold text-gray-900 mb-2 font-serif">Account Settings</h2>
        <p className="text-sm text-gray-500 font-medium">Manage your account information, security and preferences.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-2">
        
        {/* 1. Profile Information */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Profile Information</h3>
              <p className="text-xs text-gray-500 mt-1">Update your personal details and profile photo.</p>
            </div>
            {isPrimary && (
              <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-1.5 text-sm font-bold text-[#3A10E5] hover:underline">
                <Edit2 size={14} /> Edit
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative shrink-0 group cursor-pointer" onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-100 border-4 border-white shadow-sm transition-opacity group-hover:opacity-80">
                <img src={avatarUrl} alt="Profile" className={`w-full h-full object-cover ${isUploadingAvatar ? 'opacity-50' : ''}`} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E0E7FF&color=3A10E5` }} />
              </div>
              {isUploadingAvatar ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-[#3A10E5] animate-spin" />
                </div>
              ) : (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center text-gray-600 group-hover:text-[#3A10E5] transition-colors group-hover:scale-110 pointer-events-none">
                  <Camera size={14} />
                </button>
              )}
              <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={handleAvatarUpload} />
            </div>
            
            <div className="flex-1 w-full flex flex-col gap-4 min-w-0">
              <div className="flex items-center gap-3 sm:gap-4">
                <label className="text-xs font-semibold text-gray-500 w-20 sm:w-24 shrink-0">Full Name</label>
                <div className="flex-1 px-3 sm:px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-900 truncate" title={fullName}>{fullName}</div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <label className="text-xs font-semibold text-gray-500 w-20 sm:w-24 shrink-0">Email Address</label>
                <div className="flex-1 px-3 sm:px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-900 truncate" title={isPrimary ? email : 'N/A'}>{isPrimary ? email : 'N/A'}</div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <label className="text-xs font-semibold text-gray-500 w-20 sm:w-24 shrink-0">Phone Number</label>
                <div className="flex-1 px-3 sm:px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-900 truncate" title={isPrimary ? phone : 'N/A'}>{isPrimary ? phone : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Account Security - Only for Primary User */}
        {isPrimary && (
          <>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Account Security</h3>
              <p className="text-xs text-gray-500 mt-1">Keep your account safe and secure.</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#3A10E5] flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Password</p>
                <p className="text-sm font-medium text-gray-900 tracking-widest">••••••••</p>
              </div>
              <button onClick={() => setIsPasswordModalOpen(true)} className="text-xs font-bold text-[#3A10E5] hover:underline flex items-center gap-1">Change Password <ChevronRight size={14}/></button>
            </div>
            
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Two-Factor Authentication</p>
                <p className="text-sm font-bold text-green-600">Enabled</p>
              </div>
              <button onClick={() => setIs2FAModalOpen(true)} className="text-xs font-bold text-[#3A10E5] hover:underline flex items-center gap-1">Manage <ChevronRight size={14}/></button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Login Activity</p>
                <p className="text-sm font-medium text-gray-900">View recent logins</p>
              </div>
              <button onClick={() => setIsLoginActivityModalOpen(true)} className="text-xs font-bold text-[#3A10E5] hover:underline flex items-center gap-1">View Activity <ChevronRight size={14}/></button>
            </div>
          </div>
        </div>

        {/* 3. Notification Preferences */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Notification Preferences</h3>
            <p className="text-xs text-gray-500 mt-1">Choose how and when you want to be notified.</p>
          </div>
          
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Email Notifications</h4>
                  <p className="text-[11px] font-medium text-gray-500">Order updates, style recommendations & more</p>
                </div>
              </div>
              <ToggleSwitch isOn={emailNotif} onToggle={() => handleToggle(setEmailNotif, !emailNotif, 'Email Notifications', 'emailNotif')} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone size={16} className="text-gray-400" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">SMS Notifications</h4>
                  <p className="text-[11px] font-medium text-gray-500">Important alerts and order updates</p>
                </div>
              </div>
              <ToggleSwitch isOn={smsNotif} onToggle={() => handleToggle(setSmsNotif, !smsNotif, 'SMS Notifications', 'smsNotif')} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-gray-400" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Push Notifications</h4>
                  <p className="text-[11px] font-medium text-gray-500">Get notified on your device</p>
                </div>
              </div>
              <ToggleSwitch isOn={pushNotif} onToggle={() => handleToggle(setPushNotif, !pushNotif, 'Push Notifications', 'pushNotif')} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Megaphone size={16} className="text-gray-400" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Marketing & Promotions</h4>
                  <p className="text-[11px] font-medium text-gray-500">Offers, new arrivals and discounts</p>
                </div>
              </div>
              <ToggleSwitch isOn={marketingNotif} onToggle={() => handleToggle(setMarketingNotif, !marketingNotif, 'Marketing Notifications', 'marketingNotif')} />
            </div>
          </div>
        </div>

        {/* 4. Privacy Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Privacy Settings</h3>
              <p className="text-xs text-gray-500 mt-1">Manage what information we collect and how it's used.</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#3A10E5] flex items-center justify-center">
              <Lock size={18} />
            </div>
          </div>

          <div className="flex flex-col gap-6 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Profile Visibility</p>
              <button className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900">
                Only you <ChevronDown size={14} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Measurement Visibility</p>
              <button className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900">
                Only you <ChevronDown size={14} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Personalized Recommendations</p>
              <button className="flex items-center gap-2 text-xs font-bold text-green-600">
                Enabled <ChevronDown size={14} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">Share Analytics</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Help us improve your experience</p>
              </div>
              <ToggleSwitch isOn={shareAnalytics} onToggle={() => handleToggle(setShareAnalytics, !shareAnalytics, 'Share Analytics', 'shareAnalytics')} />
            </div>
          </div>
        </div>

        {/* 5. Account Management */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Account Management</h3>
              <p className="text-xs text-gray-500 mt-1">Manage your account or take necessary actions.</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#3A10E5] flex items-center justify-center">
              <User size={18} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => setIsDeactivateModalOpen(true)} className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-xl transition-colors group">
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Deactivate Account</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Temporarily disable your account</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-[#3A10E5]" />
            </button>
            
            <button onClick={() => setIsDeleteModalOpen(true)} className="flex items-center justify-between w-full p-3 hover:bg-red-50 rounded-xl transition-colors group">
              <div className="text-left">
                <p className="text-sm font-bold text-red-600">Delete Account</p>
                <p className="text-[11px] text-red-500 mt-0.5">Permanently delete your account and data</p>
              </div>
              <ChevronRight size={16} className="text-red-400 group-hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* 6. Connected Accounts */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Connected Accounts</h3>
              <p className="text-xs text-gray-500 mt-1">Manage your social media and third-party accounts.</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#3A10E5] flex items-center justify-center">
              <Link2 size={18} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  {/* Google G Logo SVG */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Google</h4>
                  <p className="text-[11px] text-gray-500 hidden sm:block">{googleConnected ? email : 'Not connected'}</p>
                </div>
              </div>
              {googleConnected ? (
                <button onClick={() => toggleConnection(setGoogleConnected, googleConnected, 'Google', 'googleConnected')} className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  Disconnect
                </button>
              ) : (
                <button onClick={() => toggleConnection(setGoogleConnected, googleConnected, 'Google', 'googleConnected')} className="border border-gray-200 text-[#3A10E5] hover:bg-purple-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  Connect
                </button>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Facebook</h4>
                  <p className="text-[11px] text-gray-500 hidden sm:block">{facebookConnected ? fullName : 'Not connected'}</p>
                </div>
              </div>
              {facebookConnected ? (
                <button onClick={() => toggleConnection(setFacebookConnected, facebookConnected, 'Facebook', 'facebookConnected')} className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  Disconnect
                </button>
              ) : (
                <button onClick={() => toggleConnection(setFacebookConnected, facebookConnected, 'Facebook', 'facebookConnected')} className="border border-gray-200 text-[#3A10E5] hover:bg-purple-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  Connect
                </button>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-900">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" className="hidden"/>
                    <path d="M15.193 11.233c.017-1.921 1.63-2.868 1.704-2.914-1.122-1.621-2.905-1.782-3.486-1.802-1.464-.146-2.883.856-3.633.856-.732 0-1.884-.836-3.085-.815-1.57.02-3.018.9-3.832 2.302-1.65 2.831-.421 7.028 1.187 9.324.786 1.12 1.72 2.378 2.923 2.333 1.162-.045 1.602-.741 3.016-.741 1.413 0 1.815.741 3.036.721 1.241-.02 2.055-1.144 2.836-2.268.905-1.306 1.282-2.571 1.302-2.636-.027-.01-2.484-.943-2.5-3.36zM13.682 6.78c.636-.761 1.066-1.818.948-2.875-.916.037-2.02.603-2.678 1.353-.526.59-.997 1.67-.858 2.71 1.026.078 2.062-.511 2.588-1.188z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Apple</h4>
                  <p className="text-[11px] text-gray-500 hidden sm:block">{appleConnected ? email : 'Not connected'}</p>
                </div>
              </div>
              {appleConnected ? (
                <button onClick={() => toggleConnection(setAppleConnected, appleConnected, 'Apple', 'appleConnected')} className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  Disconnect
                </button>
              ) : (
                <button onClick={() => toggleConnection(setAppleConnected, appleConnected, 'Apple', 'appleConnected')} className="border border-gray-200 text-[#3A10E5] hover:bg-purple-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      
      {!isPrimary && (
         <AddMemberModal 
           isOpen={isAddMemberModalOpen} 
           onClose={() => setIsAddMemberModalOpen(false)} 
           memberToEdit={targetMember} 
         />
      )}

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      <Manage2FAModal isOpen={is2FAModalOpen} onClose={() => setIs2FAModalOpen(false)} />
      <LoginActivityModal isOpen={isLoginActivityModalOpen} onClose={() => setIsLoginActivityModalOpen(false)} />
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
      <DeactivateAccountModal isOpen={isDeactivateModalOpen} onClose={() => setIsDeactivateModalOpen(false)} />
    </div>
  );
}
