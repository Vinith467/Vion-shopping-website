import React, { useState, useEffect } from 'react';
import { 
  Heart, Search, ChevronRight, ArrowLeft, 
  Pencil, Filter, ChevronDown, MoreHorizontal, 
  ShoppingBag, Trash2, ChevronLeft 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AddMemberModal from './AddMemberModal';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';

export default function SavedOutfitsTab() {
  const { members, wishlist, wishlists, toggleWishlist, setPrimaryMember } = useAppContext();
  const [savedProducts, setSavedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('My Members');
  const tabs = ['My Members', 'Outfit Collections'];
  const [selectedMember, setSelectedMember] = useState(null);
  const [collectionTab, setCollectionTab] = useState('All Outfits');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  useEffect(() => {
    async function loadSavedOutfits() {
      const targetWishlist = selectedMember ? (wishlists?.[selectedMember.id] || []) : wishlist;
      if (!targetWishlist || targetWishlist.length === 0) {
        setSavedProducts([]);
        return;
      }
      const { data } = await supabase.from('products').select('*, category:categories(name)').in('id', targetWishlist);
      if (data) {
        setSavedProducts(data);
      }
    }
    loadSavedOutfits();
  }, [wishlists, selectedMember, wishlist]);

  const collectionTabs = [
    'All Outfits', 'Traditional', 'Western', 
    'Workwear', 'Casual', 'Party'
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'Outfit Collections') {
      setSelectedMember(members[0]);
    } else {
      setSelectedMember(null);
    }
  };

  const goBack = () => {
    setSelectedMember(null);
    setActiveTab('My Members');
  };

  if (selectedMember) {
    return (
      <div className="w-full flex flex-col gap-6 -mt-4 bg-white min-h-[800px]">
        {/* Back Button */}
        <button onClick={goBack} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to Members
        </button>

        {/* Member Profile Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-purple-50 shrink-0">
              <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h2>
                {selectedMember.isPrimary ? (
                  <span className="bg-[#3A10E5] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    You
                  </span>
                ) : (
                  <button 
                    onClick={() => setPrimaryMember(selectedMember.id)}
                    className="bg-[#3A10E5]/10 text-[#3A10E5] hover:bg-[#3A10E5]/20 text-[11px] font-bold px-3 py-1 rounded-full transition-colors"
                  >
                    Set as Primary Profile
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                <span>{selectedMember.age} yrs</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{selectedMember.gender}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{selectedMember.height}</span>
                {selectedMember.weight && (
                  <>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{selectedMember.weight}</span>
                  </>
                )}
              </div>
              <div className="text-sm font-medium text-gray-500 mb-3">
                {selectedMember.bodyShape} Body Shape
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[#3A10E5]/10 text-[#3A10E5] text-xs font-bold px-3 py-1.5 rounded-md">
                  Recommended Size: {selectedMember.recommendedSize}
                </div>
                <button className="text-[#3A10E5] p-1.5 hover:bg-purple-50 rounded-md transition-colors">
                  <Pencil size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#F8F6FF] rounded-2xl p-6 flex items-center gap-6 min-w-[200px] border border-purple-100">
            <div className="w-12 h-12 rounded-xl bg-white text-[#3A10E5] flex items-center justify-center shadow-sm">
              <Heart size={20} className="fill-current" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-900 mb-1">{savedProducts.length}</h3>
              <p className="text-xs font-semibold text-gray-500">Saved Outfits</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Controls Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-200 mt-4">
          <div className="flex gap-8 overflow-x-auto hide-scrollbar w-full lg:w-auto pt-2">
            {collectionTabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setCollectionTab(tab)}
                className={`text-sm font-bold whitespace-nowrap transition-colors relative pb-4 ${
                  collectionTab === tab ? 'text-[#3A10E5]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
                {collectionTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A10E5]"></div>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto pb-4 lg:pb-0">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-[#3A10E5] hover:bg-gray-50 transition-colors">
              <Filter size={16} /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Recently Added <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 mt-2">
          {savedProducts
            .filter(product => collectionTab === 'All Outfits' || product.category?.name === collectionTab)
            .map(product => (
            <div key={product.id} className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
              <Link to={`/product/${product.id}`} className="relative aspect-[3/4] bg-gray-100 block">
                <img src={product.images?.[0] || '/images/placeholder.jpg'} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
              </Link>
              
              <div className="p-4 flex flex-col gap-1 border-b border-gray-50">
                <Link to={`/product/${product.id}`}>
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1 hover:text-[#3A10E5]">{product.title}</h4>
                </Link>
                <p className="text-[12px] font-bold text-gray-500">₹{parseFloat(product.price).toLocaleString()}</p>
              </div>

              <div className="p-3 flex justify-between items-center bg-white">
                <Link to={`/product/${product.id}`} className="w-8 h-8 rounded-full flex items-center justify-center text-[#3A10E5] bg-[#3A10E5]/5 hover:bg-[#3A10E5]/10 transition-colors">
                  <ShoppingBag size={14} />
                </Link>
                <button onClick={() => toggleWishlist(product.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#3A10E5] bg-[#3A10E5]/5 hover:bg-[#3A10E5]/10 transition-colors">
                  <Heart size={14} className="fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8 mb-4">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#3A10E5] text-white font-bold text-sm">
            1
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-sm transition-colors">
            2
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    );
  }

  // --- Main Grid View ---
  return (
    <div className="w-full flex flex-col gap-6 -mt-4">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-[28px] font-bold text-gray-900 font-serif">Saved Outfits</h2>
            <Heart size={24} className="text-[#3A10E5]" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Your favorite outfits, saved for every member.</p>
        </div>
        <button 
          onClick={() => setIsAddMemberModalOpen(true)}
          className="bg-[#3A10E5] hover:bg-[#2A08B5] text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          + Add Another Member
        </button>
      </div>

      {/* 2. Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4 mt-2">
        
        {/* Tabs */}
        <div className="flex gap-8 overflow-x-auto hide-scrollbar w-full md:w-auto">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`text-sm font-bold whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-[#3A10E5]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute -bottom-[18px] left-0 right-0 h-1 bg-[#3A10E5] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            value={searchMemberQuery}
            onChange={(e) => setSearchMemberQuery(e.target.value)}
            placeholder="Search member..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#3A10E5] focus:ring-1 focus:ring-[#3A10E5] transition-all bg-transparent"
          />
        </div>

      </div>

      {/* 3. Main Content (Member Cards) */}
      <div className="mt-2">
        <h3 className="text-base font-bold text-gray-900 mb-6">Your Members ({members.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.filter(m => m.name.toLowerCase().includes(searchMemberQuery.toLowerCase())).map((member) => (
            <div 
              key={member.id} 
              onClick={() => setSelectedMember(member)}
              className={`flex flex-col bg-white rounded-3xl overflow-hidden transition-all shadow-sm hover:shadow-md cursor-pointer ${
                member.isPrimary ? 'border-2 border-[#3A10E5] bg-[#3A10E5]/[0.02]' : 'border border-gray-100 hover:border-gray-200'
              }`}
            >
              
              {/* Top Section */}
              <div className="p-8 pb-6 flex flex-col items-center text-center relative">
                
                {/* Avatar */}
                <div className="relative w-28 h-28 mb-5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  {member.isPrimary ? (
                    <div className="absolute top-0 right-0 bg-[#3A10E5] text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-white shadow-sm">
                      You
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPrimaryMember(member.id); }}
                      className="absolute top-0 right-0 bg-white text-[#3A10E5] border border-gray-200 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      Set Primary
                    </button>
                  )}
                </div>

                {/* Info */}
                <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500 mb-1">
                  <span>{member.age} yrs</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{member.gender}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{member.height}</span>
                </div>
                <div className="text-xs font-medium text-gray-500 mb-4">
                  {member.bodyShape} Body Shape
                </div>
                <div className="bg-[#3A10E5]/10 text-[#3A10E5] text-xs font-bold px-3 py-1 rounded-md">
                  Recommended Size: {member.recommendedSize}
                </div>
                
              </div>

              {/* Bottom Section */}
              <div className={`mt-auto border-t p-6 flex items-center justify-between group ${
                member.isPrimary ? 'border-[#3A10E5]/10 bg-white' : 'border-gray-100'
              }`}>
                <div>
                  <h5 className={`text-3xl font-black mb-1 ${member.isPrimary ? 'text-[#3A10E5]' : 'text-[#3A10E5]'}`}>
                    {wishlists?.[member.id]?.length || 0}
                  </h5>
                  <p className="text-xs font-medium text-gray-500">Saved Outfits</p>
                </div>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#3A10E5] group-hover:bg-[#3A10E5]/5 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
      
      <AddMemberModal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)} 
      />

    </div>
  );
}
