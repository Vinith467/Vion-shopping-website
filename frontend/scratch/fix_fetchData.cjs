const fs = require('fs');

const file = 'src/screens/admin/AdminEditProduct.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace fetchData (lines 112-152)
const fetchDataStart = content.indexOf('  const fetchData = async () => {');
const handleCloseModalIndex = content.indexOf('  const handleCloseModal = () => {');
if (fetchDataStart !== -1 && handleCloseModalIndex !== -1) {
  content = content.slice(0, fetchDataStart) + `
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
      occasion_tags: prod.occasion_tags || [],
      target_skin_tones: prod.target_skin_tones || [],
      style_tags: prod.style_tags || [],
      target_body_shapes: prod.target_body_shapes?.length ? prod.target_body_shapes : ['Standard Fit'],
      suitability_points: prod.suitability_points || ['', '', ''],
      variations: prod.variations || [],
      craftsmanship_features: prod.craftsmanship_features || [],
      marketing_content: {
        hero: Array.isArray(prod.marketing_content?.hero) 
          ? prod.marketing_content.hero 
          : (prod.marketing_content?.hero ? [prod.marketing_content.hero] : []),
        showcases: prod.marketing_content?.showcases || []
      }
    });

    setProductVideo(prod?.video_url ? { type: 'existing', url: prod.video_url } : null);
    setSecondaryProductVideo(prod?.secondary_video_url ? { type: 'existing', url: prod.secondary_video_url } : null);

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
        initSpotlight.push({ type: 'existing', url: sUrls[i], label: \`Spotlight \${i+1}\` });
      } else {
        initSpotlight.push({ type: 'empty', label: \`Spotlight \${i+1}\` });
      }
    }
    setSpotlightImages(initSpotlight);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: catData } = await supabase.from('categories').select('id, name, slug');
      setCategories(catData || []);

      const { data: tagData } = await supabase.from('products').select('style_tags, occasion_tags');
      const uniqueStyleTags = new Set();
      const uniqueOccasionTags = new Set();
      (tagData || []).forEach(p => {
        if (Array.isArray(p.style_tags)) p.style_tags.forEach(t => uniqueStyleTags.add(t));
        if (Array.isArray(p.occasion_tags)) p.occasion_tags.forEach(t => uniqueOccasionTags.add(t));
      });
      setAvailableStyleTags(Array.from(uniqueStyleTags));
      setAvailableOccasionTags(Array.from(uniqueOccasionTags));

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
  };\n\n` + content.slice(handleCloseModalIndex);
}

// 2. Remove handleOpenModal and handleDuplicateProduct
const handleOpenModalIndex = content.indexOf('  const handleOpenModal = (prod = null) => {');
const handleSubmitIndex = content.indexOf('  const handleSubmit = async (e) => {');
if (handleOpenModalIndex !== -1 && handleSubmitIndex !== -1) {
  content = content.slice(0, handleOpenModalIndex) + content.slice(handleSubmitIndex);
}

fs.writeFileSync(file, content);
console.log('Done!');
