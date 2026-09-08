import { supabase } from './supabaseClient';

// ─── DEFAULT CONTENT CONSTANTS ───────────────────────────────────────────────

export const DEFAULT_HOME_HERO = {
  tagline: 'Sartoria Di Lusso',
  heading_line1: 'Italian',
  heading_line2: 'Elegance',
  description: 'Timeless style. Unmatched grace. Experience the pinnacle of trusted Italian craftsmanship, tailored flawlessly to elevate your legacy.',
  desktop_image: '/images/herobannerimage/hero banner 2 .png',
  mobile_image: '/images/herobannerimage/mobile hero banner .png',
  button1_text: 'DISCOVER COLLECTION',
  button2_text: 'BOOK A CONSULTATION',
  client_count: '10,000+',
  client_label: 'Clients trust VION',
};

export const DEFAULT_HOME_BENTO = {
  cards: [
    {
      title: 'DISCOVER COLLECTION',
      description: 'Explore our curated fashion selections tailored to your unique profile and style.',
      button_text: 'Book Stylist',
      image: '/DISCOVER COLLECTION IMAGE.png',
      span: 2, // col-span-2
    },
    {
      title: 'BOOK A CONSULTATION',
      description: 'Schedule a one-on-one session with our experts.',
      button_text: 'Book Now',
      image: '/BOOK A CONSULTATION.png',
      span: 1,
    },
  ],
};

export const DEFAULT_HOME_FIT_CARDS = {
  cards: [
    { name: 'STANDARD FIT', value: 'Standard Fit', description: 'Effortless everyday pieces that blend comfort with refined style.', image: '/images/herobannerimage/casual.png', button_text: 'Book Stylist' },
    { name: 'TAILORED FIT', value: 'Tailored Fit', description: 'Elevated craftsmanship for life\'s most meaningful moments.', image: '/images/herobannerimage/exclusive.png', button_text: 'Book Stylist' },
    { name: 'BOOK A STYLIST', value: 'Book A Stylist', description: 'Fully bespoke creations crafted exclusively for you.', image: '/images/herobannerimage/exclusiveplus.png', button_text: 'Book Now' },
  ],
};

export const DEFAULT_HOME_JOURNEY = {
  tagline: 'The Vion Experience',
  title: 'Your Personalised Journey',
  description: 'A seamless journey from consultation to creation. Thoughtfully designed around you.',
  steps: [
    { num: '01', title: 'SHOPPING FOR?', desc: 'Who are you shopping for?' },
    { num: '02', title: 'PROFILE DETAILS', desc: 'Tell us about them' },
    { num: '03', title: 'VION COLLECTION', desc: 'Your VION Collection' },
    { num: '04', title: 'CONFIDENT SHOPPING', desc: 'Shop with Confidence' },
  ],
};

export const DEFAULT_HOME_TAILORING = {
  tagline: 'THE ART OF ITALIAN TAILORING',
  title: 'The Finest Italian Fabrics. Crafted to Perfection.',
  description: 'Every piece begins with a story. Yours.\nFrom fabric to final stitch, crafted in Italy, exclusively for you.',
  cards: [
    { img: '/card image/1.png', num: '01.', title: 'PREMIUM MATERIALS', desc: 'Sourced from the world\'s finest mills.' },
    { img: '/card image/2.png', num: '02.', title: 'TIMELESS ELEGANCE', desc: 'Designed to be worn. Loved for a lifetime.' },
    { img: '/card image/3.png', num: '03.', title: 'FINEST CRAFTSMANSHIP', desc: 'Handmade by master artisans, always.' },
    { img: '/card image/4.png', num: '04.', title: 'PERSONALISED EXPERIENCE', desc: 'Crafted around you, in every detail.' },
  ],
};

export const DEFAULT_HOME_TRUST_BAR = {
  items: [
    { title: 'ETHICALLY MADE', desc: 'Conscious production, responsible by choice.' },
    { title: 'AWARD WINNING', desc: 'Recognised for design excellence and client satisfaction.' },
    { title: 'WORLDWIDE DELIVERY', desc: 'Complimentary shipping on all orders.' },
    { title: 'PRIVATE CLIENT CARE', desc: 'Dedicated support for a seamless experience.' },
  ],
};

export const DEFAULT_CRAFTSMANSHIP = {
  sections: [
    {
      id: 'premium-materials',
      number: '01.',
      title: 'PREMIUM MATERIALS',
      subtitle: "Sourced from the world's finest mills.",
      description: "Our fabrics are the foundation of our legacy. We travel the globe to source the rarest, most exquisite wools, silks, and cashmeres. Each thread is chosen for its unparalleled softness, durability, and drape, ensuring that every VION garment feels as exceptional as it looks. This meticulous selection process is the first step in our commitment to uncompromising quality.",
      images: [
        { src: '/images/craftsmanship/craft_01_hero.jpg', alt: 'Premium suiting fabrics on a tailoring table', type: 'hero' },
        { src: '/images/craftsmanship/craft_01_macro.jpg', alt: 'Macro detail of fabric texture', type: 'macro' },
        { src: '/images/craftsmanship/craft_01_selection.jpg', alt: 'Clients selecting fabrics with a master tailor', type: 'editorial' },
      ],
    },
    {
      id: 'timeless-elegance',
      number: '02.',
      title: 'TIMELESS ELEGANCE',
      subtitle: 'Designed to be worn. Loved for a lifetime.',
      description: "VION designs transcend fleeting trends. We focus on clean lines, perfect proportions, and a silhouette that flatters the individual. Our aesthetic is one of sophisticated understatement, where true luxury is found in the subtle details and the confidence it instills in the wearer. A VION piece is not just for a season; it is an investment in enduring style.",
      images: [
        { src: '/images/craftsmanship/craft_02_hero.jpg', alt: 'Elegant couple in bespoke formalwear', type: 'hero' },
        { src: '/images/craftsmanship/craft_02_woman.jpg', alt: 'Sophisticated woman in a tailored blazer', type: 'portrait' },
        { src: '/images/craftsmanship/craft_02_man.jpg', alt: 'Sophisticated man in a deep navy bespoke suit', type: 'portrait' },
      ],
    },
    {
      id: 'finest-craftsmanship',
      number: '03.',
      title: 'FINEST CRAFTSMANSHIP',
      subtitle: 'Handmade by master artisans, always.',
      description: "Every VION garment is a testament to the art of tailoring. Our master artisans employ time-honored techniques, dedicating countless hours to hand-stitching, pressing, and finishing each piece. From the precise cut of the lapel to the perfect roll of the shoulder, this dedication to handcraftsmanship ensures a fit and feel that machines simply cannot replicate.",
      images: [
        { src: '/images/craftsmanship/craft_03_hero.jpg', alt: 'Tailor hand-stitching a lapel', type: 'hero' },
        { src: '/images/craftsmanship/craft_03_cutting.jpg', alt: 'Tailor cutting fabric', type: 'editorial' },
        { src: '/images/craftsmanship/craft_03_details.jpg', alt: 'Macro detail of hand-finished buttonhole', type: 'macro' },
        { src: '/images/craftsmanship/craft_03_artisans.jpg', alt: 'Artisans working in the atelier', type: 'editorial' },
      ],
    },
    {
      id: 'personalised-experience',
      number: '04.',
      title: 'PERSONALISED EXPERIENCE',
      subtitle: 'Crafted around you, in every detail.',
      description: "The VION bespoke experience is an intimate collaboration. We begin by understanding your lifestyle, preferences, and unique physique. Through a series of personalized fittings, we sculpt the garment to your exact measurements, making adjustments until it becomes a second skin. It is a journey of co-creation, resulting in a piece that is unmistakably yours.",
      images: [
        { src: '/images/craftsmanship/craft_04_hero.jpg', alt: 'Stylist conducting a private consultation', type: 'hero' },
        { src: '/images/craftsmanship/craft_04_measuring.jpg', alt: 'Stylist measuring a client', type: 'editorial' },
        { src: '/images/craftsmanship/craft_04_male_fitting.jpg', alt: 'Male fitting session', type: 'editorial' },
        { src: '/images/craftsmanship/craft_04_measuring.jpg', alt: 'Female fitting session', type: 'editorial' },
      ],
    },
  ],
};

export const DEFAULT_EXPLORE_CONTENT = {
  hero_tagline: 'Discover The Look',
  hero_description: 'Explore our curated selection of masterful designs. Each piece tells a story of global inspiration and Indian craftsmanship.',
  lookbook_title: 'The Editorial Lookbook',
  lookbook_subtitle: 'Scroll to explore the stories behind the silhouettes',
};

// Map of section IDs to their default content
const DEFAULTS_MAP = {
  home_hero: DEFAULT_HOME_HERO,
  home_bento: DEFAULT_HOME_BENTO,
  home_fit_cards: DEFAULT_HOME_FIT_CARDS,
  home_journey: DEFAULT_HOME_JOURNEY,
  home_tailoring: DEFAULT_HOME_TAILORING,
  home_trust_bar: DEFAULT_HOME_TRUST_BAR,
  craftsmanship: DEFAULT_CRAFTSMANSHIP,
  explore: DEFAULT_EXPLORE_CONTENT,
};

// ─── SUPABASE CRUD ───────────────────────────────────────────────────────────

/**
 * Fetch a single site_content section by ID.
 * Returns the content JSON merged with defaults, or just defaults if not found.
 */
export async function fetchSiteContent(sectionId) {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', sectionId)
      .maybeSingle();

    if (error || !data) {
      return DEFAULTS_MAP[sectionId] || {};
    }
    // Deep merge: DB content overrides defaults
    const defaults = DEFAULTS_MAP[sectionId] || {};
    return { ...defaults, ...data.content };
  } catch (e) {
    // Table might not exist yet — silently fall back to defaults
    return DEFAULTS_MAP[sectionId] || {};
  }
}

/**
 * Fetch multiple site_content sections by a prefix (e.g. 'home_').
 * Returns an object keyed by section ID.
 */
export async function fetchAllSiteContent(prefix) {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('id, content')
      .like('id', `${prefix}%`);

    if (error || !data) {
      // Return all defaults for the prefix
      const result = {};
      for (const [key, val] of Object.entries(DEFAULTS_MAP)) {
        if (key.startsWith(prefix)) result[key] = val;
      }
      return result;
    }

    // Build result with defaults merged
    const result = {};
    for (const [key, val] of Object.entries(DEFAULTS_MAP)) {
      if (key.startsWith(prefix)) {
        const dbRow = data.find(d => d.id === key);
        result[key] = dbRow ? { ...val, ...dbRow.content } : val;
      }
    }
    return result;
  } catch (e) {
    console.error(`Failed to fetch site_content for prefix "${prefix}":`, e);
    const result = {};
    for (const [key, val] of Object.entries(DEFAULTS_MAP)) {
      if (key.startsWith(prefix)) result[key] = val;
    }
    return result;
  }
}

/**
 * Save (upsert) a site_content section.
 */
export async function saveSiteContent(sectionId, contentJson) {
  const { error } = await supabase
    .from('site_content')
    .upsert(
      { id: sectionId, content: contentJson, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    );

  if (error) {
    console.error(`Failed to save site_content for "${sectionId}":`, error);
    throw error;
  }
  return true;
}

/**
 * Save multiple sections at once.
 */
export async function saveMultipleSiteContent(sections) {
  const rows = Object.entries(sections).map(([id, content]) => ({
    id,
    content,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('site_content')
    .upsert(rows, { onConflict: 'id' });

  if (error) {
    console.error('Failed to save multiple site_content sections:', error);
    throw error;
  }
  return true;
}

/**
 * Get default content for a section.
 */
export function getDefaultContent(sectionId) {
  return DEFAULTS_MAP[sectionId] || {};
}
