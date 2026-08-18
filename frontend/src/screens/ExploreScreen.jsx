import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Filter, Heart, Search } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useAppContext } from '../context/AppContext';

export default function ExploreScreen() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const sizeParam = searchParams.get('size');
  const classParam = searchParams.get('class');
  
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useAppContext();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('All Products');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      let query = supabase.from('products').select('*, category:categories(name, slug)');
      
      // If a category was passed, we need to find its ID to filter products
      if (categoryParam) {
        const { data: catData } = await supabase.from('categories').select('id, name').eq('id', categoryParam).single();
        if (catData) {
          query = query.eq('category_id', catData.id);
          setCategoryName(catData.name);
        }
      }
      
      // If class was passed (Casual, Exclusive, Exclusive Plus), filter by target_body_shapes
      if (classParam) {
        query = query.contains('target_body_shapes', [classParam]);
        setCategoryName(`${classParam} Collection`);
      }
      
      if (sizeParam && sizeParam !== 'all') {
        query = query.in('size', [sizeParam, 'all']);
      }
      
      const { data } = await query;
      
      setProducts(data || []);
      setIsLoading(false);
    }
    
    loadData();
  }, [categoryParam, sizeParam]);

  return (
    <div className="bg-white min-h-screen w-full pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-40 border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} className="text-gray-900" />
            </button>
            <h1 className="text-xl font-serif font-bold text-gray-900">{categoryName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-gray-900"><Search size={20} /></button>
            <button className="p-2 text-gray-600 hover:text-gray-900"><Filter size={20} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-bold text-gray-500">
            {products.length} {products.length === 1 ? 'result' : 'results'} found
          </p>
          {sizeParam && sizeParam !== 'all' && (
            <div className="bg-white/80 backdrop-blur-md rounded-full px-4 py-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),_0_2px_4px_rgba(0,0,0,0.05)] border border-[#1A0A08]/10 text-xs font-bold text-[#1A0A08] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8B6544]"></span>Matched for size {sizeParam}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[3/4] bg-gray-200 rounded-2xl"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-sm text-gray-500 max-w-xs">We couldn't find any items in this collection matching your criteria.</p>
            <button onClick={() => navigate('/home')} className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-black transition-colors">
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="flex flex-col gap-3 group cursor-pointer">
                <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-shadow group-hover:shadow-md">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'} 
                    alt={product.title} 
                    loading="lazy"
                    className="w-full h-full object-cover shrink-0 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                  />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10"
                  >
                    <Heart size={16} className={`transition-colors ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
                  </button>
                  {product.is_new_arrival && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-gray-900 shadow-sm">
                      New
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{product.title}</h4>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm font-bold text-gray-900">₹{parseFloat(product.price).toLocaleString()}</span>
                    {product.compare_at_price && (
                      <span className="text-xs text-gray-400 line-through">₹{parseFloat(product.compare_at_price).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
