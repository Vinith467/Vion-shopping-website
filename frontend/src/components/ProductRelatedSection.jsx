import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../services/supabaseClient';

gsap.registerPlugin(ScrollTrigger);

export default function ProductRelatedSection({ currentProduct }) {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch related products from the same category, excluding the current one
  useEffect(() => {
    async function fetchRelated() {
      if (!currentProduct) return;
      
      // First try same category
      let query = supabase
        .from('products')
        .select('*')
        .neq('id', currentProduct.id)
        .limit(8);
      
      if (currentProduct.category_id) {
        query = query.eq('category_id', currentProduct.category_id);
      }

      const { data } = await query;
      
      if (data && data.length > 0) {
        setRelatedProducts(data);
      } else {
        // Fallback: just get any other products
        const { data: fallback } = await supabase
          .from('products')
          .select('*')
          .neq('id', currentProduct.id)
          .limit(8);
        if (fallback) setRelatedProducts(fallback);
      }
    }
    fetchRelated();
  }, [currentProduct]);

  useLayoutEffect(() => {
    if (relatedProducts.length === 0) return;

    let ctx;
    // Small delay to ensure DOM has rendered the cards
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        
        const getScrollAmount = () => {
          let trackWidth = trackRef.current.scrollWidth;
          return -(trackWidth - window.innerWidth);
        };

        gsap.to(trackRef.current, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

      }, containerRef);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [relatedProducts]);

  if (!currentProduct || relatedProducts.length === 0) return null;

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image_url) return product.image_url.split(',')[0];
    return '/images/placeholder.jpg';
  };

  return (
    <div ref={containerRef} className="bg-[#0A0A0A] relative overflow-hidden">
      
      {/* Header Section */}
      <section className="pt-24 pb-16 px-6 md:px-12 max-w-5xl mx-auto text-center relative z-10">
        <span className="text-[#C49A5C] text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-4 block">
          You May Also Like
        </span>
        <h2 
          className="text-3xl md:text-5xl lg:text-6xl font-medium uppercase tracking-widest text-[#F5F0E8] mb-6" 
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Explore More
        </h2>
        <div className="w-24 h-[1px] bg-[#C49A5C] mx-auto mb-8"></div>
        <p className="text-base md:text-lg text-[#F5F0E8]/60 font-sans font-light leading-relaxed max-w-2xl mx-auto">
          Discover more pieces from our collection, curated to complement your style.
        </p>
      </section>

      {/* Horizontal Scroll Section */}
      <section ref={scrollContainerRef} className="h-screen flex items-center relative z-10">
        
        {/* Faint Background Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden">
          <h1 className="text-[20vw] font-serif font-bold text-[#F5F0E8] whitespace-nowrap">COLLECTION</h1>
        </div>

        <div 
          ref={trackRef} 
          className="flex gap-6 md:gap-8 px-6 md:px-24 flex-nowrap w-max items-center h-full"
        >
          {relatedProducts.map((product, i) => (
            <div 
              key={product.id} 
              onClick={() => navigate(`/product/${product.id}`)}
              className="w-[75vw] md:w-[380px] h-[55vh] md:h-[65vh] shrink-0 rounded-xl overflow-hidden relative group cursor-pointer transition-all duration-500 shadow-2xl"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={getProductImage(product)} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent"></div>
              </div>
              
              {/* Price Tag */}
              <div className="absolute top-4 right-4 z-20 bg-[#0A0A0A]/70 backdrop-blur-md border border-[#C49A5C]/20 px-4 py-2 rounded-sm">
                <span className="text-[#C49A5C] font-sans text-sm font-light">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              </div>
              
              {/* Content */}
              <div className="relative z-20 p-6 md:p-8 flex flex-col justify-end h-full">
                <div>
                  {product.category?.name && (
                    <span className="text-[#C49A5C] text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">
                      {product.category.name}
                    </span>
                  )}
                  <h3 
                    className="text-xl md:text-2xl font-medium uppercase tracking-wider text-[#F5F0E8] mb-3 leading-tight group-hover:text-[#C49A5C] transition-colors duration-300"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {product.name}
                  </h3>
                  <p className="font-sans font-light text-sm leading-relaxed text-[#F5F0E8]/60 line-clamp-2">
                    {product.description ? product.description.replace(/###|[*]{2,}/g, '').substring(0, 120) + '...' : 'Discover this exceptional piece from our curated collection.'}
                  </p>
                  
                  {/* View Button */}
                  <div className="mt-4 flex items-center gap-2 text-[#C49A5C] text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>View Details</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* End Spacer */}
          <div className="w-[10vw] shrink-0"></div>
        </div>
      </section>

    </div>
  );
}
