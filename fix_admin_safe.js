const fs = require('fs'); let content = fs.readFileSync('frontend/src/screens/admin/AdminInventory.jsx', 'utf8'); 
const handleSaveRegex = /(const finalCraftsmanshipFeatures = \\[\\];[\\s\\S]*?craftsmanship_features: finalCraftsmanshipFeatures,)/;
content = content.replace(handleSaveRegex, '');
const uiRegex = /\\{\\/\\* Craftsmanship Features \\*\\/\\}[\\s\\S]*?\\{\\/\\* Submit Button \\*\\/\\}/;
content = content.replace(uiRegex, '{/* Submit Button */}');
fs.writeFileSync('frontend/src/screens/admin/AdminInventory.jsx', content);
