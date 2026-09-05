import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { uploadImage } from '../../services/storageService';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, X, Check, Image as ImageIcon, Package, DollarSign, Copy, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import TagInput from '../../components/TagInput';

const skinTonesMap = [
  { id: 'all', name: 'All Skin Tones', color: 'linear-gradient(135deg, #F9E4D4 0%, #4A2A11 100%)' },
  { id: 'Light', name: 'Light', color: '#F4D3B6' },
  { id: 'Medium', name: 'Medium', color: '#C28E66' },
  { id: 'Wheatish', name: 'Wheatish', color: '#985F35' },
  { id: 'Tan', name: 'Tan', color: '#6A3B18' }
];

const sizesMap = [
  { id: 'all', name: 'All Sizes' },
  { id: 'XS', name: 'XS' },
  { id: 'S', name: 'S' },
  { id: 'M', name: 'M' },
  { id: 'L', name: 'L' },
  { id: 'XL', name: 'XL' },
  { id: 'XXL', name: 'XXL' },
  { id: '3XL', name: '3XL' },
  { id: '4XL', name: '4XL' },
  { id: '5XL', name: '5XL' }
];

const heightsMap = [
  { id: 'all', name: 'All Heights' },
  { id: 'Below 5\'0"', name: 'Below 5\'0"' },
  { id: '5\'0" - 5\'3"', name: '5\'0" - 5\'3"' },
  { id: '5\'4" - 5\'7"', name: '5\'4" - 5\'7"' },
  { id: '5\'8" - 6\'0"', name: '5\'8" - 6\'0"' },
  { id: 'Above 6\'0"', name: 'Above 6\'0"' }
];

const IMAGE_SLOTS = [
  'Main Image',
  'Front View',
  'Left View',
  'Back View',
  'Right View',
  'Folded Costume',
  'Product Details (Why wear)',
  'Lifestyle Image 1',
  'Lifestyle Image 2',
  'Lifestyle Image 3',
  'Lifestyle Image 4'
];

import { useParams, useNavigate } from "react-router-dom";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [spotlightImages, setSpotlightImages] = useState([]);
  const [variationImages, setVariationImages] = useState({});
  const [shadeImages, setShadeImages] = useState({});

  const initialForm = {
    title: '',
    description: '',
    price: '',
    compare_at_price: '',
    sku: '',
    quantity: 0,
    category_id: '',
    status: 'draft',
    image_url: '',
    video_url: '',
    is_featured: false,
    is_new_arrival: false,
    size: 'all',
    target_genders: [],
    variations: [],
    marketing_content: {
      hero: [],
      showcases: []
    }
  };

  const [formData, setFormData] = useState(initialForm);
  const [productVideo, setProductVideo] = useState(null);
  const [secondaryProductVideo, setSecondaryProductVideo] = useState(null);
  const [bannerProductVideo, setBannerProductVideo] = useState(null);
  const [bannerProductImage, setBannerProductImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // No need to validate category_id against body_shape anymore since we use size
  useEffect(() => {
    // Keep this hook empty or remove logic if unnecessary
  }, [formData.size, categories]);


  const loadProductIntoForm = (prod) => {
    setEditingId(prod.id);
    setFormData({
      title: prod.title,
      description: prod.description || '',
      price: prod.price || '',
      compare_at_price: prod.compare_at_price || '',
      sku: prod.sku || '',
      quantity: prod.quantity !== undefined ? prod.quantity : 0,
      category_id: prod.category_id || '',
      status: prod.status || 'draft',
      image_url: prod.image_url || '',
      video_url: prod.video_url || '',
      secondary_video_url: prod.secondary_video_url || '',
      is_featured: prod.is_featured || false,
      is_new_arrival: prod.is_new_arrival || false,
      size: prod.size || prod.body_shape || 'all',
      target_genders: prod.target_genders || [],
      variations: prod.variations || [],
      marketing_content: {
        hero: Array.isArray(prod.marketing_content?.hero) 
          ? prod.marketing_content.hero 
          : (prod.marketing_content?.hero ? [prod.marketing_content.hero] : []),
        showcases: prod.marketing_content?.showcases || []
      }
    });

    setProductVideo(prod?.video_url ? { type: 'existing', url: prod.video_url } : null);
    setSecondaryProductVideo(prod?.secondary_video_url ? { type: 'existing', url: prod.secondary_video_url } : null);
    setBannerProductVideo(prod?.marketing_content?.banner_video_url ? { type: 'existing', url: prod.marketing_content.banner_video_url } : null);
    setBannerProductImage(prod?.marketing_content?.banner_image_url ? { type: 'existing', url: prod.marketing_content.banner_image_url } : null);

    let urls = [];
    if (prod.images && Array.isArray(prod.images)) {
      urls = prod.images;
    } else if (prod.image_url) {
      urls = prod.image_url.split(',');
    }
    setProductImages(initializeImagesWithLabels(urls));

    if (prod.variations) {
      const vImages = {};
      const sImages = {};
      prod.variations.forEach((v, idx) => {
        vImages[idx] = initializeImagesWithLabels(v.image_urls || []);
        if (v.shade_image_url) {
          sImages[idx] = { type: 'existing', url: v.shade_image_url };
        }
      });
      setVariationImages(vImages);
      setShadeImages(sImages);
    }

    let sUrls = Array.isArray(prod.spotlight_images) ? prod.spotlight_images : [];
    const initSpotlight = [];
    for (let i = 0; i < 5; i++) {
      if (sUrls[i]) {
        initSpotlight.push({ type: 'existing', url: sUrls[i], label: `Spotlight ${i+1}` });
      } else {
        initSpotlight.push({ type: 'empty', label: `Spotlight ${i+1}` });
      }
    }
    setSpotlightImages(initSpotlight);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: catData } = await supabase.from('categories').select('id, name, slug');
      setCategories(catData || []);


      if (isEditMode && id) {
        const { data: prod, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (prodError) throw prodError;
        if (prod) loadProductIntoForm(prod);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    productImages.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    spotlightImages.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    if (productVideo && productVideo.type === 'new') URL.revokeObjectURL(productVideo.preview);
    if (secondaryProductVideo && secondaryProductVideo.type === 'new') URL.revokeObjectURL(secondaryProductVideo.preview);
    if (bannerProductVideo && bannerProductVideo.type === 'new') URL.revokeObjectURL(bannerProductVideo.preview);
    if (bannerProductImage && bannerProductImage.type === 'new') URL.revokeObjectURL(bannerProductImage.preview);
    Object.values(variationImages).forEach(vArr => {
      vArr.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    });
    setProductVideo(null);
    setSecondaryProductVideo(null);
    setBannerProductVideo(null);
    setBannerProductImage(null);
    setShowModal(false);
  };

  const handleDragStart = (e, idx, isVariation = false, varIdx = null) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ idx, isVariation, varIdx }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetIdx, isVariationTarget = false, varIdxTarget = null) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      
      const data = JSON.parse(dataStr);
      if (data.isVariation !== isVariationTarget) return;
      if (data.isVariation && data.varIdx !== varIdxTarget) return;
      
      const sourceIdx = data.idx;
      if (sourceIdx === targetIdx) return;

      if (data.isSpotlight) {
        setSpotlightImages(prev => {
          const newArr = [...prev];
          const temp = newArr[sourceIdx];
          newArr[sourceIdx] = newArr[targetIdx];
          newArr[targetIdx] = temp;
          return newArr;
        });
      } else if (isVariationTarget) {
        setVariationImages(prev => {
          const newArr = [...(prev[varIdxTarget] || [])];
          const temp = newArr[sourceIdx];
          newArr[sourceIdx] = newArr[targetIdx];
          newArr[targetIdx] = temp;
          return { ...prev, [varIdxTarget]: newArr };
        });
      } else {
        setProductImages(prev => {
          const newArr = [...prev];
          const temp = newArr[sourceIdx];
          newArr[sourceIdx] = newArr[targetIdx];
          newArr[targetIdx] = temp;
          return newArr;
        });
      }
    } catch (err) {
      console.error('Drag and drop error', err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const initializeImagesWithLabels = (urls = []) => {
    let result = [];
    let defaultLabels = [...IMAGE_SLOTS];
    
    for (let i = 0; i < urls.length; i++) {
      let url = urls[i];
      if (!url) continue;
      
      let label = defaultLabels[i] || `Image ${i+1}`;
      let cleanUrl = url;
      
      if (url.includes('#label=')) {
        const parts = url.split('#label=');
        cleanUrl = parts[0];
        try {
          label = decodeURIComponent(parts[1]);
        } catch (e) {
          label = parts[1];
        }
        defaultLabels = defaultLabels.filter(l => l !== label);
      }
      
      result.push({ type: 'existing', url: cleanUrl, fullUrl: url, label });
    }
    
    while (result.length < 11) {
      result.push({ type: 'empty', label: defaultLabels.shift() || `Extra Image ${result.length+1}` });
    }
    
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category_id) {
      toast.error('Title and Collection are required');
      return;
    }

    setIsSubmitting(true);
    // Main Product Images
    const finalImagesArray = [];
    for (const img of productImages) {
      if (!img || img.type === 'empty') {
        finalImagesArray.push('');
      } else if (img.type === 'existing') {
        finalImagesArray.push(`${img.url}#label=${encodeURIComponent(img.label || '')}`);
      } else if (img.type === 'new') {
        try {
          const uploadedUrl = await uploadImage(img.file, 'products', 'public-images');
          finalImagesArray.push(`${uploadedUrl}#label=${encodeURIComponent(img.label || '')}`);
        } catch (err) {
          toast.error('Failed to upload product image');
          console.error(err);
          setIsSubmitting(false);
          return;
        }
      } else {
        finalImagesArray.push('');
      }
    }

    // Spotlight Images
    const finalSpotlightArray = [];
    for (const img of spotlightImages) {
      if (!img || img.type === 'empty') {
        // Only push if there are remaining actual images to avoid trailing empty strings, or just store empty string
        // Actually, it's better to just filter them out for spotlight, or store the exact array length.
        // We will store actual URLs only.
      } else if (img.type === 'existing') {
        finalSpotlightArray.push(img.url);
      } else if (img.type === 'new') {
        try {
          const uploadedUrl = await uploadImage(img.file, 'products/spotlight', 'public-images');
          finalSpotlightArray.push(uploadedUrl);
        } catch (err) {
          toast.error('Failed to upload spotlight image');
          console.error(err);
          setIsSubmitting(false);
          return;
        }
      }
    }

    // Product Video
    let finalVideoUrl = formData.video_url || null;
    if (productVideo && productVideo.type === 'new') {
      try {
        finalVideoUrl = await uploadImage(productVideo.file, 'products/videos', 'public-images');
      } catch (err) {
        toast.error('Failed to upload product video');
        console.error(err);
        setIsSubmitting(false);
        return;
      }
    }

    // Secondary Product Video
    let finalSecondaryVideoUrl = formData.secondary_video_url || null;
    if (secondaryProductVideo && secondaryProductVideo.type === 'new') {
      try {
        finalSecondaryVideoUrl = await uploadImage(secondaryProductVideo.file, 'products/videos', 'public-images');
      } catch (err) {
        toast.error('Failed to upload secondary video');
        console.error(err);
        setIsSubmitting(false);
        return;
      }
    }

    // Banner Product Video
    let finalBannerVideoUrl = formData.marketing_content?.banner_video_url || null;
    if (bannerProductVideo && bannerProductVideo.type === 'new') {
      try {
        finalBannerVideoUrl = await uploadImage(bannerProductVideo.file, 'products/videos', 'public-images');
      } catch (err) {
        toast.error('Failed to upload banner video');
        console.error(err);
        setIsSubmitting(false);
        return;
      }
    }

    // Banner Product Image
    let finalBannerImageUrl = formData.marketing_content?.banner_image_url || null;
    if (bannerProductImage && bannerProductImage.type === 'new') {
      try {
        finalBannerImageUrl = await uploadImage(bannerProductImage.file, 'products/images', 'public-images');
      } catch (err) {
        toast.error('Failed to upload banner image');
        console.error(err);
        setIsSubmitting(false);
        return;
      }
    }


    // Variations Images
    const updatedVariations = [...formData.variations];
    for (let i = 0; i < updatedVariations.length; i++) {
      const vImages = variationImages[i] || [];
      const varFinalUrls = [];
      for (let j = 0; j < 11; j++) {
        const img = vImages[j];
        if (!img || img.type === 'empty') {
          varFinalUrls.push('');
          continue;
        }
        
        if (img.type === 'existing') {
          varFinalUrls.push(`${img.url}#label=${encodeURIComponent(img.label || '')}`);
        } else if (img.type === 'new') {
          try {
            const uploadedUrl = await uploadImage(img.file, `products/variations`, 'public-images');
            varFinalUrls.push(`${uploadedUrl}#label=${encodeURIComponent(img.label || '')}`);
          } catch (err) {
            toast.error('Failed to upload variation image');
            console.error(err);
            setIsSubmitting(false);
            return;
          }
        }
      }
      updatedVariations[i].image_urls = varFinalUrls;

      const sImage = shadeImages[i];
      if (sImage) {
        if (sImage.type === 'existing') {
          updatedVariations[i].shade_image_url = sImage.url;
        } else if (sImage.type === 'new') {
          try {
            const uploadedUrl = await uploadImage(sImage.file, `products/shades`, 'public-images');
            updatedVariations[i].shade_image_url = uploadedUrl;
          } catch (err) {
            toast.error('Failed to upload shade image');
            console.error(err);
            setIsSubmitting(false);
            return;
          }
        }
      } else {
        updatedVariations[i].shade_image_url = null;
      }
    }

    // Combine size_top and size_bottom into size for backward compatibility
    const allSizes = new Set();
    const allHeights = new Set();
    const allSkinTones = new Set();

    updatedVariations.forEach(v => {
      if (v.size_top) {
        const tops = Array.isArray(v.size_top) ? v.size_top : [v.size_top];
        tops.forEach(s => s && s !== 'all' && allSizes.add(s));
      }
      if (v.size_bottom) {
        const bottoms = Array.isArray(v.size_bottom) ? v.size_bottom : [v.size_bottom];
        bottoms.forEach(s => s && s !== 'all' && allSizes.add(s));
      }
      if (v.size) {
         if (Array.isArray(v.size)) v.size.forEach(s => s !== 'all' && allSizes.add(s));
         else if (v.size !== 'all') allSizes.add(v.size);
      }
      if (v.heightRange) {
        const heights = Array.isArray(v.heightRange) ? v.heightRange : [v.heightRange];
        heights.forEach(h => h && h !== 'all' && allHeights.add(h));
      }
      if (v.skinTone && v.skinTone !== 'all') {
        allSkinTones.add(v.skinTone);
      }
    });

    const derivedSizes = Array.from(allSizes);
    const derivedHeights = Array.from(allHeights);
    for (const feature of (formData.craftsmanship_features || [])) {
      let featureImgUrl = feature.img; // keep existing if it's a string
      if (feature.file) {
        try {
          featureImgUrl = await uploadImage(feature.file, 'products/craftsmanship', 'public-images');
        } catch (err) {
          toast.error('Failed to upload craftsmanship image');
          console.error(err);
          setIsSubmitting(false);
          return;
        }
      }
      finalCraftsmanshipFeatures.push({
        title: feature.title,
        desc: feature.desc,
        img: featureImgUrl
      });
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      price: formData.price ? parseFloat(formData.price) : 0,
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      sku: formData.sku,
      quantity: parseInt(formData.quantity, 10),
      category_id: formData.category_id,
      status: formData.status,
      is_featured: formData.is_featured,
      is_new_arrival: formData.is_new_arrival,
      size: derivedSizes.length > 0 ? derivedSizes.join(',') : 'all',
      body_shape: derivedHeights.length > 0 ? derivedHeights.join(',') : 'all', // backward compatibility
      target_genders: formData.target_genders,
      variations: updatedVariations,
      images: finalImagesArray,
      video_url: finalVideoUrl,
      secondary_video_url: finalSecondaryVideoUrl,
      marketing_content: {
        ...formData.marketing_content,
        banner_video_url: finalBannerVideoUrl,
        banner_image_url: finalBannerImageUrl
      }
      // Removed new columns temporarily until they are added to DB:
      // spotlight_images: finalSpotlightArray,
      // craftsmanship_features: finalCraftsmanshipFeatures
    };

    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId);
      if (error) toast.error(error.message);
      else {
        toast.success('Product updated!');
        setShowModal(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from('products').insert([payload]);
      if (error) toast.error(error.message);
      else {
        toast.success('Product created!');
        navigate('/admin/inventory');
        setShowModal(false);
        fetchData();
      }
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Product deleted!');
      fetchData();
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#1A0A08] p-6 lg:p-10 font-sans pb-24">
      {isLoading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A0A08]"></div></div>
      ) : (
      <>
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#FDFBF7] -mx-6 px-6 lg:-mx-10 lg:px-10 -mt-6 pt-6 lg:-mt-10 lg:pt-10 pb-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/inventory')}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#1A0A08]">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
              <p className="text-sm text-gray-500 mt-1">{isEditMode ? formData.title : 'Create a new product listing'}</p>
            </div>
          </div>
          
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-[#1A0A08] text-white px-8 py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase hover:bg-[#3E2312] transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2 w-full md:w-auto justify-center shrink-0"
          >
            {isSubmitting ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
            ) : (
              <><Check size={18} /> Save Changes</>
            )}
          </button>
        </div>


        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col xl:flex-row gap-8 items-start">
            
            {/* LEFT COLUMN: Media (takes more width on XL screens) */}
            <div className="w-full xl:w-[60%] space-y-8">
              {/* Product Media (Images and Videos) */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold font-serif mb-6 border-b border-gray-100 pb-4">Product Media</h3>
                
                {/* Images */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-bold text-[#1A0A08] uppercase tracking-wider">Product Images (Stacking Showcase)</label>
                    <button
                      type="button"
                      onClick={() => setProductImages([...productImages, { type: 'empty' }])}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Image Slot
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {productImages.map((img, index) => (
                      <div key={index} className="relative group rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex flex-col items-center justify-center aspect-[4/5] hover:border-[#986427] transition-all">
                        {img.type === 'empty' ? (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const newImages = [...productImages];
                                  newImages[index] = { type: 'new', file, preview: URL.createObjectURL(file), label: '' };
                                  setProductImages(newImages);
                                }
                              }}
                            />
                            <Plus size={24} className="text-gray-400 mb-2 group-hover:text-[#986427] transition-colors" />
                            <span className="text-[10px] text-gray-400 group-hover:text-[#986427] font-bold text-center px-2 uppercase tracking-wide">
                              {IMAGE_SLOTS[index] || `Image ${index + 1}`}
                            </span>
                          </>
                        ) : (
                          <>
                            <img 
                              src={img.type === 'existing' ? img.url : img.preview} 
                              alt={`Product ${index}`} 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                              <div className="flex justify-end gap-1">
                                <button type="button" onClick={() => handleMoveImage(productImages, setProductImages, index, -1)} className="p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-md text-white transition-colors" disabled={index === 0}><ChevronLeft size={14} /></button>
                                <button type="button" onClick={() => handleMoveImage(productImages, setProductImages, index, 1)} className="p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-md text-white transition-colors" disabled={index === productImages.length - 1}><ChevronRight size={14} /></button>
                                <button type="button" onClick={() => handleClearProductImageSlot(index)} className="p-1.5 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-md text-white transition-colors ml-2"><Trash2 size={14} /></button>
                              </div>
                            </div>
                            <input
                              type="text"
                              placeholder="Label (e.g. Front View)"
                              className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1.5 outline-none border-t border-white/20"
                              value={img.label || ''}
                              onChange={(e) => {
                                const newImages = [...productImages];
                                newImages[index] = { ...newImages[index], label: e.target.value };
                                setProductImages(newImages);
                              }}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Videos & Media */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Banner Media */}
                  <div>
                    <label className="text-xs font-bold text-[#1A0A08] uppercase tracking-wider mb-4 block border-t border-gray-100 pt-6">Banner Media (Top Section)</label>
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-[#986427] hover:bg-[#986427]/5 transition-colors group relative">
                      {(bannerProductVideo && bannerProductVideo.type !== 'empty') || (bannerProductImage && bannerProductImage.type !== 'empty') ? (
                        <div className="relative">
                          {bannerProductVideo && bannerProductVideo.type !== 'empty' ? (
                            bannerProductVideo.type === 'existing' && bannerProductVideo.url.endsWith('.mp4') ? (
                              <video src={bannerProductVideo.url} className="w-full h-32 object-cover rounded-lg mb-2" autoPlay loop muted playsInline />
                            ) : bannerProductVideo.type === 'new' ? (
                              <video src={bannerProductVideo.preview} className="w-full h-32 object-cover rounded-lg mb-2" autoPlay loop muted playsInline />
                            ) : (
                              <div className="w-full h-32 bg-gray-200 rounded-lg flex flex-col items-center justify-center mb-2">
                                <Package size={24} className="text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500 font-bold truncate max-w-full px-2">{bannerProductVideo.url}</span>
                              </div>
                            )
                          ) : bannerProductImage && bannerProductImage.type !== 'empty' ? (
                            bannerProductImage.type === 'existing' ? (
                              <img src={bannerProductImage.url} className="w-full h-32 object-cover rounded-lg mb-2" />
                            ) : bannerProductImage.type === 'new' ? (
                              <img src={bannerProductImage.preview} className="w-full h-32 object-cover rounded-lg mb-2" />
                            ) : null
                          ) : null}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (bannerProductVideo && bannerProductVideo.type === 'new') URL.revokeObjectURL(bannerProductVideo.preview);
                                if (bannerProductImage && bannerProductImage.type === 'new') URL.revokeObjectURL(bannerProductImage.preview);
                                setBannerProductVideo({ type: 'empty' });
                                setBannerProductImage({ type: 'empty' });
                                setFormData(prev => ({ 
                                  ...prev, 
                                  marketing_content: {
                                    ...prev.marketing_content,
                                    banner_video_url: '',
                                    banner_image_url: ''
                                  } 
                                }));
                              }}
                              className="p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 font-bold text-center mt-2 truncate">
                            {bannerProductVideo && bannerProductVideo.type !== 'empty' 
                              ? (bannerProductVideo.type === 'new' ? bannerProductVideo.file.name : 'Existing Video')
                              : (bannerProductImage && bannerProductImage.type === 'new' ? bannerProductImage.file.name : 'Existing Image')}
                          </p>
                        </div>
                      ) : (
                        <div className="py-6 flex flex-col items-center justify-center">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                if (file.type.startsWith('video/')) {
                                  setBannerProductVideo({ type: 'new', file, preview: URL.createObjectURL(file) });
                                  setBannerProductImage({ type: 'empty' });
                                } else {
                                  setBannerProductImage({ type: 'new', file, preview: URL.createObjectURL(file) });
                                  setBannerProductVideo({ type: 'empty' });
                                }
                              }
                            }}
                          />
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus size={20} className="text-gray-400 group-hover:text-[#986427]" />
                          </div>
                          <span className="text-xs font-bold text-gray-500">Upload Banner Media</span>
                          <span className="text-[10px] text-gray-400 mt-1">Image or MP4 Video</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary Video */}
                  <div>
                    <label className="text-xs font-bold text-[#1A0A08] uppercase tracking-wider mb-4 block border-t border-gray-100 pt-6">Primary Video (Hero Section)</label>
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-[#986427] hover:bg-[#986427]/5 transition-colors group relative">
                      {productVideo && productVideo.type !== 'empty' ? (
                        <div className="relative">
                          {productVideo.type === 'existing' && productVideo.url.endsWith('.mp4') ? (
                            <video src={productVideo.url} className="w-full h-32 object-cover rounded-lg mb-2" autoPlay loop muted playsInline />
                          ) : productVideo.type === 'new' ? (
                            <video src={productVideo.preview} className="w-full h-32 object-cover rounded-lg mb-2" autoPlay loop muted playsInline />
                          ) : (
                            <div className="w-full h-32 bg-gray-200 rounded-lg flex flex-col items-center justify-center mb-2">
                              <Package size={24} className="text-gray-400 mb-2" />
                              <span className="text-xs text-gray-500 font-bold truncate max-w-full px-2">{productVideo.url}</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (productVideo.type === 'new') URL.revokeObjectURL(productVideo.preview);
                                setProductVideo({ type: 'empty' });
                                setFormData(prev => ({ ...prev, video_url: '' }));
                              }}
                              className="p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 font-bold text-center mt-2 truncate">{productVideo.type === 'new' ? productVideo.file.name : 'Existing Video'}</p>
                        </div>
                      ) : (
                        <div className="py-6 flex flex-col items-center justify-center">
                          <input
                            type="file"
                            accept="video/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setProductVideo({ type: 'new', file, preview: URL.createObjectURL(file) });
                              }
                            }}
                          />
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus size={20} className="text-gray-400 group-hover:text-[#986427]" />
                          </div>
                          <span className="text-xs font-bold text-gray-500">Upload Hero Video</span>
                          <span className="text-[10px] text-gray-400 mt-1">MP4 format recommended</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Secondary Video */}
                  <div>
                    <label className="text-xs font-bold text-[#1A0A08] uppercase tracking-wider mb-4 block border-t border-gray-100 pt-6">Secondary Video (Showcase Section)</label>
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-[#986427] hover:bg-[#986427]/5 transition-colors group relative">
                      {secondaryProductVideo && secondaryProductVideo.type !== 'empty' ? (
                        <div className="relative">
                          {secondaryProductVideo.type === 'existing' && secondaryProductVideo.url.endsWith('.mp4') ? (
                            <video src={secondaryProductVideo.url} className="w-full h-32 object-cover rounded-lg mb-2" autoPlay loop muted playsInline />
                          ) : secondaryProductVideo.type === 'new' ? (
                            <video src={secondaryProductVideo.preview} className="w-full h-32 object-cover rounded-lg mb-2" autoPlay loop muted playsInline />
                          ) : (
                            <div className="w-full h-32 bg-gray-200 rounded-lg flex flex-col items-center justify-center mb-2">
                              <Package size={24} className="text-gray-400 mb-2" />
                              <span className="text-xs text-gray-500 font-bold truncate max-w-full px-2">{secondaryProductVideo.url}</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (secondaryProductVideo.type === 'new') URL.revokeObjectURL(secondaryProductVideo.preview);
                                setSecondaryProductVideo({ type: 'empty' });
                                setFormData(prev => ({ ...prev, secondary_video_url: '' }));
                              }}
                              className="p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 font-bold text-center mt-2 truncate">{secondaryProductVideo.type === 'new' ? secondaryProductVideo.file.name : 'Existing Video'}</p>
                        </div>
                      ) : (
                        <div className="py-6 flex flex-col items-center justify-center">
                          <input
                            type="file"
                            accept="video/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setSecondaryProductVideo({ type: 'new', file, preview: URL.createObjectURL(file) });
                              }
                            }}
                          />
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus size={20} className="text-gray-400 group-hover:text-[#986427]" />
                          </div>
                          <span className="text-xs font-bold text-gray-500">Upload Secondary Video</span>
                          <span className="text-[10px] text-gray-400 mt-1">MP4 format recommended</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>


            </div>

            {/* RIGHT COLUMN: Sticky Details (takes less width) */}
            <div className="w-full xl:w-[40%] sticky top-8 space-y-8">
              {/* Basic Details */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold font-serif mb-6 border-b border-gray-100 pb-4">Basic Details</h3>
                  <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Title *</label>
                        <input 
                          type="text" 
                          value={formData.title} 
                          onChange={(e) => setFormData({...formData, title: e.target.value})} 
                          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#986427] focus:bg-white transition-colors" 
                          required 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description</label>
                        <textarea 
                          value={formData.description} 
                          onChange={(e) => setFormData({...formData, description: e.target.value})} 
                          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#986427] focus:bg-white transition-colors h-32 resize-none" 
                        />
                      </div>
                  </div>
              </div>
              

            {/* Pricing & Organization Sidebar */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-lg font-bold font-serif mb-6 border-b border-gray-100 pb-4">Organization & Pricing</h3>
                <div className="space-y-5">
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
                     <select 
                       value={formData.status} 
                       onChange={(e) => setFormData({...formData, status: e.target.value})}
                       className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#986427] focus:bg-white"
                     >
                       <option value="active">Active</option>
                       <option value="draft">Draft</option>
                       <option value="archived">Archived</option>
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category *</label>
                     <select 
                       value={formData.category_id} 
                       onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                       className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#986427] focus:bg-white"
                       required
                     >
                       <option value="">Select Category</option>
                       {categories.map(c => (
                         <option key={c.id} value={c.id}>{c.name}</option>
                       ))}
                     </select>
                   </div>
                   
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Target Genders</label>
                     <div className="flex gap-2">
                       {['Women', 'Men'].map(gender => (
                         <button
                           key={gender}
                           type="button"
                           onClick={() => {
                             const current = formData.target_genders || [];
                             if (current.includes(gender)) {
                               setFormData({...formData, target_genders: current.filter(g => g !== gender)});
                             } else {
                               setFormData({...formData, target_genders: [...current, gender]});
                             }
                           }}
                           className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                             (formData.target_genders || []).includes(gender)
                               ? 'bg-[#986427] text-white'
                               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                           }`}
                         >
                           {gender}
                         </button>
                       ))}
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Price *</label>
                       <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                         <input 
                           type="number" 
                           step="0.01"
                           value={formData.price} 
                           onChange={(e) => setFormData({...formData, price: e.target.value})} 
                           className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl pl-8 pr-4 py-3 outline-none focus:border-[#986427] focus:bg-white transition-colors" 
                           required 
                         />
                       </div>
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Compare Price</label>
                       <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                         <input 
                           type="number" 
                           step="0.01"
                           value={formData.compare_at_price} 
                           onChange={(e) => setFormData({...formData, compare_at_price: e.target.value})} 
                           className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl pl-8 pr-4 py-3 outline-none focus:border-[#986427] focus:bg-white transition-colors" 
                         />
                       </div>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">SKU</label>
                       <input 
                         type="text" 
                         value={formData.sku} 
                         onChange={(e) => setFormData({...formData, sku: e.target.value})} 
                         className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#986427] focus:bg-white transition-colors" 
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Quantity</label>
                       <input 
                         type="number" 
                         value={formData.quantity} 
                         onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
                         className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#986427] focus:bg-white transition-colors" 
                       />
                     </div>
                   </div>
                   <div className="flex gap-4 pt-2">
                     <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-200 flex-1 hover:border-[#986427] transition-colors">
                       <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="rounded text-[#986427] focus:ring-[#986427] accent-[#986427] w-4 h-4" />
                       <span className="text-xs font-bold text-gray-700">Featured</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-200 flex-1 hover:border-[#986427] transition-colors">
                       <input type="checkbox" checked={formData.is_new_arrival} onChange={(e) => setFormData({...formData, is_new_arrival: e.target.checked})} className="rounded text-[#986427] focus:ring-[#986427] accent-[#986427] w-4 h-4" />
                       <span className="text-xs font-bold text-gray-700">New Arrival</span>
                     </label>
                   </div>
                    </div>
                  </div>
                </div>
            
          </div>

          {/* BELOW FOLD (Full Width) */}
          <div className="mt-12 space-y-8 max-w-[1400px] mx-auto">
              {/* Product Variations */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-bold font-serif">Product Variations</h3>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, variations: [...(formData.variations || []), { colorName: '', colorHex: '', size: 'all', image_urls: [] }]})}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Variation
                  </button>
                </div>

                <div className="space-y-6">
                  {(formData.variations || []).map((variation, index) => (
                    <div key={index} className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const newVars = [...formData.variations];
                          newVars.splice(index, 1);
                          setFormData({...formData, variations: newVars});
                        }}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1 bg-white rounded-full shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                      
                      <h5 className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-wider">Variation {index + 1}</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Color Name</label>
                          <input 
                            type="text" 
                            value={variation.colorName || ''}
                            onChange={(e) => {
                              const newVars = [...formData.variations];
                              newVars[index].colorName = e.target.value;
                              setFormData({...formData, variations: newVars});
                            }}
                            className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2 outline-none focus:border-[#986427]" 
                            placeholder="e.g. Midnight Blue" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Color Hex / Shade Image</label>
                          <div className="flex gap-2">
                            <input 
                              type="color" 
                              value={variation.colorHex || '#000000'}
                              onChange={(e) => {
                                const newVars = [...formData.variations];
                                newVars[index].colorHex = e.target.value;
                                setFormData({...formData, variations: newVars});
                              }}
                              className="w-10 h-10 p-1 bg-white border border-gray-200 rounded-lg cursor-pointer flex-shrink-0" 
                            />
                            <input 
                              type="text" 
                              value={variation.colorHex || ''}
                              onChange={(e) => {
                                const newVars = [...formData.variations];
                                newVars[index].colorHex = e.target.value;
                                setFormData({...formData, variations: newVars});
                              }}
                              className="flex-1 min-w-0 bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:border-[#986427]" 
                              placeholder="#000000" 
                            />
                            <div className="relative group w-10 h-10 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#986427] transition-colors" title="Upload Custom Shade Image">
                              {shadeImages[index] || variation.shade_image_url ? (
                                <img 
                                  src={shadeImages[index]?.preview || shadeImages[index]?.url || variation.shade_image_url} 
                                  className="w-full h-full object-cover" 
                                  alt="shade" 
                                />
                              ) : (
                                <ImageIcon size={16} className="text-gray-400 group-hover:text-[#986427] transition-colors" />
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Edit2 size={12} className="text-white" />
                              </div>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    setShadeImages(prev => ({
                                      ...prev,
                                      [index]: { type: 'new', file, preview: URL.createObjectURL(file) }
                                    }));
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Size Details</label>
                        <input 
                          type="text" 
                          value={variation.size || ''}
                          onChange={(e) => {
                            const newVars = [...formData.variations];
                            newVars[index].size = e.target.value;
                            setFormData({...formData, variations: newVars});
                          }}
                          className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2 outline-none focus:border-[#986427]" 
                          placeholder="e.g. S, M, L or Custom" 
                        />
                      </div>
                    </div>
                  ))}
                  
                  {(!formData.variations || formData.variations.length === 0) && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No variations added. Product will be sold as a single standard option.
                    </div>
                  )}
                </div>
              </div>


              {/* Cinematic Storytelling Content */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold font-serif mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                    <Edit2 size={18} className="text-[#986427]" />
                    Cinematic Storytelling Content
                  </h3>
                  
                  {/* Hero Section Content Array */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-700">Hero Section (Primary Video)</h4>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            marketing_content: {
                              ...(prev.marketing_content || {}),
                              hero: [...(prev.marketing_content?.hero || []), { subtitle: '', title: '', desc1: '', desc2: '' }]
                            }
                          }));
                        }}
                        className="text-xs text-[#986427] font-bold flex items-center gap-1 hover:underline px-3 py-1.5 bg-[#986427]/10 rounded-lg"
                      >
                        <Plus size={14} /> Add Hero Text Block
                      </button>
                    </div>

                    {(formData.marketing_content?.hero || []).map((heroBlock, index) => (
                      <div key={`hero-${index}`} className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => {
                              const newHeroBlocks = [...(prev.marketing_content?.hero || [])];
                              newHeroBlocks.splice(index, 1);
                              return {
                                ...prev,
                                marketing_content: { ...(prev.marketing_content || {}), hero: newHeroBlocks }
                              };
                            });
                          }}
                          className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1 bg-white rounded-full shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-wider">Hero Text Block {index + 1}</h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Content Subtitle</label>
                            <input 
                              type="text" 
                              value={heroBlock.subtitle || ''}
                              onChange={(e) => {
                                setFormData(prev => {
                                  const newHeroBlocks = [...(prev.marketing_content?.hero || [])];
                                  newHeroBlocks[index].subtitle = e.target.value;
                                  return { ...prev, marketing_content: { ...(prev.marketing_content || {}), hero: newHeroBlocks } };
                                });
                              }}
                              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#986427]" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Content Title</label>
                            <input 
                              type="text" 
                              value={heroBlock.title || ''}
                              onChange={(e) => {
                                setFormData(prev => {
                                  const newHeroBlocks = [...(prev.marketing_content?.hero || [])];
                                  newHeroBlocks[index].title = e.target.value;
                                  return { ...prev, marketing_content: { ...(prev.marketing_content || {}), hero: newHeroBlocks } };
                                });
                              }}
                              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#986427]" 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description 1</label>
                            <textarea 
                              value={heroBlock.desc1 || ''}
                              onChange={(e) => {
                                setFormData(prev => {
                                  const newHeroBlocks = [...(prev.marketing_content?.hero || [])];
                                  newHeroBlocks[index].desc1 = e.target.value;
                                  return { ...prev, marketing_content: { ...(prev.marketing_content || {}), hero: newHeroBlocks } };
                                });
                              }}
                              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#986427] h-20 resize-none" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description 2</label>
                            <textarea 
                              value={heroBlock.desc2 || ''}
                              onChange={(e) => {
                                setFormData(prev => {
                                  const newHeroBlocks = [...(prev.marketing_content?.hero || [])];
                                  newHeroBlocks[index].desc2 = e.target.value;
                                  return { ...prev, marketing_content: { ...(prev.marketing_content || {}), hero: newHeroBlocks } };
                                });
                              }}
                              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#986427] h-20 resize-none" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Secondary Video Showcases */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-bold text-gray-700">Secondary Video Showcase Sections</h4>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            marketing_content: {
                              ...(prev.marketing_content || {}),
                              showcases: [...(prev.marketing_content?.showcases || []), { overlay_subtitle: '', overlay_title: '', content_subtitle: '', content_title: '', desc1: '', desc2: '' }]
                            }
                          }));
                        }}
                        className="text-xs text-[#986427] font-bold flex items-center gap-1 hover:underline px-3 py-1.5 bg-[#986427]/10 rounded-lg"
                      >
                        <Plus size={14} /> Add Showcase Section
                      </button>
                    </div>
                    
                    {(formData.marketing_content?.showcases || []).map((showcase, index) => (
                      <div key={`showcase-${index}`} className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative mt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => {
                              const newShowcases = [...(prev.marketing_content?.showcases || [])];
                              newShowcases.splice(index, 1);
                              return {
                                ...prev,
                                marketing_content: { ...(prev.marketing_content || {}), showcases: newShowcases }
                              };
                            });
                          }}
                          className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1 bg-white rounded-full shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                        
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-wider">Section {index + 1}</h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Overlay Subtitle</label>
                            <input 
                              type="text" 
                              value={showcase.overlay_subtitle || ''}
                              onChange={(e) => {
                                setFormData(prev => {
                                  const newShowcases = [...(prev.marketing_content?.showcases || [])];
                                  newShowcases[index].overlay_subtitle = e.target.value;
                                  return { ...prev, marketing_content: { ...(prev.marketing_content || {}), showcases: newShowcases } };
                                });
                              }}
                              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#986427]" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Overlay Title</label>
                            <input 
                              type="text" 
                              value={showcase.overlay_title || ''}
                              onChange={(e) => {
                                setFormData(prev => {
                                  const newShowcases = [...(prev.marketing_content?.showcases || [])];
                                  newShowcases[index].overlay_title = e.target.value;
                                  return { ...prev, marketing_content: { ...(prev.marketing_content || {}), showcases: newShowcases } };
                                });
                              }}
                              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#986427]" 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Content Subtitle</label>
                            <input 
                              type="text" 
                              value={showcase.content_subtitle || ''}
                              onChange={(e) => {
                                setFormData(prev => {
                                  const newShowcases = [...(prev.marketing_content?.showcases || [])];
                                  newShowcases[index].content_subtitle = e.target.value;
                                  return { ...prev, marketing_content: { ...(prev.marketing_content || {}), showcases: newShowcases } };
                                });
                              }}
                              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#986427]" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Content Title</label>
                            <input 
                              type="text" 
                              value={showcase.content_title || ''}
                              onChange={(e) => {
                                setFormData(prev => {
                                  const newShowcases = [...(prev.marketing_content?.showcases || [])];
                                  newShowcases[index].content_title = e.target.value;
                                  return { ...prev, marketing_content: { ...(prev.marketing_content || {}), showcases: newShowcases } };
                                });
                              }}
                              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#986427]" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description 1</label>
                            <textarea 
                              value={showcase.desc1 || ''}
                              onChange={(e) => {
                                setFormData(prev => {
                                  const newShowcases = [...(prev.marketing_content?.showcases || [])];
                                  newShowcases[index].desc1 = e.target.value;
                                  return { ...prev, marketing_content: { ...(prev.marketing_content || {}), showcases: newShowcases } };
                                });
                              }}
                              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#986427] h-20 resize-none" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description 2</label>
                            <textarea 
                              value={showcase.desc2 || ''}
                              onChange={(e) => {
                                setFormData(prev => {
                                  const newShowcases = [...(prev.marketing_content?.showcases || [])];
                                  newShowcases[index].desc2 = e.target.value;
                                  return { ...prev, marketing_content: { ...(prev.marketing_content || {}), showcases: newShowcases } };
                                });
                              }}
                              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#986427] h-20 resize-none" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

              </div>


          </div>
        </div>
      </>
      )}
    </div>
  );
}