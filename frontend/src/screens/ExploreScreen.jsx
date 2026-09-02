import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Filter, Heart, Search } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useAppContext } from '../context/AppContext';
import { matchesSizeGroup, findBestMatchingVariation } from '../utils/sizeGroups';
import SpotlightCollections from '../components/SpotlightCollections';

export default function ExploreScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const sizeParam = searchParams.get('size');
  const classParam = searchParams.get('class');
  
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, members, selectedConsumerId } = useAppContext();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('All Products');
  const [categories, setCategories] = useState([]);
  
  // Get active profile info
  const activeProfile = members?.find(m => m.id === selectedConsumerId);
  const tempGender = sessionStorage.getItem('temp_gender');
  const userGender = activeProfile?.gender || tempGender;
  const activeProfileHeight = activeProfile?.height;

  useEffect(() => {
    if (!userGender && !isLoading) {
      // Redirect to select gender if we don't have one
      const currentSearchParams = new URLSearchParams(searchParams).toString();
      navigate(`/select-gender?redirect=${encodeURIComponent('/explore?' + currentSearchParams)}`);
    }
  }, [userGender, navigate, searchParams, isLoading]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      const { data: catList } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      if (catList) setCategories(catList);

      let query = supabase.from('products').select('*, category:categories(name, slug)');
      
      // If a category was passed, we need to find its ID to filter products
      if (categoryParam) {
        const { data: catData } = await supabase.from('categories').select('id, name').eq('id', categoryParam).single();
        if (catData) {
          query = query.eq('category_id', catData.id);
          setCategoryName(catData.name);
        }
      }
      
      // Removed classParam filtering since target_body_shapes is deprecated
      if (classParam) {
        setCategoryName(`${classParam} Collection`);
      }      
      // Removed the buggy Supabase .in query for sizes since size is a comma-separated string
      // if (sizeParam && sizeParam !== 'all') {
      //   query = query.in('size', [sizeParam, 'all']);
      // }
      
      const { data } = await query;
      
      let finalProducts = data || [];
      
      const activeProfile = members?.find(m => m.id === selectedConsumerId);
      
      // Filter by size group locally
      if (sizeParam && sizeParam !== 'all') {
        finalProducts = finalProducts.filter(p => matchesSizeGroup(p.size, sizeParam));
      }
      
      // Filter by height if profile exists
      if (activeProfile?.height) {
        finalProducts = finalProducts.filter(p => {
          if (!p.body_shape || p.body_shape === 'all') return true;
          const productHeights = p.body_shape.split(',').map(h => h.trim());
          return productHeights.includes('all') || productHeights.includes(activeProfile.height);
        });
      }
      
      
      setProducts(finalProducts);
      setIsLoading(false);
    }
    
    loadData();
  }, [categoryParam, sizeParam, classParam, activeProfileHeight]);

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen w-full pb-20 relative transition-colors duration-500 ">
      {/* Floating Action Header */}
      <div className="fixed top-20 md:top-24 left-0 w-full z-40 pointer-events-none p-4 md:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto pointer-events-auto">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-black/20 text-white backdrop-blur-md rounded-full hover:bg-black/40 transition-colors border border-white/10 shadow-lg">
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      <div className="w-full">
        {userGender === 'Male' ? (
          <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-gray-50 dark:bg-black/30 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl text-[#A87B45] dark:text-[#C49A5C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>V</span>
            </div>
            <h2 className="text-3xl md:text-4xl text-[#1A0A08] dark:text-[#F5F0E8] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
              Men's Collection
            </h2>
            <p className="text-[15px] text-[#555] dark:text-gray-400 max-w-md" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
              Our exclusive men's collection is currently being crafted by our master artisans. <br/><br/>Coming soon.
            </p>
          </div>
        ) : !categoryParam && categories.length > 0 ? (
          <div className="max-w-7xl mx-auto px-6 pt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <div 
                onClick={() => navigate(`/explore?${classParam ? `class=${classParam}&` : ''}category=${cat.id}`)} 
                key={cat.id || i} 
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all block cursor-pointer"
              >
                <img 
                  src={cat.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80&auto=format&fit=crop'} 
                  alt={cat.name} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center z-10">
                   <h3 className="text-white text-xl md:text-2xl tracking-[0.1em] uppercase drop-shadow-lg" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Results Info (Hidden in cinematic view for cleaner UI) */}

        {/* Product Grid */}
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-6 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[3/4] bg-gray-200 dark:bg-[#151515] rounded-2xl"></div>
                <div className="h-4 bg-gray-200 dark:bg-[#151515] rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-[#151515] rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-black/30 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">We couldn't find any items in this collection matching your criteria.</p>
            <button onClick={() => navigate('/home')} className="mt-6 px-6 py-2.5 bg-gray-900 dark:bg-white dark:bg-[#151515] transition-colors duration-500 text-white dark:text-black text-sm font-bold rounded-xl shadow-lg hover:bg-black transition-colors">
              Back to Home
            </button>
          </div>
        ) : (
          <div className="w-full">
            <SpotlightCollections products={products} categoryName={categoryName} />
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
