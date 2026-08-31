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

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [spotlightImages, setSpotlightImages] = useState([]);
  const [variationImages, setVariationImages] = useState({});
  const [shadeImages, setShadeImages] = useState({});
  const [availableStyleTags, setAvailableStyleTags] = useState([]);
  const [availableOccasionTags, setAvailableOccasionTags] = useState([]);

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
    occasion_tags: [],
    target_skin_tones: [],
    style_tags: [],
    target_body_shapes: ['Standard Fit'],
    suitability_points: ['', '', ''],
    variations: [],
    craftsmanship_features: []
  };

  const [formData, setFormData] = useState(initialForm);
  const [productVideo, setProductVideo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // No need to validate category_id against body_shape anymore since we use size
  useEffect(() => {
    // Keep this hook empty or remove logic if unnecessary
  }, [formData.size, categories]);

  const fetchData = async () => {
    setIsLoading(true);

    // Fetch Products
    const { data: prodData, error: prodError } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .order('created_at', { ascending: false });

    if (prodError) {
      toast.error('Failed to load products');
    } else {
      // Map DB schema to frontend expected schema
      const mappedProducts = (prodData || []).map(p => ({
        ...p,
        image_url: p.images && Array.isArray(p.images) ? p.images.join(',') : '',
        quantity: p.quantity || 0,
        status: p.status || 'draft',
        is_featured: p.is_featured || false,
        is_new_arrival: p.is_new_arrival || false,
        sku: p.sku || ''
      }));
      setProducts(mappedProducts);

      // Extract unique tags
      const uniqueStyleTags = new Set();
      const uniqueOccasionTags = new Set();
      (prodData || []).forEach(p => {
        if (Array.isArray(p.style_tags)) p.style_tags.forEach(t => uniqueStyleTags.add(t));
        if (Array.isArray(p.occasion_tags)) p.occasion_tags.forEach(t => uniqueOccasionTags.add(t));
      });
      setAvailableStyleTags(Array.from(uniqueStyleTags));
      setAvailableOccasionTags(Array.from(uniqueOccasionTags));
    }

    // Fetch Categories for dropdown
    const { data: catData } = await supabase.from('categories').select('id, name, slug');
    setCategories(catData || []);

    setIsLoading(false);
  };

  const handleCloseModal = () => {
    productImages.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    spotlightImages.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    if (productVideo && productVideo.type === 'new') URL.revokeObjectURL(productVideo.preview);
    Object.values(variationImages).forEach(vArr => {
      vArr.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    });
    setProductVideo(null);
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

  const handleOpenModal = (prod = null) => {
    // Also clean up any lingering URLs if reopening without properly closing
    productImages.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    spotlightImages.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    if (productVideo && productVideo.type === 'new') URL.revokeObjectURL(productVideo.preview);
    Object.values(variationImages).forEach(vArr => {
      vArr.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    });

    setProductImages([]);
    setSpotlightImages([]);
    setVariationImages({});
    setProductVideo(prod?.video_url ? { type: 'existing', url: prod.video_url } : null);
    
    if (prod) {
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
        is_featured: prod.is_featured || false,
        is_new_arrival: prod.is_new_arrival || false,
        size: prod.size || prod.body_shape || 'all',
        target_genders: prod.target_genders || [],
        occasion_tags: prod.occasion_tags || [],
        target_skin_tones: prod.target_skin_tones || [],
        style_tags: prod.style_tags || [],
        target_body_shapes: prod.target_body_shapes?.length ? prod.target_body_shapes : ['Standard Fit'],
        suitability_points: prod.suitability_points || ['', '', ''],
        variations: prod.variations || [],
        craftsmanship_features: prod.craftsmanship_features || []
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }

    // Initialize productImages from existing urls
    let urls = [];
    if (prod && (prod.images || prod.image_url)) {
      if (prod.images && Array.isArray(prod.images)) {
        urls = prod.images;
      } else if (prod.image_url) {
        urls = prod.image_url.split(',');
      }
    }
    setProductImages(initializeImagesWithLabels(urls));

    // Initialize variationImages and shadeImages from existing urls
    if (prod && prod.variations) {
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

    // Initialize spotlightImages
    let sUrls = [];
    if (prod && prod.spotlight_images) {
      sUrls = Array.isArray(prod.spotlight_images) ? prod.spotlight_images : [];
    }
    const initSpotlight = [];
    for (let i = 0; i < 5; i++) {
      if (sUrls[i]) {
        initSpotlight.push({ type: 'existing', url: sUrls[i], label: `Spotlight ${i+1}` });
      } else {
        initSpotlight.push({ type: 'empty', label: `Spotlight ${i+1}` });
      }
    }
    setSpotlightImages(initSpotlight);

    setShowModal(true);
  };

  const handleDuplicateProduct = (prod) => {
    // Also clean up any lingering URLs if reopening without properly closing
    productImages.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    Object.values(variationImages).forEach(vArr => {
      vArr.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    });
    Object.values(shadeImages).forEach(img => { if (img?.type === 'new') URL.revokeObjectURL(img.preview); });

    setProductImages([]);
    setVariationImages({});
    setShadeImages({});
    setEditingId(null); // Explicitly null to create a NEW product
    setFormData({
      title: prod.title + ' (Copy)',
      description: prod.description || '',
      price: prod.price || '',
      compare_at_price: prod.compare_at_price || '',
      sku: (prod.sku || '') + '-COPY',
      quantity: prod.quantity || '0',
      category_id: prod.category_id || '',
      status: 'draft',
      image_url: prod.image_url || '',
      video_url: prod.video_url || '',
      is_featured: prod.is_featured || false,
      is_new_arrival: prod.is_new_arrival || false,
      size: prod.size || prod.body_shape || 'all',
      target_genders: prod.target_genders || [],
      occasion_tags: prod.occasion_tags || [],
      target_skin_tones: prod.target_skin_tones || [],
      style_tags: prod.style_tags || [],
      target_body_shapes: prod.target_body_shapes?.length ? prod.target_body_shapes : ['Standard Fit'],
      suitability_points: prod.suitability_points || ['', '', ''],
      variations: prod.variations || [],
      craftsmanship_features: prod.craftsmanship_features || []
    });

    // Initialize productImages from existing urls
    let urlsDup = [];
    if (prod && (prod.images || prod.image_url)) {
      if (prod.images && Array.isArray(prod.images)) {
        urlsDup = prod.images;
      } else if (prod.image_url) {
        urlsDup = prod.image_url.split(',');
      }
    }
    setProductImages(initializeImagesWithLabels(urlsDup));

    // Initialize variationImages and shadeImages from existing urls
    if (prod && prod.variations) {
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

    setShowModal(true);
  };

  const handleMoveImage = (images, setImages, index, direction) => {
    const newImages = [...images];
    if (direction === -1 && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 1 && index < newImages.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    }
    setImages(newImages);
  };

  const handleRemoveImage = (images, setImages, index) => {
    const newImages = [...images];
    const removed = newImages.splice(index, 1)[0];
    if (removed.type === 'new') URL.revokeObjectURL(removed.preview);
    setImages(newImages);
  };

  const handleClearProductImageSlot = (index) => {
    const newImages = [...productImages];
    const removed = newImages[index];
    if (removed && removed.type === 'new') URL.revokeObjectURL(removed.preview);
    newImages[index] = { type: 'empty' };
    setProductImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category_id) {
      toast.error('Title, Price, and Collection are required');
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
    const derivedSkinTones = Array.from(allSkinTones);
    const derivedHeights = Array.from(allHeights);

    // Craftsmanship Features Uploads
    const finalCraftsmanshipFeatures = [];
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
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      sku: formData.sku,
      quantity: parseInt(formData.quantity, 10),
      category_id: formData.category_id,
      status: formData.status,
      video_url: finalVideoUrl,
      is_featured: formData.is_featured,
      is_new_arrival: formData.is_new_arrival,
      size: derivedSizes.length > 0 ? derivedSizes.join(',') : 'all',
      body_shape: derivedHeights.length > 0 ? derivedHeights.join(',') : 'all', // backward compatibility
      target_genders: formData.target_genders,
      target_body_shapes: formData.target_body_shapes,
      occasion_tags: formData.occasion_tags,
      target_skin_tones: derivedSkinTones,
      style_tags: formData.style_tags,
      suitability_points: formData.suitability_points,
      variations: updatedVariations,
      images: finalImagesArray,
      spotlight_images: finalSpotlightArray,
      craftsmanship_features: finalCraftsmanshipFeatures
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
    <>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-[#1A0A08]">Inventory</h1>
            <p className="text-[#3E2312]/80 mt-1 font-medium">Manage your product catalog</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#986427] hover:bg-[#8B5A2B] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-colors"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#3A10E5] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/40 border-b border-white/60">
                  <th className="px-6 py-4 text-xs font-bold text-[#1A0A08] uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#1A0A08] uppercase tracking-wider">Collection</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#1A0A08] uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#1A0A08] uppercase tracking-wider">Inventory</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#1A0A08] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#1A0A08] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-600 font-medium bg-white/20">
                      No products found. Add your first product!
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                            {prod.image_url ? (
                              <img src={prod.image_url.split(',')[0]} alt={prod.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={20} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{prod.title}</span>
                            <span className="text-xs text-gray-500 font-mono mt-0.5 block">{prod.sku ? `SKU: ${prod.sku}` : 'No SKU'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                          {prod.category?.name || 'No Collection'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">₹{parseFloat(prod.price).toLocaleString()}</span>
                          {prod.compare_at_price && (
                            <span className="text-xs text-gray-400 line-through">₹{parseFloat(prod.compare_at_price).toLocaleString()}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Package size={14} className={prod.quantity > 0 ? "text-emerald-500" : "text-red-500"} />
                          <span className={`text-sm font-bold ${prod.quantity > 0 ? "text-emerald-700" : "text-red-600"}`}>
                            {prod.quantity} in stock
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${prod.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                          {prod.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(prod)}
                            className="p-2 text-gray-400 hover:text-[#3A10E5] hover:bg-purple-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(prod)}
                            className="p-2 text-gray-400 hover:text-[#3A10E5] hover:bg-purple-50 rounded-lg transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#f5ece3] rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 shadow-2xl">
            <div className="shrink-0 flex items-center justify-between p-5 border-b border-gray-200 bg-[#f5ece3] z-10">
              <h2 className="text-xl font-bold font-serif text-[#1A0A08]">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={handleCloseModal} className="p-2 text-[#1A0A08]/60 hover:bg-white/40 hover:text-[#1A0A08] rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar text-[#1A0A08]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Left Column (Main Info) */}
                <div className="md:col-span-2 space-y-4">
                  {/* Basic Details */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Basic Details</h3>
                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Product Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#3A10E5] outline-none font-medium text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#3A10E5] outline-none text-sm text-gray-900 min-h-[60px]"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Why It Suits You (3 Points)</label>
                      <div className="space-y-2">
                        {[0, 1, 2].map(idx => (
                          <input
                            key={idx}
                            type="text"
                            placeholder={`e.g. Flattering for your Hourglass body shape`}
                            value={formData.suitability_points[idx] || ''}
                            onChange={(e) => {
                              const newPoints = [...formData.suitability_points];
                              newPoints[idx] = e.target.value;
                              setFormData({ ...formData, suitability_points: newPoints });
                            }}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#3A10E5] outline-none text-sm text-gray-900"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Pricing</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Price (₹) *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign size={14} className="text-gray-600" />
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#3A10E5] outline-none font-medium text-gray-900"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Compare at Price (₹)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign size={14} className="text-gray-600" />
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.compare_at_price}
                            onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#3A10E5] outline-none font-medium text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inventory */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Inventory</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">SKU</label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#3A10E5] outline-none font-mono text-sm text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Quantity</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.quantity === 0 ? 0 : formData.quantity || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({ ...formData, quantity: val === '' ? '' : parseInt(val, 10) });
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#3A10E5] outline-none font-medium text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (Organization & Media) */}
                <div className="space-y-4">
                  {/* Status & Organization */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Organization</h3>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#3A10E5] outline-none font-medium text-gray-900"
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    

                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Target Genders</label>
                      <div className="flex gap-3">
                        {['Women', 'Men'].map(gender => {
                          const value = gender === 'Women' ? 'Female' : 'Male';
                          const isSelected = formData.target_genders.includes(value);
                          return (
                            <button
                              key={gender}
                              type="button"
                              onClick={() => {
                                const current = [...formData.target_genders];
                                if (isSelected) {
                                  setFormData({ ...formData, target_genders: current.filter(g => g !== value) });
                                } else {
                                  setFormData({ ...formData, target_genders: [...current, value] });
                                }
                              }}
                              className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-colors ${isSelected ? 'bg-[#986427] text-white border-[#986427]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#986427]/50'}`}
                            >
                              {gender}
                            </button>
                          );
                        })}
                      </div>
                    </div>


                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Category *</label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:bg-white focus:border-[#986427] outline-none font-medium text-[#1A0A08]"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                      </select>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-white hover:border-[#3A10E5] transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                          className="w-4 h-4 text-[#3A10E5] rounded border-gray-300 focus:ring-[#3A10E5]"
                        />
                        <span className="text-sm font-bold text-gray-700">Featured Product</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-white hover:border-[#3A10E5] transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.is_new_arrival}
                          onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                          className="w-4 h-4 text-[#3A10E5] rounded border-gray-300 focus:ring-[#3A10E5]"
                        />
                        <span className="text-sm font-bold text-gray-800">New Arrival</span>
                      </label>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-[#1A0A08] border-b border-gray-100 pb-2 mb-4">Product Media (Video & Images)</h3>
                    
                    {/* Video Upload Section */}
                    <div className="mb-6">
                      <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-2">Cinematic Video (Optional MP4)</label>
                      <div className="flex items-center gap-4">
                        {productVideo ? (
                          <div className="relative w-32 h-32 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                            {productVideo.type === 'new' ? (
                              <video src={productVideo.preview} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                            ) : (
                              <video src={productVideo.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                            )}
                            <div className="absolute top-1.5 right-1.5">
                              <button type="button" onClick={() => {
                                if (productVideo.type === 'new') URL.revokeObjectURL(productVideo.preview);
                                setProductVideo(null);
                                setFormData({ ...formData, video_url: null });
                              }} className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md">
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                            <Plus size={20} className="text-gray-400 mb-1" />
                            <span className="text-[9px] font-bold text-gray-500 uppercase">Upload MP4</span>
                            <input
                              type="file"
                              accept="video/mp4,video/quicktime"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  setProductVideo({ type: 'new', file, preview: URL.createObjectURL(file) });
                                  e.target.value = '';
                                }
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">Upload a short looping video of the product to show on the new cinematic details page. Format: MP4.</p>
                        </div>
                      </div>
                    </div>

                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-2 pt-4 border-t border-gray-100">Product Images (11 Slots)</label>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                      {productImages.map((img, idx) => {
                        if (!img) return null;
                        const slotName = img.label || IMAGE_SLOTS[idx] || `Image ${idx + 1}`;
                        const hasImage = img.type !== 'empty';
                        
                        return (
                          <div 
                            key={idx} 
                            className="flex flex-col gap-1.5 group"
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDrop={(e) => handleDrop(e, idx)}
                            onDragOver={handleDragOver}
                          >
                            <label className="text-[10px] font-bold text-[#1A0A08]/80 uppercase tracking-wider h-6 line-clamp-2 cursor-grab active:cursor-grabbing flex items-center justify-between">
                              {slotName}
                              <div className="text-gray-300 group-hover:text-[#986427]" title="Drag to reorder">
                                <span className="text-[8px] leading-none">⣿</span>
                              </div>
                            </label>
                            
                            {hasImage ? (
                              <div className="relative w-full aspect-[3/4] rounded-xl bg-gray-50 overflow-hidden border border-gray-200 shadow-sm group-hover:border-[#986427] transition-colors cursor-grab active:cursor-grabbing">
                                <img src={img.type === 'new' ? img.preview : img.url} alt={slotName} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                <div className="absolute top-2 right-2">
                                  <button type="button" onClick={() => {
                                      const newImages = [...productImages];
                                      if (newImages[idx].type === 'new') URL.revokeObjectURL(newImages[idx].preview);
                                      newImages[idx] = { type: 'empty', label: slotName };
                                      setProductImages(newImages);
                                    }} className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10" title="Remove image">
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="w-full aspect-[3/4] rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 hover:border-[#986427] hover:bg-[#986427]/5 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-[#986427]">
                                <Plus size={24} className="mb-2" />
                                <span className="text-[10px] font-bold text-center px-2">Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      const newImages = [...productImages];
                                      newImages[idx] = { type: 'new', file, preview: URL.createObjectURL(file), label: slotName };
                                      setProductImages(newImages);
                                      e.target.value = '';
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Spotlight Stacking Images */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-[#1A0A08] border-b border-gray-100 pb-2 mb-4">Spotlight Stacking Images (5 Slots)</h3>
                    <p className="text-[10px] text-gray-500 mb-2">Upload up to 5 images here for the animated stacked lookbook effect on the Explore page.</p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                      {spotlightImages.map((img, idx) => {
                        if (!img) return null;
                        const slotName = img.label || `Spotlight ${idx + 1}`;
                        const hasImage = img.type !== 'empty';
                        
                        return (
                          <div 
                            key={`spotlight-${idx}`} 
                            className="flex flex-col gap-1.5 group"
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx, false, null, true)}
                            onDrop={(e) => handleDrop(e, idx, false, null, true)}
                            onDragOver={handleDragOver}
                          >
                            <label className="text-[10px] font-bold text-[#1A0A08]/80 uppercase tracking-wider h-6 line-clamp-2 cursor-grab active:cursor-grabbing flex items-center justify-between">
                              {slotName}
                              <div className="text-gray-300 group-hover:text-[#986427]" title="Drag to reorder">
                                <span className="text-[8px] leading-none">⣿</span>
                              </div>
                            </label>
                            
                            {hasImage ? (
                              <div className="relative w-full aspect-[3/4] rounded-xl bg-gray-50 overflow-hidden border border-gray-200 shadow-sm group-hover:border-[#986427] transition-colors cursor-grab active:cursor-grabbing">
                                <img src={img.type === 'new' ? img.preview : img.url} alt={slotName} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                <div className="absolute top-2 right-2">
                                  <button type="button" onClick={() => {
                                      const newImages = [...spotlightImages];
                                      if (newImages[idx].type === 'new') URL.revokeObjectURL(newImages[idx].preview);
                                      newImages[idx] = { type: 'empty', label: slotName };
                                      setSpotlightImages(newImages);
                                    }} className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10" title="Remove image">
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="w-full aspect-[3/4] rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 hover:border-[#986427] hover:bg-[#986427]/5 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-[#986427]">
                                <Plus size={24} className="mb-2" />
                                <span className="text-[10px] font-bold text-center px-2">Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      const newImages = [...spotlightImages];
                                      newImages[idx] = { type: 'new', file, preview: URL.createObjectURL(file), label: slotName };
                                      setSpotlightImages(newImages);
                                      e.target.value = '';
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Craftsmanship Features Manager */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#1A0A08]">Craftsmanship Features</h3>
                      <p className="text-[10px] text-gray-500 mt-1">Add features for the scrolling "Art of Craftsmanship" section. Leave empty to use defaults.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          craftsmanship_features: [...(prev.craftsmanship_features || []), { title: '', desc: '', img: '' }]
                        }));
                      }}
                      className="text-xs font-bold bg-[#986427]/10 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#986427]/20 text-[#986427] transition-colors"
                    >
                      <Plus size={14} /> Add Feature
                    </button>
                  </div>

                  {(!formData.craftsmanship_features || formData.craftsmanship_features.length === 0) ? (
                    <div className="text-sm text-gray-500 text-center py-4 italic">No custom features added. Default ones will be shown.</div>
                  ) : (
                    <div className="space-y-4">
                      {formData.craftsmanship_features.map((feature, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col lg:flex-row gap-4 relative group">
                          <button
                            type="button"
                            onClick={() => {
                              const newFeatures = [...formData.craftsmanship_features];
                              const removed = newFeatures.splice(index, 1)[0];
                              if (removed.file) URL.revokeObjectURL(removed.preview);
                              setFormData({ ...formData, craftsmanship_features: newFeatures });
                            }}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                          
                          <div className="flex-1 space-y-3">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Title</label>
                              <input
                                type="text"
                                placeholder="e.g. The Fabric"
                                value={feature.title}
                                onChange={(e) => {
                                  const newFeatures = [...formData.craftsmanship_features];
                                  newFeatures[index].title = e.target.value;
                                  setFormData({ ...formData, craftsmanship_features: newFeatures });
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                              <textarea
                                placeholder="Details about this feature..."
                                value={feature.desc}
                                onChange={(e) => {
                                  const newFeatures = [...formData.craftsmanship_features];
                                  newFeatures[index].desc = e.target.value;
                                  setFormData({ ...formData, craftsmanship_features: newFeatures });
                                }}
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs"
                              />
                            </div>
                          </div>
                          
                          <div className="w-full lg:w-32 flex flex-col gap-2 shrink-0">
                            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Image</label>
                            {(feature.preview || feature.img) ? (
                              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 group-hover:border-[#986427] transition-colors">
                                <img src={feature.preview || feature.img} alt={feature.title} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newFeatures = [...formData.craftsmanship_features];
                                    if (newFeatures[index].file) URL.revokeObjectURL(newFeatures[index].preview);
                                    newFeatures[index].file = null;
                                    newFeatures[index].preview = null;
                                    newFeatures[index].img = '';
                                    setFormData({ ...formData, craftsmanship_features: newFeatures });
                                  }}
                                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ) : (
                              <label className="w-full aspect-[3/4] rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 hover:border-[#986427] flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-[#986427]">
                                <Plus size={20} className="mb-1" />
                                <span className="text-[10px] font-bold text-center px-1">Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      const newFeatures = [...formData.craftsmanship_features];
                                      newFeatures[index].file = file;
                                      newFeatures[index].preview = URL.createObjectURL(file);
                                      setFormData({ ...formData, craftsmanship_features: newFeatures });
                                      e.target.value = '';
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Variations Manager */}
              <div className="mt-6 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-[#1A0A08]">Product Variations</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        variations: [...prev.variations, { id: Date.now(), size_top: ['S'], size_bottom: ['S'], skinTone: 'all', heightRange: ['all'], colorName: '', image_urls: [] }]
                      }));
                      setVariationImages(prev => ({
                        ...prev,
                        [formData.variations.length]: Array(11).fill(null).map(() => ({ type: 'empty' }))
                      }));
                    }}
                    className="text-xs font-bold bg-[#986427]/10 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#986427]/20 text-[#986427] transition-colors"
                  >
                    <Plus size={14} /> Add Variation
                  </button>
                </div>

                {formData.variations.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4 italic">No variations added. Add one to target specific skin tones and heights.</div>
                ) : (
                  <div className="space-y-4 pr-2">
                    {formData.variations.map((v, index) => (
                      <div key={v.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                        <div className="flex gap-4 w-full">
                          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                            <div>
                              <label className="block text-[10px] font-bold text-[#1A0A08]/80 uppercase tracking-wider mb-2">Size (Top)</label>
                              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                {sizesMap.map((type) => {
                                  const currentSizes = Array.isArray(v.size_top) ? v.size_top : (v.size_top ? [v.size_top] : ['S']);
                                  const isSelected = currentSizes.includes(type.id);
                                  return (
                                    <button
                                      key={type.id}
                                      type="button"
                                      onClick={() => {
                                        const newVars = [...formData.variations];
                                        if (type.id === 'all') {
                                          newVars[index].size_top = ['all'];
                                        } else {
                                          let updated = currentSizes.filter(s => s !== 'all');
                                          if (isSelected) {
                                            updated = updated.filter(s => s !== type.id);
                                            if (updated.length === 0) updated = ['all'];
                                          } else {
                                            updated = [...updated, type.id];
                                          }
                                          newVars[index].size_top = updated;
                                        }
                                        setFormData({ ...formData, variations: newVars });
                                      }}
                                      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border transition-all min-w-[50px] h-10 shrink-0 ${isSelected ? 'border-[#986427] ring-1 ring-[#986427] bg-[#986427]/10' : 'border-gray-200 bg-white hover:border-[#986427]/50'}`}
                                    >
                                      <span className={`text-[10px] font-bold tracking-wide uppercase ${isSelected ? 'text-[#986427]' : 'text-[#1A0A08]'}`}>{type.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-[10px] font-bold text-[#1A0A08]/80 uppercase tracking-wider mb-2">Size (Bottom)</label>
                              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                {sizesMap.map((type) => {
                                  const currentSizes = Array.isArray(v.size_bottom) ? v.size_bottom : (v.size_bottom ? [v.size_bottom] : ['S']);
                                  const isSelected = currentSizes.includes(type.id);
                                  return (
                                    <button
                                      key={type.id}
                                      type="button"
                                      onClick={() => {
                                        const newVars = [...formData.variations];
                                        if (type.id === 'all') {
                                          newVars[index].size_bottom = ['all'];
                                        } else {
                                          let updated = currentSizes.filter(s => s !== 'all');
                                          if (isSelected) {
                                            updated = updated.filter(s => s !== type.id);
                                            if (updated.length === 0) updated = ['all'];
                                          } else {
                                            updated = [...updated, type.id];
                                          }
                                          newVars[index].size_bottom = updated;
                                        }
                                        setFormData({ ...formData, variations: newVars });
                                      }}
                                      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border transition-all min-w-[50px] h-10 shrink-0 ${isSelected ? 'border-[#986427] ring-1 ring-[#986427] bg-[#986427]/10' : 'border-gray-200 bg-white hover:border-[#986427]/50'}`}
                                    >
                                      <span className={`text-[10px] font-bold tracking-wide uppercase ${isSelected ? 'text-[#986427]' : 'text-[#1A0A08]'}`}>{type.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div>
                              <label className="flex items-center gap-2 block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Skin Tone <Lock size={10} className="text-gray-400" /> <span className="normal-case text-[9px] text-gray-400 font-normal">(Locked for now)</span>
                              </label>
                              <div className="flex gap-2 flex-wrap pb-1 opacity-40 pointer-events-none">
                                {skinTonesMap.map((tone) => (
                                  <button
                                    key={tone.id}
                                    title={tone.id}
                                    type="button"
                                    onClick={() => {
                                      const newVars = [...formData.variations];
                                      newVars[index].skinTone = tone.id;
                                      setFormData({ ...formData, variations: newVars });
                                    }}
                                    className={`w-10 h-10 rounded-full border-2 transition-all shrink-0 flex items-center justify-center ${(v.skinTone || 'all') === tone.id ? 'border-[#3A10E5] scale-110 shadow-sm' : 'border-gray-200 hover:scale-105 shadow-sm'}`}
                                    style={{ background: tone.color }}
                                  >
                                    {tone.id === 'all' && <span className="text-[10px] font-bold text-white drop-shadow-md">ALL</span>}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                            <div>
                              <label className="flex items-center gap-2 block text-[10px] font-bold text-[#1A0A08]/80 uppercase tracking-wider mb-2">
                                Height Range <Lock size={10} className="text-gray-400" /> <span className="normal-case text-[9px] text-gray-400 font-normal">(Locked for now)</span>
                              </label>
                              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar opacity-40 pointer-events-none">
                                {heightsMap.map(h => {
                                  const currentHeights = Array.isArray(v.heightRange) ? v.heightRange : (v.heightRange ? [v.heightRange] : ['all']);
                                  const isSelected = currentHeights.includes(h.id);
                                  return (
                                    <button
                                      key={h.id}
                                      type="button"
                                      onClick={() => {
                                        const newVars = [...formData.variations];
                                        if (h.id === 'all') {
                                          newVars[index].heightRange = ['all'];
                                        } else {
                                          let updated = currentHeights.filter(s => s !== 'all');
                                          if (isSelected) {
                                            updated = updated.filter(s => s !== h.id);
                                            if (updated.length === 0) updated = ['all'];
                                          } else {
                                            updated = [...updated, h.id];
                                          }
                                          newVars[index].heightRange = updated;
                                        }
                                        setFormData({ ...formData, variations: newVars });
                                      }}
                                      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border transition-all px-3 h-12 shrink-0 ${isSelected ? 'border-[#986427] ring-1 ring-[#986427] bg-[#986427]/10' : 'border-gray-200 bg-white hover:border-[#986427]/50'}`}
                                    >
                                      <span className={`text-[10px] font-bold tracking-wide uppercase whitespace-nowrap ${isSelected ? 'text-[#986427]' : 'text-[#1A0A08]'}`}>{h.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 col-span-2 lg:col-span-3">
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Color Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Lavender"
                                value={v.colorName}
                                onChange={(e) => {
                                  const newVars = [...formData.variations];
                                  newVars[index].colorName = e.target.value;
                                  setFormData({ ...formData, variations: newVars });
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-[11px]"
                              />
                            </div>
                            <div className="shrink-0 w-40 flex gap-2 items-end">
                              <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Shade Image</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                      const file = e.target.files[0];
                                      setShadeImages(prev => ({
                                        ...prev,
                                        [index]: { type: 'new', file, preview: URL.createObjectURL(file) }
                                      }));
                                      e.target.value = '';
                                    }
                                  }}
                                  className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#1A0A08] file:text-white"
                                />
                              </div>
                              {shadeImages[index] && (
                                <div className="relative group shrink-0 w-8 h-8 rounded-full border border-gray-200 overflow-hidden mb-1 bg-white">
                                  <img src={shadeImages[index].type === 'new' ? shadeImages[index].preview : shadeImages[index].url} alt="shade" className="w-full h-full object-cover" />
                                  <button type="button" onClick={() => {
                                    if (shadeImages[index].type === 'new') URL.revokeObjectURL(shadeImages[index].preview);
                                    setShadeImages(prev => {
                                      const copy = {...prev};
                                      delete copy[index];
                                      return copy;
                                    });
                                  }} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><X size={10} /></button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="w-16 shrink-0 flex flex-col items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (variationImages[index]) {
                                variationImages[index].forEach(img => {
                                  if (img.type === 'new') URL.revokeObjectURL(img.preview);
                                });
                              }
                              const newVars = formData.variations.filter((_, i) => i !== index);
                              setFormData({ ...formData, variations: newVars });
                            }}
                            className="w-full py-2 bg-red-50 text-red-500 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-colors border border-red-100 mt-5"
                          >
                            Remove
                          </button>
                        </div>
                        </div>

                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <label className="block text-[10px] font-bold text-[#1A0A08]/80 uppercase tracking-wider mb-3">Variation Specific Images (Overrides Main Images)</label>
                          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                            {(variationImages[index] || Array(11).fill(null).map((_, i) => ({ type: 'empty', label: IMAGE_SLOTS[i] || `Image ${i+1}` }))).map((img, slotIdx) => {
                              if (!img) return null;
                              const slotName = img.label || IMAGE_SLOTS[slotIdx] || `Image ${slotIdx + 1}`;
                              const hasImage = img.type !== 'empty';
                              
                              return (
                                <div 
                                  key={slotIdx} 
                                  className="flex flex-col gap-1 group"
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, slotIdx, true, index)}
                                  onDrop={(e) => handleDrop(e, slotIdx, true, index)}
                                  onDragOver={handleDragOver}
                                >
                                  <label className="text-[9px] font-bold text-[#1A0A08]/60 uppercase tracking-wider h-6 line-clamp-2 cursor-grab active:cursor-grabbing flex items-center justify-between">
                                    {slotName}
                                    <div className="text-gray-300 group-hover:text-[#986427]" title="Drag to reorder">
                                      <span className="text-[8px] leading-none">⣿</span>
                                    </div>
                                  </label>
                                  
                                  {hasImage ? (
                                    <div className="relative w-full aspect-[3/4] rounded-lg bg-white overflow-hidden border border-gray-200 shadow-sm group-hover:border-[#986427] transition-colors cursor-grab active:cursor-grabbing">
                                      <img src={img.type === 'new' ? img.preview : img.url} alt={slotName} className="w-full h-full object-cover" />
                                      <div className="absolute top-1.5 right-1.5">
                                        <button type="button" onClick={() => {
                                          const newImages = [...(variationImages[index] || [])];
                                          if (newImages[slotIdx].type === 'new') URL.revokeObjectURL(newImages[slotIdx].preview);
                                          newImages[slotIdx] = { type: 'empty', label: slotName };
                                          setVariationImages(prev => ({ ...prev, [index]: newImages }));
                                        }} className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10" title="Remove image">
                                          <X size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <label className="w-full aspect-[3/4] rounded-lg bg-white border border-dashed border-gray-300 hover:border-[#986427] hover:bg-[#986427]/5 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-[#986427]">
                                      <Plus size={16} className="mb-1" />
                                      <span className="text-[9px] font-bold text-center px-1">Upload</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            const newImages = (variationImages[index] || []).length === 11 
                                              ? [...variationImages[index]] 
                                              : Array(11).fill(null).map((_, i) => ({ type: 'empty', label: IMAGE_SLOTS[i] || `Image ${i+1}` }));
                                            newImages[slotIdx] = { type: 'new', file, preview: URL.createObjectURL(file), label: slotName };
                                            setVariationImages(prev => ({ ...prev, [index]: newImages }));
                                            e.target.value = '';
                                          }
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Craftsmanship Features */}
              <div className="mt-8 pt-6 border-t border-[#F5F0E8]/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#1A0A08]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Art of Craftsmanship Features</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        craftsmanship_features: [...(formData.craftsmanship_features || []), { title: '', desc: '', img: '' }]
                      });
                    }}
                    className="px-3 py-1.5 bg-[#986427] text-white rounded-lg text-xs font-bold hover:bg-[#86561f] transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Feature
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(formData.craftsmanship_features || []).map((feature, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex gap-4">
                      {/* Image Upload Column */}
                      <div className="w-32 shrink-0">
                        <label className="block text-[10px] font-bold text-[#1A0A08]/80 uppercase tracking-wider mb-2">Background Image</label>
                        {feature.file || feature.img ? (
                          <div className="relative w-full aspect-[4/5] rounded-lg bg-white overflow-hidden border border-gray-200 shadow-sm">
                            <img 
                              src={feature.file ? URL.createObjectURL(feature.file) : feature.img} 
                              alt="Feature preview" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute top-1 right-1">
                              <button 
                                type="button" 
                                onClick={() => {
                                  const newFeatures = [...formData.craftsmanship_features];
                                  newFeatures[index].file = null;
                                  newFeatures[index].img = '';
                                  setFormData({ ...formData, craftsmanship_features: newFeatures });
                                }} 
                                className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="w-full aspect-[4/5] rounded-lg bg-white border border-dashed border-gray-300 hover:border-[#986427] hover:bg-[#986427]/5 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-[#986427]">
                            <Plus size={16} className="mb-1" />
                            <span className="text-[9px] font-bold text-center px-1">Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const newFeatures = [...formData.craftsmanship_features];
                                  newFeatures[index].file = file;
                                  setFormData({ ...formData, craftsmanship_features: newFeatures });
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                      
                      {/* Text Fields Column */}
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-[#1A0A08]/80 uppercase tracking-wider mb-2">Title</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => {
                                const newFeatures = [...formData.craftsmanship_features];
                                newFeatures[index].title = e.target.value;
                                setFormData({ ...formData, craftsmanship_features: newFeatures });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:border-[#986427] focus:ring-1 focus:ring-[#986427] outline-none"
                              placeholder="e.g. The Fabric"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newFeatures = formData.craftsmanship_features.filter((_, i) => i !== index);
                              setFormData({ ...formData, craftsmanship_features: newFeatures });
                            }}
                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-6"
                            title="Remove feature"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-[#1A0A08]/80 uppercase tracking-wider mb-2">Description</label>
                          <textarea
                            value={feature.desc}
                            onChange={(e) => {
                              const newFeatures = [...formData.craftsmanship_features];
                              newFeatures[index].desc = e.target.value;
                              setFormData({ ...formData, craftsmanship_features: newFeatures });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:border-[#986427] focus:ring-1 focus:ring-[#986427] outline-none h-24 resize-none"
                            placeholder="Enter detailed description of this feature..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!formData.craftsmanship_features || formData.craftsmanship_features.length === 0) && (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm">
                      No craftsmanship features added. Click "Add Feature" to create one.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl font-bold text-[#1A0A08] bg-white hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#986427] hover:bg-[#8B5A2B] px-8 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-70 flex items-center gap-2 shadow-lg transition-colors"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Check size={18} />
                  )}
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
