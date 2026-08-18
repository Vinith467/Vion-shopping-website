import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { uploadImage } from '../../services/storageService';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, X, Check, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';

const PREDEFINED_OCCASIONS = [
  "Wedding",
  "Festive",
  "Formal",
  "Cocktail",
  "Everyday Elegance",
  "Party",
  "Workwear",
  "Lounge"
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
    parent_id: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    if (error) {
      toast.error('Failed to load occasions');
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
      setFormData({
        name: cat.name,
        slug: cat.slug,
        image_url: cat.image_url || '',
        parent_id: cat.parent_id || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', slug: '', image_url: '', parent_id: '' });
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

    const payload = {
      name: formData.name,
      slug: formData.slug,
      image_url: finalImageUrl || null,
      parent_id: formData.parent_id || null
    };

    if (editingId) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
      if (error) toast.error(error.message);
      else {
        toast.success('Category updated!');
        setShowModal(false);
        fetchCategories(false);
      }
    } else {
      const { error } = await supabase.from('categories').insert([payload]);
      if (error) toast.error(error.message);
      else {
        toast.success('Category created!');
        setShowModal(false);
        fetchCategories(false);
      }
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Category deleted!');
      fetchCategories(false);
    }
  };

  const moveCategory = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;

    const newArray = [...categories];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newArray[index], newArray[swapIndex]] = [newArray[swapIndex], newArray[index]];
    
    setIsLoading(true);
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
          <h1 className="text-3xl font-bold font-serif text-[#1A0A08]">Categories</h1>
          <p className="text-gray-600 mt-1">Manage your shop by category</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#1A0A08] text-white hover:bg-gray-800 transition-colors px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1A0A08] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Parent Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider text-center">Order</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium bg-white">
                      No categories found. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  categories.map((cat, index) => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
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
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {cat.slug}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {cat.parent_id ? categories.find(c => c.id === cat.parent_id)?.name || cat.parent_id : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => moveCategory(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 text-gray-400 hover:text-[#1A0A08] hover:bg-gray-200 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            onClick={() => moveCategory(index, 'down')}
                            disabled={index === categories.length - 1}
                            className="p-1.5 text-gray-400 hover:text-[#1A0A08] hover:bg-gray-200 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(cat)}
                            className="p-2 text-gray-400 hover:text-[#1A0A08] hover:bg-gray-200 rounded-lg transition-colors"
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
          <div className="bg-[#f5ece3] rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-[#f5ece3] z-10">
              <h2 className="text-lg font-bold text-[#1A0A08]">{editingId ? 'Edit Occasion' : 'Create Occasion'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-500 hover:bg-white hover:text-[#1A0A08] rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto text-[#1A0A08]">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Occasion Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({ 
                        ...formData, 
                        name,
                        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 outline-none transition-colors"
                    placeholder="e.g. Wedding, Festive"
                    list="predefined-occasions"
                  />
                  <datalist id="predefined-occasions">
                    {PREDEFINED_OCCASIONS.map(occasion => (
                      <option key={occasion} value={occasion} />
                    ))}
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">URL Slug *</label>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#986427] outline-none font-mono text-sm text-[#1A0A08]"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 font-medium text-[#1A0A08] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#1A0A08] file:text-white hover:file:bg-gray-800 transition-all cursor-pointer"
                  />
                </div>
                
                {(imagePreview || formData.image_url) && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                    <img src={imagePreview || formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Parent Collection</label>
                  <select 
                    value={formData.parent_id}
                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#986427] outline-none font-medium text-[#1A0A08]"
                  >
                    <option value="">None (Top Level)</option>
                    {categories.filter(c => c.id !== editingId).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

              </div>
              
              <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#1A0A08] hover:bg-white border border-gray-200 transition-colors bg-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1A0A08] text-white hover:bg-gray-900 px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-70 flex items-center gap-2"
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
