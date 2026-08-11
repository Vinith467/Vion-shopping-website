import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { uploadImage } from '../../services/storageService';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, X, Check, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';

const PREDEFINED_COLLECTIONS = [
  "Business Suits",
  "Formal Dresses",
  "Business Casual",
  "Smart Casual",
  "Co-Ord Sets",
  "A-Line Mini Dress",
  "Power Dressing",
  "Smart Top and Pants",
  "Premium Executive",
  "Friday Office Wear",
  "Icons Only",
  "The Boss Lounge",
  "The Boardroom Edit",
  "Regal Essence"
];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image_url: '',
    gender: 'women',
    bodyShape: 'all',
    parent_id: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    if (error) {
      toast.error('Failed to load collections');
    } else {
      setCategories(data || []);
    }
    if (showLoader) setIsLoading(false);
  };

  const handleOpenModal = (cat = null) => {
    setImageFile(null);
    setImagePreview(null);
    if (cat) {
      setEditingId(cat.id);
      const genderMatch = cat.slug ? cat.slug.match(/___GENDER_([a-zA-Z0-9\-]+)/) : null;
      const bodyShapeMatch = cat.slug ? cat.slug.match(/___BODYSHAPE_([a-zA-Z0-9\-]+)/) : null;
      const actualSlug = cat.slug ? cat.slug.split('___GENDER_')[0] : '';
      
      setFormData({
        name: cat.name,
        slug: actualSlug,
        image_url: cat.image_url || '',
        gender: genderMatch ? genderMatch[1] : 'women',
        bodyShape: bodyShapeMatch ? bodyShapeMatch[1] : 'all',
        parent_id: cat.parent_id || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', slug: '', image_url: '', gender: 'women', bodyShape: 'all', parent_id: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error('Name and Slug are required');
      return;
    }

    setIsSubmitting(true);
    
    let finalImageUrl = formData.image_url;
    if (imageFile) {
      try {
        finalImageUrl = await uploadImage(imageFile, 'categories', 'public-images');
      } catch (err) {
        toast.error('Failed to upload image: ' + err.message);
        setIsSubmitting(false);
        return;
      }
    }

    const metadataSlug = `${formData.slug}___GENDER_${formData.gender}___BODYSHAPE_${formData.bodyShape}`;
    
    const payload = {
      name: formData.name,
      slug: metadataSlug,
      image_url: finalImageUrl || null,
      parent_id: formData.parent_id || null
    };

    if (editingId) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
      if (error) toast.error(error.message);
      else {
        toast.success('Collection updated!');
        setShowModal(false);
        fetchCategories(false);
      }
    } else {
      const { error } = await supabase.from('categories').insert([payload]);
      if (error) toast.error(error.message);
      else {
        toast.success('Collection created!');
        setShowModal(false);
        fetchCategories(false);
      }
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Collection deleted!');
      fetchCategories(false);
    }
  };

  const moveCategory = async (groupArray, index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === groupArray.length - 1) return;

    const newArray = [...groupArray];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap elements
    [newArray[index], newArray[swapIndex]] = [newArray[swapIndex], newArray[index]];
    
    setIsLoading(true);
    
    // Rewrite created_at timestamps to lock in the new order
    const baseTime = Date.now();
    
    try {
      for (let i = 0; i < newArray.length; i++) {
        const item = newArray[i];
        const newDate = new Date(baseTime + i * 1000).toISOString();
        await supabase.from('categories').update({ created_at: newDate }).eq('id', item.id);
      }
      toast.success('Order saved!');
    } catch (e) {
      toast.error('Failed to save order');
    }
    
    fetchCategories(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Collections</h1>
          <p className="text-gray-600 mt-1">Manage your product collections</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="glass-button px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Plus size={18} /> Add Collection
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#3A10E5] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/30 border-b border-white/50 backdrop-blur-md">
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Target Audience</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Parent Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider text-center">Order</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-600 font-medium bg-white/20">
                      No categories found. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const getShape = (slug) => {
                      const match = slug ? slug.match(/___BODYSHAPE_([a-zA-Z0-9\-]+)/) : null;
                      return match ? match[1] : 'all';
                    };

                    const groupedCategories = categories.reduce((acc, cat) => {
                      const shape = getShape(cat.slug);
                      if (!acc[shape]) acc[shape] = [];
                      acc[shape].push(cat);
                      return acc;
                    }, {});

                    const shapeOrder = ['all', 'hourglass', 'pear', 'apple', 'rectangle', 'inverted-triangle'];
                    const sortedShapes = Object.keys(groupedCategories).sort((a, b) => {
                      const idxA = shapeOrder.indexOf(a);
                      const idxB = shapeOrder.indexOf(b);
                      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
                    });

                    return sortedShapes.map(shape => (
                      <React.Fragment key={shape}>
                        <tr className="bg-[#f0eaff]">
                          <td colSpan="6" className="px-6 py-3 font-black text-[#3A10E5] uppercase tracking-wider text-xs border-y border-[#3A10E5]/10">
                            {shape === 'all' ? 'All Shapes / General' : `${shape} Body Shape`}
                          </td>
                        </tr>
                        {groupedCategories[shape].map((cat) => (
                          <tr key={cat.id} className="hover:bg-white/40 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                                  {cat.image_url ? (
                                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <ImageIcon size={16} className="text-gray-400" />
                                  )}
                                </div>
                                <span className="font-bold text-gray-900">{cat.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 font-mono bg-white/30">
                              {cat.slug ? cat.slug.split('___GENDER_')[0] : ''}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1.5 items-start">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[#3A10E5] bg-[#3A10E5]/10 border border-[#3A10E5]/20">
                                  Gender: {cat.slug ? (cat.slug.match(/___GENDER_([a-zA-Z0-9\-]+)/)?.[1] || 'women') : 'women'}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-pink-600 bg-pink-100 border border-pink-200">
                                  Shape: {cat.slug ? (cat.slug.match(/___BODYSHAPE_([a-zA-Z0-9\-]+)/)?.[1] || 'all') : 'all'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                              {cat.parent_id ? categories.find(c => c.id === cat.parent_id)?.name || cat.parent_id : '-'}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button 
                                  onClick={() => moveCategory(groupedCategories[shape], groupedCategories[shape].indexOf(cat), 'up')}
                                  disabled={groupedCategories[shape].indexOf(cat) === 0}
                                  className="p-1.5 text-gray-400 hover:text-[#3A10E5] hover:bg-purple-50 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                                >
                                  <ArrowUp size={16} />
                                </button>
                                <button 
                                  onClick={() => moveCategory(groupedCategories[shape], groupedCategories[shape].indexOf(cat), 'down')}
                                  disabled={groupedCategories[shape].indexOf(cat) === groupedCategories[shape].length - 1}
                                  className="p-1.5 text-gray-400 hover:text-[#3A10E5] hover:bg-purple-50 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                                >
                                  <ArrowDown size={16} />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleOpenModal(cat)}
                                  className="p-2 text-gray-400 hover:text-[#3A10E5] hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(cat.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ));
                  })()
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="glass-panel-darker rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-white/30 bg-white/20">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Collection' : 'Create Collection'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-700 hover:bg-white/50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Collection Name *</label>
                  <input 
                    list="predefined-collections"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        name: e.target.value,
                        // Auto-generate slug if creating new
                        slug: !editingId ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : formData.slug
                      });
                    }}
                    placeholder="Type or select a collection..."
                    className="w-full px-4 py-2.5 rounded-xl glass-input font-medium text-gray-900"
                    required
                  />
                  <datalist id="predefined-collections">
                    {PREDEFINED_COLLECTIONS.map(collection => (
                      <option key={collection} value={collection} />
                    ))}
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">URL Slug *</label>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input font-mono text-sm text-gray-900 bg-white/20"
                    placeholder="e.g. dresses"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Collection Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl glass-input font-medium text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-black file:text-white hover:file:bg-gray-800 transition-all cursor-pointer"
                  />
                </div>
                
                {(imagePreview || formData.image_url) && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/40 shadow-sm bg-white/20">
                    <img src={imagePreview || formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Target Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input font-medium text-gray-900"
                    >
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="unisex">Unisex</option>
                      <option value="kids">Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Body Shape</label>
                    <select 
                      value={formData.bodyShape}
                      onChange={(e) => setFormData({ ...formData, bodyShape: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input font-medium text-gray-900"
                    >
                      <option value="all">All Shapes</option>
                      <option value="hourglass">Hourglass</option>
                      <option value="pear">Pear / Triangle</option>
                      <option value="apple">Apple / Round</option>
                      <option value="rectangle">Rectangle / Straight</option>
                      <option value="inverted-triangle">Inverted Triangle</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Parent Collection</label>
                    <select 
                      value={formData.parent_id}
                      onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input font-medium text-gray-900"
                    >
                      <option value="">None (Top Level)</option>
                      {categories.filter(c => c.id !== editingId).map(c => {
                        const actualCatSlug = c.slug ? c.slug.split('___GENDER_')[0] : '';
                        return (
                          <option key={c.id} value={c.id}>{c.name} ({actualCatSlug})</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

              </div>
              
              <div className="mt-8 pt-5 border-t border-white/30 flex justify-end gap-3 bg-white/10 -mx-5 -mb-5 p-5">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-white/50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="glass-button px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Check size={16} />
                  )}
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
