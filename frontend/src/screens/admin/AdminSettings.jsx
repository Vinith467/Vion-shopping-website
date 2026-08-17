import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { uploadImage } from '../../services/storageService';
import toast from 'react-hot-toast';
import { Save, Image as ImageIcon } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    hero_title: 'Fashion, Personalised For You',
    hero_subtitle: 'We understand your body, height and style to recommend outfits that truly suit you.',
    hero_image: '/images/silk-wrap-dress.jpg'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('site_settings').select('*');
    if (!error && data) {
      const fetchedSettings = { ...settings };
      // Override defaults with DB values
      data.forEach(item => {
        fetchedSettings[item.key] = item.value;
      });
      setSettings(fetchedSettings);
      setImagePreview(fetchedSettings.hero_image);
    }
    setIsLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let finalImageUrl = settings.hero_image;
    if (imageFile) {
      try {
        finalImageUrl = await uploadImage(imageFile, 'settings', 'public-images');
      } catch (err) {
        toast.error('Failed to upload image: ' + err.message);
        setIsSubmitting(false);
        return;
      }
    }

    const newSettings = {
      ...settings,
      hero_image: finalImageUrl
    };

    // Upsert each setting
    const promises = Object.entries(newSettings).map(([key, value]) => {
      return supabase.from('site_settings').upsert({ key, value });
    });

    const results = await Promise.all(promises);
    const hasError = results.some(res => res.error);

    if (hasError) {
      toast.error('Failed to save some settings.');
    } else {
      toast.success('Site settings saved successfully!');
      setSettings(newSettings);
      setImagePreview(finalImageUrl);
      setImageFile(null);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-gray-900">Site Appearance</h1>
        <p className="text-gray-600 mt-1">Customize the look and feel of your website.</p>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-100 rounded-xl"></div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Home Page Hero Section</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Hero Title</label>
                <p className="text-xs text-gray-500 mb-2">Use &lt;br/&gt; to create a line break.</p>
                <input 
                  type="text"
                  value={settings.hero_title}
                  onChange={(e) => setSettings({...settings, hero_title: e.target.value})}
                  className="w-full p-3 rounded-xl glass-input text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Hero Subtitle</label>
                <textarea 
                  rows={2}
                  value={settings.hero_subtitle}
                  onChange={(e) => setSettings({...settings, hero_subtitle: e.target.value})}
                  className="w-full p-3 rounded-xl glass-input text-gray-900 font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Hero Background Image</label>
                <p className="text-xs text-gray-500 mb-2">Upload a high-quality vertical image for the right side of the hero section.</p>
                
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-full sm:w-1/2">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                          setImagePreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl glass-input font-medium text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-black file:text-white hover:file:bg-gray-800 transition-all cursor-pointer"
                    />
                  </div>

                  <div className="w-full sm:w-1/2">
                    {imagePreview ? (
                      <div className="aspect-[3/4] max-w-[200px] rounded-xl overflow-hidden shadow-md border border-gray-200">
                        <img src={imagePreview} alt="Hero Preview" className="w-full h-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] max-w-[200px] rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400">
                        <ImageIcon size={40} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#1C1C1C] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50 shadow-md"
            >
              {isSubmitting ? 'Saving...' : <><Save size={18} /> Save Settings</>}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
