import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Save, Upload, RotateCcw, ChevronDown, ChevronRight, Type, Image as ImageIcon, Layout, Sparkles, Star, Shield, Footprints, Layers } from 'lucide-react';
import { uploadImage } from '../../services/storageService';
import {
  fetchSiteContent,
  saveSiteContent,
  saveMultipleSiteContent,
  getDefaultContent,
  DEFAULT_HOME_HERO,
  DEFAULT_HOME_BENTO,
  DEFAULT_HOME_FIT_CARDS,
  DEFAULT_HOME_JOURNEY,
  DEFAULT_HOME_TAILORING,
  DEFAULT_HOME_TRUST_BAR,
  DEFAULT_CRAFTSMANSHIP,
  DEFAULT_EXPLORE_CONTENT,
} from '../../services/contentService';

// ─── Reusable Components ─────────────────────────────────────────────────────

function SectionAccordion({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden shadow-sm border border-white/60 bg-white/70 rounded-2xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white/80 hover:bg-white transition-colors border-b border-white/40"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#6344D4]/10 flex items-center justify-center">
            <Icon size={16} className="text-[#6344D4]" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 font-serif">{title}</h3>
        </div>
        {isOpen ? <ChevronDown size={18} className="text-gray-500" /> : <ChevronRight size={18} className="text-gray-500" />}
      </button>
      {isOpen && <div className="p-6">{children}</div>}
    </div>
  );
}

function TextInput({ label, value, onChange, multiline = false, rows = 3, placeholder = '' }) {
  const baseClass = "w-full p-3 rounded-xl border border-gray-200 bg-white/50 text-gray-900 font-medium focus:ring-2 focus:ring-[#6344D4]/30 outline-none transition-all text-sm";
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className={`${baseClass} resize-none leading-relaxed`} />
      ) : (
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={baseClass} />
      )}
    </div>
  );
}

function ImageUploadField({ label, value, onChange, previewClass = "w-20 h-20" }) {
  const handleUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        toast.loading('Uploading image...', { id: 'img-upload' });
        const url = await uploadImage(e.target.files[0], 'page-content', 'public-images');
        onChange(url);
        toast.success('Image uploaded!', { id: 'img-upload' });
      } catch (err) {
        toast.error('Failed to upload image', { id: 'img-upload' });
        console.error(err);
      }
    }
  };

  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex gap-3 items-start">
        <div className={`${previewClass} rounded-lg bg-gray-100 shrink-0 overflow-hidden shadow-sm border border-gray-200`}>
          {value && <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL or upload..."
            className="w-full p-2.5 rounded-xl border border-gray-200 bg-white/50 text-gray-900 text-sm focus:ring-2 focus:ring-[#6344D4]/30 outline-none"
          />
          <label className="cursor-pointer inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors text-xs font-semibold text-gray-600">
            <Upload size={12} /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Content Components ──────────────────────────────────────────────────

function HomePageTab({ homeContent, setHomeContent }) {
  const hero = homeContent.home_hero || DEFAULT_HOME_HERO;
  const bento = homeContent.home_bento || DEFAULT_HOME_BENTO;
  const fitCards = homeContent.home_fit_cards || DEFAULT_HOME_FIT_CARDS;
  const journey = homeContent.home_journey || DEFAULT_HOME_JOURNEY;
  const tailoring = homeContent.home_tailoring || DEFAULT_HOME_TAILORING;
  const trustBar = homeContent.home_trust_bar || DEFAULT_HOME_TRUST_BAR;

  const updateSection = (key, field, value) => {
    setHomeContent(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const updateArrayItem = (key, arrayField, index, field, value) => {
    setHomeContent(prev => {
      const section = { ...prev[key] };
      const arr = [...(section[arrayField] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: { ...section, [arrayField]: arr } };
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Banner */}
      <SectionAccordion title="Hero Banner" icon={Sparkles} defaultOpen={true}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <TextInput label="Tagline (small text above heading)" value={hero.tagline} onChange={(v) => updateSection('home_hero', 'tagline', v)} />
            <TextInput label="Heading Line 1" value={hero.heading_line1} onChange={(v) => updateSection('home_hero', 'heading_line1', v)} />
            <TextInput label="Heading Line 2 (cursive)" value={hero.heading_line2} onChange={(v) => updateSection('home_hero', 'heading_line2', v)} />
            <TextInput label="Description" value={hero.description} onChange={(v) => updateSection('home_hero', 'description', v)} multiline rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Button 1 Text" value={hero.button1_text} onChange={(v) => updateSection('home_hero', 'button1_text', v)} />
              <TextInput label="Button 2 Text" value={hero.button2_text} onChange={(v) => updateSection('home_hero', 'button2_text', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Client Count" value={hero.client_count} onChange={(v) => updateSection('home_hero', 'client_count', v)} />
              <TextInput label="Client Label" value={hero.client_label} onChange={(v) => updateSection('home_hero', 'client_label', v)} />
            </div>
          </div>
          <div className="space-y-4">
            <ImageUploadField label="Desktop Hero Image" value={hero.desktop_image} onChange={(v) => updateSection('home_hero', 'desktop_image', v)} previewClass="w-full h-32" />
            <ImageUploadField label="Mobile Hero Image" value={hero.mobile_image} onChange={(v) => updateSection('home_hero', 'mobile_image', v)} previewClass="w-24 h-32" />
          </div>
        </div>
      </SectionAccordion>

      {/* 2. Bento Cards */}
      <SectionAccordion title="Collection & Consultation Cards" icon={Layout}>
        <div className="space-y-6">
          {(bento.cards || []).map((card, i) => (
            <div key={i} className="p-4 bg-white/30 rounded-xl border border-white/50 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#6344D4] bg-white px-2 py-0.5 rounded-md shadow-sm">Card {i + 1}</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <TextInput label="Title" value={card.title} onChange={(v) => updateArrayItem('home_bento', 'cards', i, 'title', v)} />
                  <TextInput label="Description" value={card.description} onChange={(v) => updateArrayItem('home_bento', 'cards', i, 'description', v)} multiline rows={2} />
                  <TextInput label="Button Text" value={card.button_text} onChange={(v) => updateArrayItem('home_bento', 'cards', i, 'button_text', v)} />
                </div>
                <ImageUploadField label="Card Image" value={card.image} onChange={(v) => updateArrayItem('home_bento', 'cards', i, 'image', v)} previewClass="w-full h-28" />
              </div>
            </div>
          ))}
        </div>
      </SectionAccordion>

      {/* 3. Fit Cards */}
      <SectionAccordion title="Fit Category Cards" icon={Layers}>
        <div className="space-y-6">
          {(fitCards.cards || []).map((card, i) => (
            <div key={i} className="p-4 bg-white/30 rounded-xl border border-white/50 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#6344D4] bg-white px-2 py-0.5 rounded-md shadow-sm">{card.name || `Card ${i + 1}`}</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <TextInput label="Display Name" value={card.name} onChange={(v) => updateArrayItem('home_fit_cards', 'cards', i, 'name', v)} />
                  <TextInput label="Description" value={card.description} onChange={(v) => updateArrayItem('home_fit_cards', 'cards', i, 'description', v)} multiline rows={2} />
                  <TextInput label="Button Text" value={card.button_text} onChange={(v) => updateArrayItem('home_fit_cards', 'cards', i, 'button_text', v)} />
                </div>
                <ImageUploadField label="Card Image" value={card.image} onChange={(v) => updateArrayItem('home_fit_cards', 'cards', i, 'image', v)} previewClass="w-full h-28" />
              </div>
            </div>
          ))}
        </div>
      </SectionAccordion>

      {/* 4. Personalised Journey */}
      <SectionAccordion title="Personalised Journey" icon={Footprints}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <TextInput label="Section Tagline" value={journey.tagline} onChange={(v) => updateSection('home_journey', 'tagline', v)} />
            <TextInput label="Section Title" value={journey.title} onChange={(v) => updateSection('home_journey', 'title', v)} />
            <TextInput label="Section Description" value={journey.description} onChange={(v) => updateSection('home_journey', 'description', v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(journey.steps || []).map((step, i) => (
              <div key={i} className="p-3 bg-white/30 rounded-xl border border-white/50 space-y-2">
                <span className="text-xs font-bold text-[#6344D4]">Step {step.num}</span>
                <TextInput label="Title" value={step.title} onChange={(v) => updateArrayItem('home_journey', 'steps', i, 'title', v)} />
                <TextInput label="Description" value={step.desc} onChange={(v) => updateArrayItem('home_journey', 'steps', i, 'desc', v)} />
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* 5. Art of Tailoring */}
      <SectionAccordion title="Art of Italian Tailoring" icon={Star}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextInput label="Section Tagline" value={tailoring.tagline} onChange={(v) => updateSection('home_tailoring', 'tagline', v)} />
            <TextInput label="Section Title" value={tailoring.title} onChange={(v) => updateSection('home_tailoring', 'title', v)} />
          </div>
          <TextInput label="Section Description" value={tailoring.description} onChange={(v) => updateSection('home_tailoring', 'description', v)} multiline rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(tailoring.cards || []).map((card, i) => (
              <div key={i} className="p-4 bg-white/30 rounded-xl border border-white/50 space-y-3">
                <span className="text-xs font-bold text-[#6344D4] bg-white px-2 py-0.5 rounded-md shadow-sm">{card.num} {card.title}</span>
                <TextInput label="Title" value={card.title} onChange={(v) => updateArrayItem('home_tailoring', 'cards', i, 'title', v)} />
                <TextInput label="Description" value={card.desc} onChange={(v) => updateArrayItem('home_tailoring', 'cards', i, 'desc', v)} />
                <ImageUploadField label="Card Image" value={card.img} onChange={(v) => updateArrayItem('home_tailoring', 'cards', i, 'img', v)} previewClass="w-16 h-16" />
              </div>
            ))}
          </div>
        </div>
      </SectionAccordion>

      {/* 6. Trust Bar */}
      <SectionAccordion title="Trust Bar" icon={Shield}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(trustBar.items || []).map((item, i) => (
            <div key={i} className="p-3 bg-white/30 rounded-xl border border-white/50 space-y-2">
              <TextInput label="Title" value={item.title} onChange={(v) => updateArrayItem('home_trust_bar', 'items', i, 'title', v)} />
              <TextInput label="Description" value={item.desc} onChange={(v) => updateArrayItem('home_trust_bar', 'items', i, 'desc', v)} />
            </div>
          ))}
        </div>
      </SectionAccordion>
    </div>
  );
}

function CraftsmanshipTab({ craftsmanshipContent, setCraftsmanshipContent }) {
  const sections = craftsmanshipContent.sections || DEFAULT_CRAFTSMANSHIP.sections;

  const updateSection = (index, field, value) => {
    setCraftsmanshipContent(prev => {
      const newSections = [...(prev.sections || [])];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, sections: newSections };
    });
  };

  const updateImage = (sectionIndex, imageIndex, field, value) => {
    setCraftsmanshipContent(prev => {
      const newSections = [...(prev.sections || [])];
      const images = [...(newSections[sectionIndex].images || [])];
      images[imageIndex] = { ...images[imageIndex], [field]: value };
      newSections[sectionIndex] = { ...newSections[sectionIndex], images };
      return { ...prev, sections: newSections };
    });
  };

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <SectionAccordion key={section.id} title={`${section.number} ${section.title}`} icon={Type} defaultOpen={idx === 0}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Text Content */}
            <div className="space-y-4">
              <TextInput label="Title" value={section.title} onChange={(v) => updateSection(idx, 'title', v)} />
              <TextInput label="Subtitle" value={section.subtitle} onChange={(v) => updateSection(idx, 'subtitle', v)} />
              <TextInput label="Description" value={section.description} onChange={(v) => updateSection(idx, 'description', v)} multiline rows={6} />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 uppercase tracking-wide text-xs border-b border-gray-200 pb-2 flex items-center gap-2">
                <ImageIcon size={14} /> Images ({section.images?.length || 0})
              </h3>
              {(section.images || []).map((img, imgIdx) => (
                <div key={imgIdx} className="flex gap-3 items-start p-3 bg-white/30 rounded-xl border border-white/50">
                  <div className="w-20 h-20 rounded-lg bg-gray-200 shrink-0 overflow-hidden shadow-sm">
                    <img src={img.src} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={img.src}
                        onChange={(e) => updateImage(idx, imgIdx, 'src', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:ring-2 focus:ring-[#6344D4]/30 outline-none"
                        placeholder="Image URL"
                      />
                      <label className="cursor-pointer flex items-center justify-center bg-gray-100 hover:bg-gray-200 px-3 rounded-lg border border-gray-200 transition-colors" title="Upload">
                        <Upload size={14} className="text-gray-600" />
                        <input
                          type="file" accept="image/*" className="hidden"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              try {
                                toast.loading('Uploading...', { id: 'upload' });
                                const url = await uploadImage(e.target.files[0], 'page-content', 'public-images');
                                updateImage(idx, imgIdx, 'src', url);
                                toast.success('Uploaded!', { id: 'upload' });
                              } catch (err) {
                                toast.error('Upload failed', { id: 'upload' });
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => updateImage(idx, imgIdx, 'alt', e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:ring-2 focus:ring-[#6344D4]/30 outline-none"
                      placeholder="Alt text"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionAccordion>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminPreferences() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Home page sections
  const [homeContent, setHomeContent] = useState({
    home_hero: { ...DEFAULT_HOME_HERO },
    home_bento: { ...DEFAULT_HOME_BENTO },
    home_fit_cards: { ...DEFAULT_HOME_FIT_CARDS },
    home_journey: { ...DEFAULT_HOME_JOURNEY },
    home_tailoring: { ...DEFAULT_HOME_TAILORING },
    home_trust_bar: { ...DEFAULT_HOME_TRUST_BAR },
  });

  // Craftsmanship page
  const [craftsmanshipContent, setCraftsmanshipContent] = useState({ ...DEFAULT_CRAFTSMANSHIP });

  // Explore page
  const [exploreContent, setExploreContent] = useState({ ...DEFAULT_EXPLORE_CONTENT });

  // Load content from Supabase on mount
  useEffect(() => {
    async function loadAll() {
      setIsLoading(true);
      try {
        const [hero, bento, fitCards, journey, tailoring, trustBar, craftsmanship, explore] = await Promise.all([
          fetchSiteContent('home_hero'),
          fetchSiteContent('home_bento'),
          fetchSiteContent('home_fit_cards'),
          fetchSiteContent('home_journey'),
          fetchSiteContent('home_tailoring'),
          fetchSiteContent('home_trust_bar'),
          fetchSiteContent('craftsmanship'),
          fetchSiteContent('explore'),
        ]);
        setHomeContent({
          home_hero: hero,
          home_bento: bento,
          home_fit_cards: fitCards,
          home_journey: journey,
          home_tailoring: tailoring,
          home_trust_bar: trustBar,
        });
        setCraftsmanshipContent(craftsmanship);
        setExploreContent(explore);
      } catch (e) {
        console.error('Failed to load content:', e);
        toast.error('Failed to load content from database');
      }
      setIsLoading(false);
    }
    loadAll();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === 'home') {
        await saveMultipleSiteContent(homeContent);
      } else if (activeTab === 'craftsmanship') {
        await saveSiteContent('craftsmanship', craftsmanshipContent);
      } else if (activeTab === 'explore') {
        await saveSiteContent('explore', exploreContent);
      }
      toast.success('Content saved successfully!');
    } catch (e) {
      toast.error('Failed to save content. Please try again.');
    }
    setIsSaving(false);
  };

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset to default content? All changes will be lost.')) return;
    if (activeTab === 'home') {
      setHomeContent({
        home_hero: { ...DEFAULT_HOME_HERO },
        home_bento: { ...DEFAULT_HOME_BENTO },
        home_fit_cards: { ...DEFAULT_HOME_FIT_CARDS },
        home_journey: { ...DEFAULT_HOME_JOURNEY },
        home_tailoring: { ...DEFAULT_HOME_TAILORING },
        home_trust_bar: { ...DEFAULT_HOME_TRUST_BAR },
      });
    } else if (activeTab === 'craftsmanship') {
      setCraftsmanshipContent({ ...DEFAULT_CRAFTSMANSHIP });
    } else if (activeTab === 'explore') {
      setExploreContent({ ...DEFAULT_EXPLORE_CONTENT });
    }
    toast.success('Reset to defaults (save to persist)');
  };

  const tabs = [
    { id: 'home', label: 'Home Page', icon: Layout },
    { id: 'craftsmanship', label: 'Craftsmanship', icon: Star },
    { id: 'explore', label: 'Explore Page', icon: Sparkles },
  ];

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto animate-pulse">
        <div className="h-20 bg-white/40 rounded-2xl mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white/30 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in font-sans pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6 bg-white p-5 md:p-6 rounded-2xl border border-white/50 shadow-sm md:sticky md:top-0 z-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-900">Page Content</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage all storefront text, headings & images.</p>
        </div>
        <div className="flex gap-2 md:gap-3 w-full md:w-auto">
          <button
            onClick={handleReset}
            className="flex-1 md:flex-none px-3 md:px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-white transition-all font-bold text-xs md:text-sm text-center justify-center flex items-center gap-1.5"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 md:flex-none bg-[#6344D4] hover:bg-[#5036aa] text-white px-4 md:px-6 py-2.5 rounded-xl flex items-center justify-center gap-1.5 md:gap-2 font-bold text-xs md:text-sm shadow-md transition-all whitespace-nowrap disabled:opacity-60"
          >
            <Save size={14} /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/30 p-1 rounded-xl border border-white/50 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-white shadow-sm text-[#6344D4] border border-white/50'
                : 'text-gray-600 hover:bg-white/40 hover:text-gray-900'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'home' ? (
        <HomePageTab homeContent={homeContent} setHomeContent={setHomeContent} />
      ) : activeTab === 'craftsmanship' ? (
        <CraftsmanshipTab craftsmanshipContent={craftsmanshipContent} setCraftsmanshipContent={setCraftsmanshipContent} />
      ) : (
        <ExplorePageTab content={exploreContent} setContent={setExploreContent} />
      )}
    </div>
  );
}

function ExplorePageTab({ content, setContent }) {
  const updateField = (field, value) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <SectionAccordion title="Hero Section" icon={Sparkles} defaultOpen={true}>
        <div className="space-y-4">
          <TextInput label="Tagline" value={content.hero_tagline} onChange={(v) => updateField('hero_tagline', v)} />
          <TextInput label="Description" value={content.hero_description} onChange={(v) => updateField('hero_description', v)} multiline rows={2} />
        </div>
      </SectionAccordion>

      <SectionAccordion title="Lookbook Section" icon={Layout}>
        <div className="space-y-4">
          <TextInput label="Title" value={content.lookbook_title} onChange={(v) => updateField('lookbook_title', v)} />
          <TextInput label="Subtitle" value={content.lookbook_subtitle} onChange={(v) => updateField('lookbook_subtitle', v)} />
        </div>
      </SectionAccordion>
    </div>
  );
}
