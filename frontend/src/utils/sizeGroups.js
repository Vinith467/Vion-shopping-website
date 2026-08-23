export const sizeGroups = {
  'XS - M': ['XS', 'S', 'M'],
  'L': ['L'],
  'XL - XXL': ['XL', 'XXL'],
  '3XL - 4XL': ['3XL', '4XL'],
  '5XL': ['5XL']
};

export function getSizeGroupArray(groupName) {
  if (!groupName) return [];
  
  // If the groupName is an exact key like 'XS - M'
  if (sizeGroups[groupName]) {
    return sizeGroups[groupName];
  }
  
  // If the user selected an individual size (e.g. 'S'), find which group it belongs to
  // and return that entire group array so they see all related products!
  for (const [key, sizesArr] of Object.entries(sizeGroups)) {
    if (sizesArr.includes(groupName)) {
      return sizesArr;
    }
  }
  
  return [groupName];
}

export function matchesSizeGroup(productSizesStr, groupName) {
  if (!groupName || groupName === 'all') return true;
  if (!productSizesStr) return false;
  
  const productSizes = productSizesStr.split(',').map(s => s.trim());
  if (productSizes.includes('all')) return true;
  
  const groupSizes = getSizeGroupArray(groupName);
  
  // If product has any size that is in the requested group, it's a match
  return productSizes.some(size => groupSizes.includes(size));
}

export function findBestMatchingVariation(variations, profile) {
  if (!variations || !variations.length || !profile) return null;
  
  const userSkinTone = profile.skinTone || profile.skin_tone;
  const userHeight = profile.height;
  const userSize = profile.size;
  const userSizeGroup = getSizeGroupArray(userSize);

  let bestMatch = null;
  let bestScore = -1;

  for (const v of variations) {
    let score = 0;
    
    // Check skin tone
    const varSkin = v.skinTone || v.skin_tone || 'all';
    if (varSkin === userSkinTone) score += 10;
    else if (varSkin === 'all') score += 5;
    else continue; // disqualifies
    
    // Check height
    let varHeights = v.heightRange || ['all'];
    if (!Array.isArray(varHeights)) varHeights = [varHeights];
    if (varHeights.includes(userHeight)) score += 10;
    else if (varHeights.includes('all')) score += 5;
    else continue; // disqualifies
    
    // Check size
    let varSizes = [];
    if (v.size_top) varSizes = varSizes.concat(Array.isArray(v.size_top) ? v.size_top : [v.size_top]);
    if (v.size_bottom) varSizes = varSizes.concat(Array.isArray(v.size_bottom) ? v.size_bottom : [v.size_bottom]);
    if (v.size) varSizes = varSizes.concat(Array.isArray(v.size) ? v.size : [v.size]);
    
    if (varSizes.some(s => userSizeGroup.includes(s))) score += 10;
    else if (varSizes.length === 0 || varSizes.includes('all')) score += 5;
    else continue; // disqualifies
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = v;
    }
  }
  
  return bestMatch;
}
