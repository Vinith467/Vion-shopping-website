const fs = require('fs');

const file = 'src/screens/admin/AdminEditProduct.jsx';
let content = fs.readFileSync(file, 'utf8');

// We will use regex to remove lines that contain these specific fields in the state and payload
const fieldsToRemove = [
  'target_body_shapes',
  'occasion_tags',
  'target_skin_tones',
  'style_tags',
  'suitability_points',
  'craftsmanship_features'
];

let lines = content.split('\n');
let newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if line contains any of the fields
  const hasField = fieldsToRemove.some(field => line.includes(field));
  
  if (hasField) {
    // Specifically, if it's derivedSkinTones calculation, we can remove it
    if (line.includes('const derivedSkinTones')) {
      continue;
    }
    // Also remove the uniqueStyleTags and uniqueOccasionTags stuff
    if (line.includes('uniqueStyleTags') || line.includes('uniqueOccasionTags') || line.includes('availableStyleTags') || line.includes('availableOccasionTags') || line.includes('setAvailableStyleTags') || line.includes('setAvailableOccasionTags')) {
      continue;
    }
    // If it's the tagData query
    if (line.includes("supabase.from('products').select('style_tags, occasion_tags')")) {
      continue;
    }
    // If it's one of the state initialization lines or payload lines
    if (line.match(/^\s*(target_body_shapes|occasion_tags|target_skin_tones|style_tags|suitability_points|craftsmanship_features):/)) {
      continue;
    }
    // If it's the finalCraftsmanshipFeatures calculation block
    if (line.includes('const finalCraftsmanshipFeatures')) {
      continue; // Wait, this might be multiple lines. Let's just drop it if we see it.
    }
  }

  // Handle multi-line block for unique tags
  if (line.includes('const uniqueStyleTags = new Set();')) {
    i += 7; // Skip the next 7 lines which are the logic for this
    continue;
  }
  
  if (line.includes('const [availableStyleTags, setAvailableStyleTags] = useState([]);')) {
    i += 1; // skip next line too
    continue;
  }

  if (line.includes('const derivedSkinTones = Array.from(')) {
    i += 4; // Skip the derived skin tones logic block
    continue;
  }
  
  if (line.includes('const finalCraftsmanshipFeatures = (formData.craftsmanship_features || [])')) {
    i += 2;
    continue;
  }

  newLines.push(line);
}

fs.writeFileSync(file, newLines.join('\n'));
console.log('Cleanup script finished.');
