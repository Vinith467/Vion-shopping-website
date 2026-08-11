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
  }).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

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
      <div className="flex w-full flex-col bg-white overflow-x-hidden">
        
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
        <div id="collections" className="w-full shrink-0 px-6 lg:px-10 pt-6 pb-8 xl:pt-8 xl:pb-12 flex flex-col bg-white z-10 justify-center scroll-mt-24">
          
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
                        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-3 md:gap-4 xl:gap-5 items-start py-2 px-2 md:px-4 max-w-7xl mx-auto">
                          {shapeCats.map((cat, i) => (
                            <Link to={`/explore?category=${cat.id}&body_shape=${shape.id}`} key={i} className="flex flex-col gap-2 md:gap-3 shrink-0 group cursor-pointer snap-start w-full md:w-[170px] lg:w-[150px] xl:w-[185px]">
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
                      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-3 md:gap-4 xl:gap-5 items-start py-2 px-2 md:px-4 max-w-7xl mx-auto">
                        {desktopCategories.filter(cat => {
                          const match = cat.slug ? cat.slug.match(/___BODYSHAPE_([a-zA-Z0-9\-]+)/) : null;
                          return (match ? match[1] : 'all') === 'all';
                        }).map((cat, i) => (
                          <Link to={`/explore?category=${cat.id}&body_shape=all`} key={i} className="flex flex-col gap-2 md:gap-3 shrink-0 group cursor-pointer snap-start w-full md:w-[170px] lg:w-[150px] xl:w-[185px]">
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
                <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-3 md:gap-4 xl:gap-5 items-start py-2 px-2 md:px-4 max-w-7xl mx-auto">
                  {desktopCategories.map((cat, i) => (
                    <Link to={`/explore?category=${cat.id}&body_shape=${selectedBodyShape}`} key={i} className="flex flex-col gap-2 md:gap-3 shrink-0 group cursor-pointer snap-start w-full md:w-[170px] lg:w-[150px] xl:w-[185px]">
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
