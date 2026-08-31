import React, { useState } from 'react';
import { Camera, Edit2, ArrowRight, Eye, Ruler, MoreHorizontal, Sparkles, Heart, ShieldCheck, Plus, Trash2, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AddMemberModal from './AddMemberModal';
import HomeTab from './HomeTab';

export default function MembersTab() {
  const navigate = useNavigate();
  const { members, setSelectedConsumerId, deleteMember } = useAppContext();
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);
  const [viewingMemberId, setViewingMemberId] = useState(null);

  const handleSelectConsumer = (id) => {
    const member = members.find(m => m.id === id);
    if (member && member.isPrimary) {
      navigate('/account', { state: { activeTab: 'home' } });
    } else {
      setViewingMemberId(id);
    }
  };

  const primaryConsumer = members.find(m => m.isPrimary) || members[0] || {};
  const firstName = primaryConsumer.name ? primaryConsumer.name.split(' ')[0] : 'Guest';

  if (viewingMemberId) {
    const member = members.find(m => m.id === viewingMemberId);
    return <HomeTab customConsumer={member} onBack={() => setViewingMemberId(null)} />;
  }

  return (
    <div className="w-full flex flex-col gap-6 -mt-4">
      
      {/* 1. Header Card */}
      <div className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col xl:flex-row items-center justify-between gap-8">
        
        {/* Left: Welcome */}
        <div className="flex-1 text-center xl:text-left">
          <h2 className="text-[28px] font-bold text-gray-900 dark:text-[#F5F0E8] mb-2 font-serif">Welcome back, {firstName}! 👋</h2>
          <p className="text-sm text-gray-500 font-medium">We're ready to help you look and feel your best.</p>
        </div>

        {/* Center: Profile Info */}
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
              <img src={primaryConsumer.image || "/images/body_hourglass_1785826886362.jpg"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#3A10E5] rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm hover:bg-[#2A08B5] transition-colors">
              <Camera size={14} />
            </button>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#F5F0E8]">{primaryConsumer.name}</h3>
              <span className="bg-[#3A10E5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Primary</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 font-medium mb-1.5">
              <span>{primaryConsumer.age} yrs</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{primaryConsumer.gender}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{primaryConsumer.height}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{primaryConsumer.weight || 'N/A'}</span>
            </div>
            <div className="text-[11px] text-gray-500 font-medium mb-1">
              Size {primaryConsumer.size}
            </div>
            <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 mb-4">
              <span>Skin Tone:</span>
              {primaryConsumer.skinTone ? (
                <span className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: primaryConsumer.skinTone }} title={primaryConsumer.skinTone}></span>
              ) : (
                <span>N/A</span>
              )}
            </div>
            <button 
              onClick={() => navigate('/account', { state: { activeTab: 'settings' } })}
              className="flex items-center gap-2 text-xs font-bold text-[#3A10E5] border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-xl w-fit transition-colors"
            >
              Edit My Profile <Edit2 size={12} />
            </button>
          </div>
        </div>

        {/* Right: Completion */}
        <div className="xl:pl-8 xl:border-l border-gray-100 flex flex-col h-full justify-center w-full xl:w-auto">
          <p className="text-xs font-bold text-gray-900 dark:text-[#F5F0E8] mb-4 text-center xl:text-left">Profile Completion</p>
          <div className="flex items-center justify-center xl:justify-start gap-4 mb-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#3A10E5]"
                  strokeDasharray="100, 100"
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900 dark:text-[#F5F0E8]">100%</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 font-medium max-w-[120px] leading-relaxed">
              Great! Your profile is complete.
            </p>
          </div>
          <button className="text-[11px] font-bold text-[#3A10E5] flex items-center justify-center xl:justify-start gap-1 hover:underline">
            View Profile Details <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* 2. Members List */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-[#F5F0E8]">Members</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage your profiles and get personalized recommendations for everyone.</p>
          </div>
          <button 
            onClick={() => setIsAddMemberModalOpen(true)}
            className="bg-[#3A10E5] hover:bg-[#2A08B5] text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Plus size={18} /> Add Member
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {members.map((member, index) => (
            <div 
              key={member.id}
              onClick={() => handleSelectConsumer(member.id)}
              className={`flex flex-col lg:flex-row items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                index === 0 ? 'bg-purple-50/30 border-purple-200' : 'bg-white dark:bg-[#151515] transition-colors duration-500 border-gray-100 hover:border-gray-200'
              }`}
            >
              
              {/* Profile Info */}
              <div className="flex items-center gap-5 w-full lg:w-auto mb-4 lg:mb-0">
                <div className="relative w-16 h-16 shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  {member.isPrimary && (
                    <div className="absolute -bottom-1 -right-1 bg-[#3A10E5] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                      You
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-[#F5F0E8]">{member.name}</h4>
                    {member.isPrimary && (
                      <span className="bg-[#3A10E5] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Primary</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium mb-1">
                    <span>{member.age} yrs</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{member.gender}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{member.height}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{member.weight}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium mb-2">
                    <span>Size: {member.size}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1.5">
                      Skin Tone: 
                      {member.skinTone ? (
                        <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: member.skinTone }} title={member.skinTone}></span>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                  <div className="bg-purple-50 text-[#3A10E5] text-[10px] font-bold px-2.5 py-1 rounded-md w-fit border border-purple-100">
                    Recommended Size: {member.recommendedSize}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center divide-x divide-gray-100 w-full lg:w-auto justify-between lg:justify-end border-t border-gray-100 lg:border-none pt-4 lg:pt-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSelectConsumer(member.id); }}
                  className="flex flex-col items-center gap-1.5 px-4 lg:px-6 hover:text-[#3A10E5] text-gray-500 transition-colors"
                >
                  <Eye size={18} />
                  <span className="text-[10px] font-medium">View Profile</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/account', { state: { activeTab: 'measurements', memberId: member.id } }); }}
                  className="flex flex-col items-center gap-1.5 px-4 lg:px-6 hover:text-[#3A10E5] text-gray-500 transition-colors"
                >
                  <Ruler size={18} />
                  <span className="text-[10px] font-medium">Measurements</span>
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    navigate('/account', { state: { activeTab: 'preferences', memberId: member.id } });
                  }}
                  className="flex flex-col items-center gap-1.5 px-4 lg:px-6 hover:text-[#3A10E5] text-gray-500 transition-colors"
                >
                  <SlidersHorizontal size={18} />
                  <span className="text-[10px] font-medium">Preferences</span>
                </button>
                {member.isPrimary && (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      navigate('/account', { state: { activeTab: 'settings' } });
                    }}
                    className="flex flex-col items-center gap-1.5 px-4 lg:px-6 hover:text-[#3A10E5] text-gray-500 transition-colors"
                  >
                    <Edit2 size={18} />
                    <span className="text-[10px] font-medium">Edit Profile</span>
                  </button>
                )}
                {!member.isPrimary && (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
                        deleteMember(member.id);
                      }
                    }}
                    className="flex flex-col items-center gap-1.5 pl-4 lg:pl-6 hover:text-red-500 text-gray-500 transition-colors"
                  >
                    <Trash2 size={18} />
                    <span className="text-[10px] font-medium">Remove</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Features Banner */}
      <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-[#151515] transition-colors duration-500 flex items-center justify-center shrink-0 shadow-sm border border-gray-50 text-[#3A10E5]">
            <Sparkles size={18} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900 dark:text-[#F5F0E8] mb-1">Better Fit</h5>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Accurate size and fit recommendations</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-[#151515] transition-colors duration-500 flex items-center justify-center shrink-0 shadow-sm border border-gray-50 text-[#f472b6]">
            {/* T-Shirt Icon Approximation */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900 dark:text-[#F5F0E8] mb-1">Personalized Style</h5>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Outfits curated for your body and preferences</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-[#151515] transition-colors duration-500 flex items-center justify-center shrink-0 shadow-sm border border-gray-50 text-[#ec4899]">
            <Heart size={18} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900 dark:text-[#F5F0E8] mb-1">Saves Time</h5>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">No more guessing sizes or returns</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-[#151515] transition-colors duration-500 flex items-center justify-center shrink-0 shadow-sm border border-gray-50 text-[#6366f1]">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900 dark:text-[#F5F0E8] mb-1">Secure & Private</h5>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Your data is safe and never shared</p>
          </div>
        </div>

      </div>

      <AddMemberModal 
        isOpen={isAddMemberModalOpen || !!editMemberId} 
        onClose={() => { setIsAddMemberModalOpen(false); setEditMemberId(null); }} 
        memberToEdit={editMemberId ? members.find(m => m.id === editMemberId) : null}
      />
    </div>
  );
}
