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
