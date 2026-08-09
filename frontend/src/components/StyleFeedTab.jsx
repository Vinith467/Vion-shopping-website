import React, { useState } from 'react';
import { Heart, Maximize2, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAppContext } from '../context/AppContext';

const womensFeed = [
  { id: 1, image: '/images/lavender-dress.jpg', title: 'Summer Lavender', likes: 124, categories: ['Trending', 'Party'] },
  { id: 2, image: '/images/dress-red.jpg', title: 'Crimson Elegance', likes: 256, categories: ['Party', 'Trending'] },
  { id: 3, image: '/images/coat-green.jpg', title: 'Olive Trench', likes: 198, categories: ['Workwear', 'Street Style'] },
  { id: 4, image: '/images/cat-accessories.jpg', title: 'Floral Accessories', likes: 89, categories: ['Street Style', 'Trending'] },
  { id: 5, image: '/images/formal_dresses.jpg', title: 'Evening Wear', likes: 312, categories: ['Workwear', 'Party'] },
  { id: 6, image: '/images/fash_fit_hero.jpg', title: 'Casual Chic', likes: 142, categories: ['Trending', 'Street Style'] },
];

const mensFeed = [
  { id: 7, image: '/images/shirt-orange.jpg', title: 'Vibrant Casual', likes: 142, categories: ['Trending', 'Street Style'] },
  { id: 8, image: '/images/cat-jackets.jpg', title: 'Leather Jacket', likes: 67, categories: ['Street Style', 'Party'] },
  { id: 9, image: '/images/business_suits.jpg', title: 'Classic Suit', likes: 256, categories: ['Workwear', 'Trending'] },
  { id: 10, image: '/images/smart_casual.png', title: 'Smart Casual', likes: 198, categories: ['Workwear', 'Party'] },
  { id: 11, image: '/images/cat-jeans.jpg', title: 'Denim Style', likes: 89, categories: ['Street Style', 'Trending'] },
];

export default function StyleFeedTab() {
  const { members, selectedConsumerId, setSelectedConsumerId } = useAppContext();
  const currentMember = members.find(m => m.id === selectedConsumerId) || members[0] || {};
  
  const feedItems = currentMember.gender === 'Male' ? mensFeed : womensFeed;

  const [savedItems, setSavedItems] = useState([2, 5]);
  const [activeCategory, setActiveCategory] = useState('For You');

  const displayFeedItems = activeCategory === 'For You' 
    ? feedItems 
    : feedItems.filter(item => item.categories.includes(activeCategory));

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
          <h2 className="text-[28px] font-bold text-gray-900 mb-2 font-serif">Style Feed</h2>
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
                    ? 'bg-white text-[#3A10E5] shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
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
        {['For You', 'Trending', 'Workwear', 'Street Style', 'Party'].map((cat) => (
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
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {displayFeedItems.map((item) => (
          <div key={item.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); toast('Link copied!'); }}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                >
                  <Share2 size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleSave(item.id); }}
                  className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
                    savedItems.includes(item.id) 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/40'
                  }`}
                >
                  <Heart size={14} className={savedItems.includes(item.id) ? 'fill-current' : ''} />
                </button>
              </div>

              <div>
                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-white/80 text-xs font-medium">{item.likes} saves</p>
                  <button className="text-white/90 hover:text-white transition-colors">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
