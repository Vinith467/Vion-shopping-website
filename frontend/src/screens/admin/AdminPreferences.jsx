import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { uploadImage } from '../../services/storageService';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

const defaultTagTypes = [
  { id: 'style', label: 'Style Preference' },
  { id: 'color', label: 'Color' },
  { id: 'fit', label: 'Fit/Silhouette' },
  { id: 'fabric', label: 'Fabric/Material' },
  { id: 'occasion', label: 'Occasion' },
  { id: 'content', label: 'Content Preference' }
];

export default function AdminPreferences() {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [dynamicTagTypes, setDynamicTagTypes] = useState(defaultTagTypes);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('style');
  const [customTypeLabel, setCustomTypeLabel] = useState('');
  const [hexColor, setHexColor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('preference_tags')
      .select('*')
      .order('type', { ascending: true })
      .order('created_at', { ascending: false });
      
    if (error) {
      toast.error('Failed to load tags');
      console.error(error);
    } else {
      const fetchedTags = data || [];
      setTags(fetchedTags);
      
      // Extract unique custom types that are not in defaultTagTypes
      const uniqueTypes = [...new Set(fetchedTags.map(t => t.type))];
      const customTypes = uniqueTypes
        .filter(t => !defaultTagTypes.find(dt => dt.id === t))
        .map(t => ({ id: t, label: t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, ' ') }));
        
      setDynamicTagTypes([...defaultTagTypes, ...customTypes]);
    }
    setIsLoading(false);
  };

  const openCreateModal = () => {
    setEditingTag(null);
    setName('');
    setType('style');
    setCustomTypeLabel('');
    setHexColor('');
    setImageUrl('');
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (tag) => {
    setEditingTag(tag);
    setName(tag.name);
    setType(tag.type);
    setHexColor(tag.hex_color || '');
    setImageUrl(tag.image_url || '');
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    if (type === 'custom' && !customTypeLabel.trim()) return toast.error("Custom tag type name is required");

    setIsSubmitting(true);
    
    // Determine the actual type ID to use
    let finalType = type;
    if (type === 'custom') {
      finalType = customTypeLabel.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    let finalImageUrl = imageUrl;
    if (imageFile) {
      try {
        finalImageUrl = await uploadImage(imageFile, 'preferences', 'public-images');
      } catch (err) {
        toast.error('Failed to upload image: ' + err.message);
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      name,
      type: finalType,
      hex_color: hexColor || null,
      image_url: finalImageUrl || null
    };

    if (editingTag) {
      const { error } = await supabase
        .from('preference_tags')
        .update(payload)
        .eq('id', editingTag.id);
        
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Tag updated!");
        setShowModal(false);
        fetchTags();
      }
    } else {
      const { error } = await supabase
        .from('preference_tags')
        .insert([payload]);
        
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Tag created!");
        setShowModal(false);
        fetchTags();
      }
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag? It may break products linked to it.")) return;
    
    const { error } = await supabase
      .from('preference_tags')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Tag deleted");
      fetchTags();
    }
  };

  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.type]) acc[tag.type] = [];
    acc[tag.type].push(tag);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Preference Tags</h1>
          <p className="text-gray-600 mt-1">Manage dynamic preferences (styles, colors, etc.) for users and products.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="glass-button px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm"
        >
          <Plus size={16} /> Create Tag
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-100 rounded-xl"></div>
          <div className="h-20 bg-gray-100 rounded-xl"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {dynamicTagTypes.map((typeGroup) => {
            const typeTags = groupedTags[typeGroup.id] || [];
            if (typeTags.length === 0) return null;
            
            return (
              <div key={typeGroup.id} className="glass-panel p-0 overflow-hidden mb-6">
                <div className="bg-white/20 backdrop-blur px-6 py-4 border-b border-white/30">
                  <h2 className="font-bold text-gray-900">{typeGroup.label} <span className="text-gray-600 font-normal ml-2">({typeTags.length})</span></h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeTags.map(tag => (
                    <div key={tag.id} className="flex items-center justify-between border border-white/30 bg-white/20 backdrop-blur-md p-4 rounded-xl hover:bg-white/30 transition-colors">
                      <div className="flex items-center gap-3">
                        {tag.type === 'color' && tag.hex_color && (
                          <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm shrink-0" style={{ background: tag.hex_color }}></div>
                        )}
                        {tag.image_url && tag.type !== 'color' && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                            <img src={tag.image_url} alt={tag.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{tag.name}</p>
                          {tag.hex_color && <p className="text-xs text-gray-600 font-mono">{tag.hex_color}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(tag)} className="p-2 text-gray-600 hover:text-black hover:bg-white/50 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(tag.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {Object.keys(groupedTags).length === 0 && (
            <div className="text-center py-20 glass-panel border-dashed">
              <p className="text-gray-600 mb-4">No preference tags created yet.</p>
              <button onClick={openCreateModal} className="text-[#3A10E5] font-bold hover:underline">Create your first tag</button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="glass-panel-darker rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200 p-0 border border-white/60">
            <div className="px-6 py-4 border-b border-white/30 bg-white/20 flex justify-between items-center backdrop-blur-md">
              <h3 className="font-bold text-lg text-gray-900">{editingTag ? 'Edit Tag' : 'Create Tag'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-700 hover:text-black p-1 hover:bg-white/50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Tag Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input mb-3 text-gray-900 font-medium"
                  disabled={!!editingTag}
                >
                  {dynamicTagTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  {!editingTag && <option value="custom">+ Add Custom Type...</option>}
                </select>

                {type === 'custom' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">New Tag Type Name</label>
                    <input 
                      type="text" 
                      value={customTypeLabel} 
                      onChange={(e) => setCustomTypeLabel(e.target.value)}
                      placeholder="e.g. Pattern, Season..."
                      className="w-full p-2.5 rounded-xl glass-input text-gray-900 font-medium"
                      required
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Minimal, Black, Cotton..."
                  className="w-full p-2.5 rounded-xl glass-input text-gray-900 font-medium"
                  required
                />
              </div>

              {type === 'color' && (
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Hex Color Code</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={hexColor} 
                      onChange={(e) => setHexColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1 p-2.5 rounded-xl glass-input font-mono text-sm text-gray-900"
                    />
                    <div className="w-11 h-11 rounded-xl border border-white/40 shrink-0 shadow-sm" style={{ background: hexColor || '#fff' }}></div>
                  </div>
                </div>
              )}

              {type !== 'color' && (
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Image URL (Optional)</label>
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
                  <p className="text-xs text-gray-600 mt-1">Provide an image to represent this style/fabric.</p>
                  
                  {(imagePreview || imageUrl) && (
                    <div className="mt-3 aspect-video w-full rounded-xl overflow-hidden border border-white/40 shadow-sm bg-white/20">
                      <img src={imagePreview || imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                </div>
              )}

              <div className="pt-6 flex gap-3 -mx-6 -mb-6 bg-white/10 p-6 border-t border-white/30">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-5 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-white/50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 glass-button px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : <><Check size={18} /> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
