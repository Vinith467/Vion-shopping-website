import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, Image as ImageIcon } from 'lucide-react';

// Default data representing the initial state
const DEFAULT_DATA = [
  {
    id: "premium-materials",
    number: "01.",
    title: "PREMIUM MATERIALS",
    subtitle: "Sourced from the world's finest mills.",
    description: "Our fabrics are the foundation of our legacy. We travel the globe to source the rarest, most exquisite wools, silks, and cashmeres. Each thread is chosen for its unparalleled softness, durability, and drape, ensuring that every VION garment feels as exceptional as it looks. This meticulous selection process is the first step in our commitment to uncompromising quality.",
    images: [
      { src: "/images/craftsmanship/craft_01_hero.jpg", alt: "Premium suiting fabrics on a tailoring table", type: "hero" },
      { src: "/images/craftsmanship/craft_01_macro.jpg", alt: "Macro detail of fabric texture", type: "macro" },
      { src: "/images/craftsmanship/craft_01_selection.jpg", alt: "Clients selecting fabrics with a master tailor", type: "editorial" },
    ]
  },
  {
    id: "timeless-elegance",
    number: "02.",
    title: "TIMELESS ELEGANCE",
    subtitle: "Designed to be worn. Loved for a lifetime.",
    description: "VION designs transcend fleeting trends. We focus on clean lines, perfect proportions, and a silhouette that flatters the individual. Our aesthetic is one of sophisticated understatement, where true luxury is found in the subtle details and the confidence it instills in the wearer. A VION piece is not just for a season; it is an investment in enduring style.",
    images: [
      { src: "/images/craftsmanship/craft_02_hero.jpg", alt: "Elegant couple in bespoke formalwear", type: "hero" },
      { src: "/images/craftsmanship/craft_02_woman.jpg", alt: "Sophisticated woman in a tailored blazer", type: "portrait" },
      { src: "/images/craftsmanship/craft_02_man.jpg", alt: "Sophisticated man in a deep navy bespoke suit", type: "portrait" },
    ]
  },
  {
    id: "finest-craftsmanship",
    number: "03.",
    title: "FINEST CRAFTSMANSHIP",
    subtitle: "Handmade by master artisans, always.",
    description: "Every VION garment is a testament to the art of tailoring. Our master artisans employ time-honored techniques, dedicating countless hours to hand-stitching, pressing, and finishing each piece. From the precise cut of the lapel to the perfect roll of the shoulder, this dedication to handcraftsmanship ensures a fit and feel that machines simply cannot replicate.",
    images: [
      { src: "/images/craftsmanship/craft_03_hero.jpg", alt: "Tailor hand-stitching a lapel", type: "hero" },
      { src: "/images/craftsmanship/craft_03_cutting.jpg", alt: "Tailor cutting fabric", type: "editorial" },
      { src: "/images/craftsmanship/craft_03_details.jpg", alt: "Macro detail of hand-finished buttonhole", type: "macro" },
      { src: "/images/craftsmanship/craft_03_artisans.jpg", alt: "Artisans working in the atelier", type: "editorial" },
    ]
  },
  {
    id: "personalised-experience",
    number: "04.",
    title: "PERSONALISED EXPERIENCE",
    subtitle: "Crafted around you, in every detail.",
    description: "The VION bespoke experience is an intimate collaboration. We begin by understanding your lifestyle, preferences, and unique physique. Through a series of personalized fittings, we sculpt the garment to your exact measurements, making adjustments until it becomes a second skin. It is a journey of co-creation, resulting in a piece that is unmistakably yours.",
    images: [
      { src: "/images/craftsmanship/craft_04_hero.jpg", alt: "Stylist conducting a private consultation", type: "hero" },
      { src: "/images/craftsmanship/craft_04_measuring.jpg", alt: "Stylist measuring a client", type: "editorial" },
      { src: "/images/craftsmanship/craft_04_male_fitting.jpg", alt: "Male fitting session", type: "editorial" },
      { src: "/images/craftsmanship/craft_04_measuring.jpg", alt: "Female fitting session", type: "editorial" },
    ]
  }
];

export default function AdminPreferences() {
  const [sections, setSections] = useState(DEFAULT_DATA);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load data from local storage if it exists
    const savedData = localStorage.getItem('vion_craftsmanship_content');
    if (savedData) {
      try {
        setSections(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved data");
      }
    }
  }, []);

  const handleSectionChange = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const handleImageChange = (sectionIndex, imageIndex, field, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].images[imageIndex][field] = value;
    setSections(newSections);
  };

  const saveContent = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('vion_craftsmanship_content', JSON.stringify(sections));
      setIsSaving(false);
      toast.success("Page content updated successfully!");
    }, 600);
  };

  const resetToDefault = () => {
    if (window.confirm("Are you sure you want to reset to default content? All unsaved changes will be lost.")) {
      setSections(DEFAULT_DATA);
      localStorage.setItem('vion_craftsmanship_content', JSON.stringify(DEFAULT_DATA));
      toast.success("Reset to default content.");
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in font-sans pb-32">
      <div className="flex justify-between items-center mb-8 bg-white/60 backdrop-blur p-6 rounded-2xl border border-white/50 shadow-sm sticky top-20 z-10">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Page Content</h1>
          <p className="text-gray-600 mt-1">Manage the content and images for the Craftsmanship page.</p>
        </div>
        <div className="flex gap-3">
            <button 
            onClick={resetToDefault}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-white transition-all font-bold text-sm"
            >
            Reset Defaults
            </button>
            <button 
            onClick={saveContent}
            disabled={isSaving}
            className="bg-[#6344D4] hover:bg-[#5036aa] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md transition-all"
            >
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </div>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <div key={section.id} className="glass-panel p-0 overflow-hidden shadow-sm border border-white/60 bg-white/20">
            <div className="bg-white/40 backdrop-blur px-6 py-4 border-b border-white/40 flex justify-between items-center">
              <h2 className="font-bold text-xl text-gray-900 font-serif flex items-center gap-3">
                <span className="text-[#6344D4] bg-white px-3 py-1 rounded-lg text-sm shadow-sm">{section.number}</span>
                {section.title || `Section ${idx + 1}`}
              </h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Text Content */}
                <div className="space-y-5">
                    <h3 className="font-bold text-gray-800 uppercase tracking-wide text-xs mb-4 border-b border-gray-200 pb-2">Text Content</h3>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Title</label>
                        <input 
                            type="text" 
                            value={section.title} 
                            onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-white/50 text-gray-900 font-medium focus:ring-2 focus:ring-[#6344D4]/30 outline-none transition-all"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Subtitle</label>
                        <input 
                            type="text" 
                            value={section.subtitle} 
                            onChange={(e) => handleSectionChange(idx, 'subtitle', e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-white/50 text-gray-900 font-medium focus:ring-2 focus:ring-[#6344D4]/30 outline-none transition-all"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
                        <textarea 
                            value={section.description} 
                            onChange={(e) => handleSectionChange(idx, 'description', e.target.value)}
                            rows={6}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-white/50 text-gray-900 font-medium focus:ring-2 focus:ring-[#6344D4]/30 outline-none transition-all resize-none leading-relaxed"
                        />
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-5">
                    <h3 className="font-bold text-gray-800 uppercase tracking-wide text-xs mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                        <ImageIcon size={14} /> Images ({section.images.length})
                    </h3>
                    
                    <div className="space-y-4">
                        {section.images.map((img, imgIdx) => (
                            <div key={imgIdx} className="flex gap-4 items-start p-4 bg-white/40 rounded-xl border border-white/60">
                                <div className="w-24 h-24 rounded-lg bg-gray-200 shrink-0 overflow-hidden shadow-sm">
                                    <img src={img.src} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }} />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL ({img.type})</label>
                                        <input 
                                            type="text" 
                                            value={img.src} 
                                            onChange={(e) => handleImageChange(idx, imgIdx, 'src', e.target.value)}
                                            className="w-full p-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:ring-2 focus:ring-[#6344D4]/30 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Alt Text</label>
                                        <input 
                                            type="text" 
                                            value={img.alt} 
                                            onChange={(e) => handleImageChange(idx, imgIdx, 'alt', e.target.value)}
                                            className="w-full p-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:ring-2 focus:ring-[#6344D4]/30 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
