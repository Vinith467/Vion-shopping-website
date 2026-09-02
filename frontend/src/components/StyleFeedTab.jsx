import React, { useState } from 'react';
import { Heart, Maximize2, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAppContext } from '../context/AppContext';

import { supabase } from '../services/supabaseClient';

export default function StyleFeedTab() {
  const { members, selectedConsumerId, setSelectedConsumerId } = useAppContext();
  const currentMember = members.find(m => m.id === selectedConsumerId) || members[0] || {};
  
  const [feedItems, setFeedItems] = useState([]);
  const [categories, setCategories] = useState(['For You']);
  const [savedItems, setSavedItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('For You');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function fetchStyleFeed() {
      setIsLoading(true);
      const gender = currentMember.gender || 'Female';
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .contains('target_genders', [gender])
        .eq('status', 'active');
      
      if (!error && data) {
        setFeedItems(data);
        
        // Categories derived from style/occasion tags are removed as they are deprecated
        setCategories(['For You']);      }
      setIsLoading(false);
    }
    
    if (currentMember.id) {
      fetchStyleFeed();
    }
  }, [currentMember.id, currentMember.gender]);

  const displayFeedItems = feedItems;

  const toggleSave = (id) => {
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(item => item !== id));
      toast('Removed from Saved Outfits', { icon: '💔' });
    } else {
      setSavedItems([...savedItems, id]);
      toast.success('Added to Saved Outfits!');
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 -mt-4">
      {/* Header & Member Selection */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-gray-900 dark:text-[#F5F0E8] mb-2 font-serif">Style Feed</h2>
          <p className="text-sm text-gray-500 font-medium">Curated outfit inspirations based on {currentMember.name}'s preferences.</p>
        </div>
        
        {/* Member Selector */}
        {members.length > 1 && (
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 overflow-x-auto max-w-full hide-scrollbar">
            {members.map(member => (
              <button
                key={member.id}
                onClick={() => setSelectedConsumerId(member.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedConsumerId === member.id 
                    ? 'bg-white dark:bg-[#151515] transition-colors duration-500 text-[#3A10E5] shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-[#F5F0E8]'
                }`}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
                  <img src={member.image} alt="" className="w-full h-full object-cover" />
                </div>
                {member.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeCategory === cat ? 'bg-[#3A10E5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-8 h-8 border-4 border-[#3A10E5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : displayFeedItems.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {displayFeedItems.map((item) => (
            <div key={item.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer">
              <img 
                src={item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.jpg'} 
                alt={item.title} 
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toast('Link copied!'); }}
                    className="w-8 h-8 rounded-full bg-white/20 dark:bg-[#151515]/20 transition-colors duration-500 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 transition-colors"
                  >
                    <Share2 size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleSave(item.id); }}
                    className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
                      savedItems.includes(item.id) 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-white/20 dark:bg-[#151515]/20 transition-colors duration-500 text-white hover:bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 '
                    }`}
                  >
                    <Heart size={14} className={savedItems.includes(item.id) ? 'fill-current' : ''} />
                  </button>
                </div>

                <div>
                  <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-white/80 text-xs font-medium">₹{item.price}</p>
                    <button className="text-white/90 hover:text-white transition-colors">
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-2xl">
          <p className="text-gray-500 font-medium">No items found matching this category.</p>
        </div>
      )}

    </div>
  );
}
