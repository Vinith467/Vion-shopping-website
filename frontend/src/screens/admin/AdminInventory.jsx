import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { uploadImage } from '../../services/storageService';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, X, Check, Image as ImageIcon, Package, DollarSign, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
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
  { id: 'S', name: 'S' },
  { id: 'M', name: 'M' },
  { id: 'L', name: 'L' },
  { id: 'XL', name: 'XL' },
  { id: 'XXL', name: 'XXL' }
];

const heightsMap = [
  { id: 'all', name: 'All Heights' },
  { id: 'Below 5\'0"', name: 'Below 5\'0"' },
  { id: '5\'0" - 5\'3"', name: '5\'0" - 5\'3"' },
  { id: '5\'4" - 5\'7"', name: '5\'4" - 5\'7"' },
  { id: '5\'8" - 6\'0"', name: '5\'8" - 6\'0"' },
  { id: 'Above 6\'0"', name: 'Above 6\'0"' }
];

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productImages, setProductImages] = useState([]);
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
    quantity: '0',
    category_id: '',
    status: 'draft',
    image_url: '',
    is_featured: false,
    is_new_arrival: false,
    size: 'all',
    target_genders: [],
    occasion_tags: [],
    target_skin_tones: [],
    style_tags: [],
    target_body_shapes: ['Casual'],
    variations: []
  };

  const [formData, setFormData] = useState(initialForm);

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
    Object.values(variationImages).forEach(vArr => {
      vArr.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    });
    setShowModal(false);
  };

  const handleOpenModal = (prod = null) => {
    // Also clean up any lingering URLs if reopening without properly closing
    productImages.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    Object.values(variationImages).forEach(vArr => {
      vArr.forEach(img => { if (img.type === 'new') URL.revokeObjectURL(img.preview); });
    });

    setProductImages([]);
    setVariationImages({});
    if (prod) {
      setEditingId(prod.id);
      setFormData({
        title: prod.title,
        description: prod.description || '',
        price: prod.price || '',
        compare_at_price: prod.compare_at_price || '',
        sku: prod.sku || '',
        quantity: prod.quantity || '0',
        category_id: prod.category_id || '',
        status: prod.status || 'draft',
        image_url: prod.image_url || '',
        is_featured: prod.is_featured || false,
        is_new_arrival: prod.is_new_arrival || false,
        size: prod.size || prod.body_shape || 'all',
        target_genders: prod.target_genders || [],
        occasion_tags: prod.occasion_tags || [],
        target_skin_tones: prod.target_skin_tones || [],
        style_tags: prod.style_tags || [],
        target_body_shapes: prod.target_body_shapes?.length ? prod.target_body_shapes : ['Casual'],
        variations: prod.variations || []
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }

    // Initialize productImages from existing urls
    if (prod && prod.image_url) {
      const urls = prod.image_url.split(',').filter(Boolean);
      setProductImages(urls.map(url => ({ type: 'existing', url })));
    }

    // Initialize variationImages and shadeImages from existing urls
    if (prod && prod.variations) {
      const vImages = {};
      const sImages = {};
      prod.variations.forEach((v, idx) => {
        if (v.image_urls && v.image_urls.length > 0) {
          vImages[idx] = v.image_urls.map(url => ({ type: 'existing', url }));
        }
        if (v.shade_image_url) {
          sImages[idx] = { type: 'existing', url: v.shade_image_url };
        }
      });
      setVariationImages(vImages);
      setShadeImages(sImages);
    }

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
      is_featured: prod.is_featured || false,
      is_new_arrival: prod.is_new_arrival || false,
      size: prod.size || prod.body_shape || 'all',
      target_genders: prod.target_genders || [],
      occasion_tags: prod.occasion_tags || [],
      target_skin_tones: prod.target_skin_tones || [],
      style_tags: prod.style_tags || [],
      target_body_shapes: prod.target_body_shapes?.length ? prod.target_body_shapes : ['Casual'],
      variations: prod.variations || []
    });

    // Initialize productImages from existing urls
    if (prod && prod.image_url) {
      const urls = prod.image_url.split(',').filter(Boolean);
      setProductImages(urls.map(url => ({ type: 'existing', url })));
    }

    // Initialize variationImages and shadeImages from existing urls
    if (prod && prod.variations) {
      const vImages = {};
      const sImages = {};
      prod.variations.forEach((v, idx) => {
        if (v.image_urls && v.image_urls.length > 0) {
          vImages[idx] = v.image_urls.map(url => ({ type: 'existing', url }));
        }
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
      if (img.type === 'existing') {
        finalImagesArray.push(img.url);
      } else if (img.type === 'new') {
        try {
          const uploadedUrl = await uploadImage(img.file, 'products', 'public-images');
          finalImagesArray.push(uploadedUrl);
        } catch (err) {
          toast.error('Failed to upload product image');
          console.error(err);
          setIsSubmitting(false);
          return;
        }
      }
    }

    // Variations Images
    const updatedVariations = [...formData.variations];
    for (let i = 0; i < updatedVariations.length; i++) {
      const vImages = variationImages[i] || [];
      const varFinalUrls = [];
      for (const img of vImages) {
        if (img.type === 'existing') {
          varFinalUrls.push(img.url);
        } else if (img.type === 'new') {
          try {
            const uploadedUrl = await uploadImage(img.file, `products/variations`, 'public-images');
            varFinalUrls.push(uploadedUrl);
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
    updatedVariations.forEach(v => {
      if (v.size_top) v.size_top.forEach(s => s !== 'all' && allSizes.add(s));
      if (v.size_bottom) v.size_bottom.forEach(s => s !== 'all' && allSizes.add(s));
      // fallback for old variations
      if (v.size) {
         if (Array.isArray(v.size)) v.size.forEach(s => s !== 'all' && allSizes.add(s));
         else if (v.size !== 'all') allSizes.add(v.size);
      }
    });
    const derivedSizes = Array.from(allSizes);
    const derivedSkinTones = Array.from(new Set(updatedVariations.map(v => v.skinTone).filter(s => s && s !== 'all')));
    const derivedHeights = Array.from(new Set(updatedVariations.map(v => v.heightRange).filter(h => h && h !== 'all')));

    const payload = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      quantity: parseInt(formData.quantity) || 0,
      sku: formData.sku,
      status: formData.status,
      is_featured: formData.is_featured,
      is_new_arrival: formData.is_new_arrival,
      category_id: formData.category_id,
      size: derivedSizes.length > 0 ? derivedSizes.join(',') : 'all',
      body_shape: derivedHeights.length > 0 ? derivedHeights.join(',') : 'all', // backward compatibility
      target_genders: formData.target_genders,
      target_body_shapes: formData.target_body_shapes,
      occasion_tags: formData.occasion_tags,
      target_skin_tones: derivedSkinTones,
      style_tags: formData.style_tags,
      variations: updatedVariations,
      images: finalImagesArray
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
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
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
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Collection Class</label>
                      <select
                        value={formData.target_body_shapes?.[0] || 'Casual'}
                        onChange={(e) => setFormData({ ...formData, target_body_shapes: [e.target.value] })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#3A10E5] outline-none font-medium text-gray-900"
                      >
                        <option value="Casual">Casual</option>
                        <option value="Exclusive">Exclusive</option>
                        <option value="Exclusive Plus">Exclusive Plus</option>
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
                      <TagInput 
                        label="Occasion Tags" 
                        placeholder="e.g. Office / Work, Party" 
                        tags={formData.occasion_tags || []} 
                        onChange={(newTags) => setFormData({ ...formData, occasion_tags: newTags })} 
                        suggestions={availableOccasionTags}
                      />
                    </div>

                    <div>
                      <TagInput 
                        label="Style Tags" 
                        placeholder="e.g. Workwear, Party" 
                        tags={formData.style_tags || []} 
                        onChange={(newTags) => setFormData({ ...formData, style_tags: newTags })} 
                        suggestions={availableStyleTags}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Collection *</label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:bg-white focus:border-[#986427] outline-none font-medium text-[#1A0A08]"
                        required
                      >
                        <option value="">Select Collection</option>
                        {categories.map(c => {
                          const shapeMatch = c.slug ? c.slug.match(/___BODYSHAPE_([a-zA-Z0-9\-]+)/) : null;
                          const catShape = shapeMatch ? shapeMatch[1] : 'all';
                          let displayName = c.name;
                          
                          if (catShape !== 'all') {
                            const capitalizedShape = catShape.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                            displayName = `${c.name} - ${capitalizedShape}`;
                          }

                          return (
                            <option key={c.id} value={c.id}>{displayName}</option>
                          );
                        })}
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
                    <h3 className="text-sm font-bold text-[#1A0A08] border-b border-gray-100 pb-2 mb-4">Media</h3>
                    <div>
                      <label className="block text-xs font-bold text-[#1A0A08]/80 uppercase tracking-wider mb-1.5">Product Images</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            const newFiles = Array.from(e.target.files);
                            const newImageObjects = newFiles.map(f => ({ type: 'new', file: f, preview: URL.createObjectURL(f) }));
                            setProductImages(prev => [...prev, ...newImageObjects]);
                            e.target.value = ''; // reset so same files can be uploaded again
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:bg-white focus:border-[#986427] outline-none font-medium text-[#1A0A08] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#1A0A08] file:text-[#e8d5c4] hover:file:bg-[#3E2312] transition-all cursor-pointer"
                      />
                    </div>

                    {productImages.length > 0 && (
                      <div className="flex gap-4 mt-4 overflow-x-auto pb-4 custom-scrollbar">
                        {productImages.map((img, idx) => (
                          <div key={idx} className="relative group shrink-0 w-28 flex flex-col gap-2">
                            <div className="relative w-28 h-36 rounded-xl bg-gray-50 overflow-hidden border border-gray-200 shadow-sm group-hover:border-[#986427] transition-colors">
                              <img src={img.type === 'new' ? img.preview : img.url} alt={`Slot ${idx}`} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />

                              {/* Hover Controls */}
                              <div className="absolute inset-0 bg-[#1A0A08]/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                <div className="flex justify-end">
                                  <button type="button" onClick={() => handleRemoveImage(productImages, setProductImages, idx)} className="w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 transition-colors">
                                    <X size={14} />
                                  </button>
                                </div>
                                <div className="flex justify-between mt-auto gap-1">
                                  <button type="button" disabled={idx === 0} onClick={() => handleMoveImage(productImages, setProductImages, idx, -1)} className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${idx === 0 ? 'bg-black/20 text-white/50 cursor-not-allowed' : 'bg-white/90 text-[#1A0A08] hover:bg-white'}`}>
                                    <ChevronLeft size={16} />
                                  </button>
                                  <button type="button" disabled={idx === productImages.length - 1} onClick={() => handleMoveImage(productImages, setProductImages, idx, 1)} className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${idx === productImages.length - 1 ? 'bg-black/20 text-white/50 cursor-not-allowed' : 'bg-white/90 text-[#1A0A08] hover:bg-white'}`}>
                                    <ChevronRight size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                      <div key={v.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-4">
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
                              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-2">Skin Tone</label>
                              <div className="flex gap-2 flex-wrap pb-1">
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
                              <label className="block text-[10px] font-bold text-[#1A0A08]/80 uppercase tracking-wider mb-2">Height Range</label>
                              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
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
                          <div>
                            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Images</label>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  const newFiles = Array.from(e.target.files);
                                  const newImageObjects = newFiles.map(f => ({ type: 'new', file: f, preview: URL.createObjectURL(f) }));
                                  setVariationImages(prev => ({
                                    ...prev,
                                    [index]: [...(prev[index] || []), ...newImageObjects]
                                  }));
                                  e.target.value = '';
                                }
                              }}
                              className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-gray-200"
                            />
                            <div className="text-[9px] text-gray-500 mt-1 pl-1">Hold Ctrl/Cmd to select multiple files</div>
                          </div>
                        </div>

                        <div className="w-32 shrink-0 flex flex-col items-center gap-2">
                          {variationImages[index] && variationImages[index].length > 0 ? (
                            <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar w-full">
                              {variationImages[index].map((img, idx) => (
                                <div key={idx} className="relative group shrink-0 w-12 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shadow-sm">
                                  <img src={img.type === 'new' ? img.preview : img.url} loading="lazy" alt="preview" className="w-full h-full object-cover" />

                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-0.5 transition-opacity">
                                    <button type="button" onClick={() => {
                                      const newArr = [...variationImages[index]];
                                      const removed = newArr.splice(idx, 1)[0];
                                      if (removed.type === 'new') URL.revokeObjectURL(removed.preview);
                                      setVariationImages(prev => ({ ...prev, [index]: newArr }));
                                    }} className="self-end text-white hover:text-red-400 p-0.5"><X size={10} /></button>
                                    <div className="flex justify-between w-full pb-0.5">
                                      <button type="button" disabled={idx === 0} onClick={() => {
                                        const newArr = [...variationImages[index]];
                                        [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
                                        setVariationImages(prev => ({ ...prev, [index]: newArr }));
                                      }} className="text-white hover:text-[#3A10E5] disabled:opacity-30"><ChevronLeft size={12} /></button>
                                      <button type="button" disabled={idx === variationImages[index].length - 1} onClick={() => {
                                        const newArr = [...variationImages[index]];
                                        [newArr[idx + 1], newArr[idx]] = [newArr[idx], newArr[idx + 1]];
                                        setVariationImages(prev => ({ ...prev, [index]: newArr }));
                                      }} className="text-white hover:text-[#3A10E5] disabled:opacity-30"><ChevronRight size={12} /></button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="w-12 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                              <ImageIcon size={14} className="text-gray-300" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              v.imagePreviews?.forEach(url => URL.revokeObjectURL(url));
                              const newVars = formData.variations.filter((_, i) => i !== index);
                              setFormData({ ...formData, variations: newVars });
                            }}
                            className="text-[10px] text-red-500 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
