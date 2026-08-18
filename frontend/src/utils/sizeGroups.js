export const sizeGroups = {
  'XS - M': ['XS', 'S', 'M'],
  'L': ['L'],
  'XL - XXL': ['XL', 'XXL'],
  '3XL - 4XL': ['3XL', '4XL'],
  '5XL': ['5XL']
};

export function getSizeGroupArray(groupName) {
  if (!groupName) return [];
  return sizeGroups[groupName] || [groupName];
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
