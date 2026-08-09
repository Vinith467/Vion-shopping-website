import { Menu, Bell, ShoppingBag, ChevronDown, Users, Star, Heart, ArrowRight, Search, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useAppContext } from "../context/AppContext";

const getCategoryIcon = (name) => {
  if (name.includes('Dress') || name.includes('Wear') || name.includes('Shirt') || name.includes('Top') || name.includes('Blazer') || name.includes('Jacket')) {
    return <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>;
  }
  if (name.includes('Access')) {
    return <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
  }
  if (name.includes('Jean') || name.includes('Trouser')) {
    return <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 21v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"/></svg>;
  }
  if (name.includes('Foot')) {
    return <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v-2.38C4 11.5 5.5 10 7.38 10h9.24C18.5 10 20 11.5 20 13.38V16"/><path d="M2 16h20v2H2z"/></svg>;
  }
  return <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
};

export default function HomeScreen() {
  const { profile, members } = useAppContext();
  const primaryMember = members?.find(m => m.isPrimary);
  const [selectedGender, setSelectedGender] = useState('women');
  const [selectedBodyShape, setSelectedBodyShape] = useState('all');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (primaryMember) {
      if (primaryMember.gender) {
        setSelectedGender(primaryMember.gender.toLowerCase() === 'male' ? 'men' : 'women');
      }
    }
  }, [primaryMember]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      // Fetch categories
      const { data: catData } = await supabase.from('categories').select('*');
      setCategories(catData || []);

      // Fetch products
      const { data: prodData } = await supabase.from('products').select('*').limit(10);
      setProducts(prodData || []);
      
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Filter categories by gender and body shape from slug metadata
  const desktopCategories = categories.filter(cat => {
    // Decode metadata from slug
    const genderMatch = cat.slug ? cat.slug.match(/___GENDER_([a-zA-Z0-9\-]+)/) : null;
    const bodyShapeMatch = cat.slug ? cat.slug.match(/___BODYSHAPE_([a-zA-Z0-9\-]+)/) : null;
    
    const catGender = genderMatch ? genderMatch[1] : 'women'; // Default to women if no tag
    const catBodyShape = bodyShapeMatch ? bodyShapeMatch[1] : 'all'; // Default to all if no tag

    // Filter by Gender
    if (catGender !== selectedGender && catGender !== 'unisex') return false;

    // Filter by Body Shape
    if (selectedBodyShape !== 'all' && catBodyShape !== 'all' && catBodyShape !== selectedBodyShape) return false;

    return true;
  });

  const BODY_SHAPES = [
    { id: 'all', label: 'All Shapes' },
    { id: 'hourglass', label: 'Hourglass' },
    { id: 'pear', label: 'Pear' },
    { id: 'apple', label: 'Apple' },
    { id: 'rectangle', label: 'Rectangle' },
    { id: 'inverted-triangle', label: 'Inverted Triangle' }
  ];

  return (
    <>
      {/* MOBILE LAYOUT (Unchanged) */}
      <div className="block md:hidden w-full flex flex-col bg-white min-h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-200 shadow-sm">
              <img src={primaryMember?.image || "/images/body_hourglass_1785826886362.jpg"} alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Welcome back,</p>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">{profile?.firstName || 'Guest'}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 bg-gray-50 rounded-full relative">
              <Bell size={20} className="text-gray-900" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        <div className="px-6 flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="mt-2 bg-gray-50 rounded-2xl flex items-center px-4 py-3.5 border border-gray-100 shadow-sm">
            <Search size={20} className="text-gray-400 mr-3 shrink-0" />
            <input 
              type="text" 
              placeholder="Search for dresses, shirts, styles..." 
              className="bg-transparent outline-none flex-1 text-sm text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Collections Horizontal Scroll */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Collections</h3>
              <button className="text-xs font-semibold text-[#6344D4]">See All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {categories.map((cat, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 border border-gray-100 shadow-sm overflow-hidden ${index === 0 ? 'bg-[#6344D4]' : 'bg-gray-50'}`}>
                    {index === 0 ? (
                      <Star size={24} className="text-white" fill="white" />
                    ) : (
                      <img src={cat.image_url || '/images/silk-wrap-dress.jpg'} alt={cat.name} className="w-full h-full object-cover mix-blend-multiply" />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold ${index === 0 ? 'text-[#6344D4]' : 'text-gray-600'}`}>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* High Match Promo Box */}
          <div className="mt-6 bg-[#F8F6FF] rounded-3xl p-5 border border-[#6344D4]/10 shadow-sm relative overflow-hidden h-40 flex flex-col justify-center">
            <div className="z-10 w-[60%]">
              <h3 className="text-lg font-black text-gray-900 leading-tight">High match for your<br/>body type</h3>
              <p className="text-[10px] text-gray-600 mt-2 mb-4 pr-4 leading-relaxed font-medium">We found styles that fit and flatter you the most.</p>
              <button className="bg-[#1A1A1A] text-white text-[10px] font-bold px-5 py-2.5 rounded-full shadow-lg hover:bg-black transition-colors">
                Explore Now
              </button>
            </div>
            
            <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 flex items-center h-full w-[50%]">
              <div className="relative w-full h-full">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[70%] h-[80%] rounded-2xl overflow-hidden border-4 border-white shadow-xl z-20 origin-center">
                  <img src="/images/silk-wrap-dress.jpg" className="w-full h-full object-cover" />
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-[60%] w-[60%] h-[70%] rounded-2xl overflow-hidden border-4 border-white shadow-md z-10 -rotate-6 opacity-90">
                  <img src="/images/linen-overshirt.jpg" className="w-full h-full object-cover" />
                </div>
                <div className="absolute right-12 top-1/2 -translate-y-[40%] w-[50%] h-[60%] rounded-2xl overflow-hidden border-4 border-white shadow-sm z-0 -rotate-12 opacity-80">
                  <img src="/images/dress-red.jpg" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm z-30 border border-[#6344D4]/20 flex flex-col items-center">
              <span className="text-xs font-black text-[#6344D4]">95%</span>
              <span className="text-[6px] font-bold text-gray-500 uppercase tracking-widest">Match Score</span>
            </div>
          </div>

          {/* Recommended for You Grid */}
          <div className="mt-8 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">Recommended for you</h3>
                <Heart size={16} className="text-[#6344D4]" fill="#6344D4" />
              </div>
              <button className="text-xs font-bold text-[#6344D4] flex items-center gap-1 group">
                View all <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="flex flex-col gap-3 group cursor-pointer">
                  <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-shadow group-hover:shadow-md">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover shrink-0 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                    />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        // Heart action logic would go here
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                  <div className="px-1">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{product.title}</h4>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-sm font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
                      <span className="text-[10px] md:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        85% Match
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:flex w-full flex-col bg-white overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] min-h-[500px] shrink-0 overflow-hidden bg-black flex items-center group">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video 
              src="/video/herobannervideo.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover" 
            />
            {/* Subtle gradient just behind the text to maintain readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent w-full md:w-2/3 transition-opacity duration-500 group-hover:opacity-0"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 flex w-full px-10 lg:px-16 h-full items-center transition-opacity duration-500 group-hover:opacity-0">
            {/* Left Typography */}
            <div className="flex flex-col items-start justify-center max-w-2xl mt-4 xl:mt-8 relative z-20 w-[45%]">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-[1.15] mb-3 xl:mb-4">
                See Yourself.<br />
                <span className="text-[#E5B8D9]">Love Your Fit.</span><br />
                Shop with Confidence.
              </h1>
              <p className="text-[10px] md:text-xs lg:text-sm text-gray-300 max-w-md mb-5 xl:mb-8 font-medium">
                AI-powered try-on, personalized size recommendations and styles just for you.
              </p>

            </div>
          </div>
        </section>

        {/* Collections Section */}
        <div className="w-full shrink-0 px-6 lg:px-10 pt-6 pb-8 xl:pt-8 xl:pb-12 flex flex-col bg-white z-10 justify-center">
          
          <div className="w-full flex flex-col gap-3 xl:gap-5">
            
            {/* Real Collections Row */}
            <div className="w-full flex flex-col items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-wider uppercase text-center">Collections</h2>
              
              {/* Gender Toggle */}
              <div className="flex items-center gap-8 mt-4 mb-4">
                <button 
                  onClick={() => setSelectedGender('women')}
                  className={`text-sm font-bold tracking-wider uppercase transition-all pb-1.5 border-b-2 ${selectedGender === 'women' ? 'text-[#6344D4] border-[#6344D4]' : 'text-gray-400 border-transparent hover:text-gray-700'}`}
                >
                  Women
                </button>
                <button 
                  onClick={() => setSelectedGender('men')}
                  className={`text-sm font-bold tracking-wider uppercase transition-all pb-1.5 border-b-2 ${selectedGender === 'men' ? 'text-[#6344D4] border-[#6344D4]' : 'text-gray-400 border-transparent hover:text-gray-700'}`}
                >
                  Men
                </button>
              </div>

              {/* Body Shape Filters */}
              <div className="flex flex-wrap items-center justify-center gap-2 px-4 max-w-4xl mx-auto">
                {BODY_SHAPES.map(shape => (
                  <button
                    key={shape.id}
                    onClick={() => setSelectedBodyShape(shape.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedBodyShape === shape.id 
                        ? 'bg-[#6344D4] text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full flex items-center group/row justify-center">
              {desktopCategories.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 italic border border-dashed border-gray-300 rounded-lg w-full max-w-md text-center mx-auto">
                  No collections created yet. Create them in the Admin Panel!
                </div>
              ) : selectedBodyShape === 'all' ? (
                <div className="w-full flex flex-col gap-12">
                  {BODY_SHAPES.filter(s => s.id !== 'all').map(shape => {
                    const shapeCats = desktopCategories.filter(cat => {
                      const match = cat.slug ? cat.slug.match(/___BODYSHAPE_([a-zA-Z0-9\-]+)/) : null;
                      return (match ? match[1] : 'all') === shape.id;
                    });
                    
                    if (shapeCats.length === 0) return null;
                    
                    return (
                      <div key={shape.id} className="w-full flex flex-col items-center border-t border-gray-100 pt-8 first:border-0 first:pt-0">
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-6 tracking-wide">{shape.label} Body Type Collection</h3>
                        <div className="w-full flex flex-wrap justify-center gap-4 xl:gap-6 items-start py-2 px-4">
                          {shapeCats.map((cat, i) => (
                            <Link to={`/explore?category=${cat.id}&body_shape=${shape.id}`} key={i} className="flex flex-col gap-3 shrink-0 group cursor-pointer snap-start" style={{ width: 'clamp(140px, 12vw, 200px)' }}>
                              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-md border border-gray-100 relative w-full bg-gray-50">
                                <img src={cat.image_url || '/images/silk-wrap-dress.jpg'} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              </div>
                              <div className="text-center w-full px-1">
                                <span className="text-sm xl:text-base font-serif font-bold text-gray-900 leading-snug tracking-wide">{cat.name}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* General / Unassigned Collections */}
                  {desktopCategories.filter(cat => {
                    const match = cat.slug ? cat.slug.match(/___BODYSHAPE_([a-zA-Z0-9\-]+)/) : null;
                    return (match ? match[1] : 'all') === 'all';
                  }).length > 0 && (
                    <div className="w-full flex flex-col items-center border-t border-gray-100 pt-8 first:border-0 first:pt-0">
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-6 tracking-wide">General Collection</h3>
                      <div className="w-full flex flex-wrap justify-center gap-4 xl:gap-6 items-start py-2 px-4">
                        {desktopCategories.filter(cat => {
                          const match = cat.slug ? cat.slug.match(/___BODYSHAPE_([a-zA-Z0-9\-]+)/) : null;
                          return (match ? match[1] : 'all') === 'all';
                        }).map((cat, i) => (
                          <Link to={`/explore?category=${cat.id}&body_shape=all`} key={i} className="flex flex-col gap-3 shrink-0 group cursor-pointer snap-start" style={{ width: 'clamp(140px, 12vw, 200px)' }}>
                            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-md border border-gray-100 relative w-full bg-gray-50">
                              <img src={cat.image_url || '/images/silk-wrap-dress.jpg'} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="text-center w-full px-1">
                              <span className="text-sm xl:text-base font-serif font-bold text-gray-900 leading-snug tracking-wide">{cat.name}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full flex flex-wrap justify-center gap-4 xl:gap-6 items-start py-2 px-4">
                  {desktopCategories.map((cat, i) => (
                    <Link to={`/explore?category=${cat.id}&body_shape=${selectedBodyShape}`} key={i} className="flex flex-col gap-3 shrink-0 group cursor-pointer snap-start" style={{ width: 'clamp(140px, 12vw, 200px)' }}>
                      <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-md border border-gray-100 relative w-full bg-gray-50">
                        <img src={cat.image_url || '/images/silk-wrap-dress.jpg'} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="text-center w-full px-1">
                        <span className="text-sm xl:text-base font-serif font-bold text-gray-900 leading-snug tracking-wide">{cat.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
