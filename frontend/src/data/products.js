const defaultDetails = {
  material: 'Premium Cotton Blend',
  careInstructions: 'Dry clean only.',
  origin: 'Made in Italy',
  macroImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  colors: [{ name: 'Black' }, { name: 'Navy' }],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  reviews: [
    { rating: 5, text: 'Absolutely perfect fit and quality!', author: 'Sarah J.' },
    { rating: 4, text: 'Great material, looks very professional.', author: 'Emily R.' }
  ]
};

export const products = [
  { id: 1, title: 'Black Classic Blazer', price: 4499, originalPrice: '5,000', discount: '10% off', image: '/product1_model.jpg', fitScore: 98, tag: 'HIGH MATCH', category: 'Formal', matchReason: 'Flattering on Hourglass body shapes', ...defaultDetails },
  { id: 2, title: 'Essential Black Blazer', price: 3999, originalPrice: '4,500', discount: '11% off', image: '/product2.jpg', fitScore: 95, tag: 'NEW IN', category: 'Formal', matchReason: 'Flattering on Hourglass body shapes', ...defaultDetails },
  { id: 3, title: 'Beige Silk Blouse', price: 2899, originalPrice: '3,499', discount: '17% off', image: '/product3.jpg', fitScore: 92, tag: 'ELEGANT', category: 'Formal', matchReason: 'Flattering on Hourglass body shapes', ...defaultDetails },
  { id: 4, title: 'Black Peplum Top', price: 4299, originalPrice: '4,999', discount: '14% off', image: '/product4.jpg', fitScore: 90, tag: 'TRENDING', category: 'Formal', matchReason: 'Flattering on Hourglass body shapes', ...defaultDetails },
  { id: 5, title: 'Navy Blue Tunic', price: 3199, originalPrice: '3,800', discount: '15% off', image: '/product5.jpg', fitScore: 88, tag: 'CLASSIC', category: 'Formal', matchReason: 'Flattering on Hourglass body shapes', ...defaultDetails },
  { id: 6, title: 'White Button-Down Shirt', price: 1999, originalPrice: '2,500', discount: '20% off', image: '/product6.jpg', fitScore: 85, tag: 'CASUAL', category: 'Formal', matchReason: 'Flattering on Hourglass body shapes', ...defaultDetails },
  { id: 7, title: 'Navy Belted Blouse', price: 3499, originalPrice: '4,200', discount: '16% off', image: '/product7.jpg', fitScore: 94, tag: 'NEW IN', category: 'Formal', matchReason: 'Flattering on Hourglass body shapes', ...defaultDetails }
];

export const userProfile = {
  name: "Priya Sharma",
  height: "5'5\"",
  bodyType: "Hourglass",
  age: 28,
  avatar: "https://i.pravatar.cc/150?u=priya"
};

export const categories = [
  { id: 'for-you', name: 'For You', icon: 'star' },
  { id: 'new-in', name: 'New In' },
  { id: 'dresses', name: 'Dresses' },
  { id: 'tops', name: 'Tops' },
  { id: 'co-ords', name: 'Co-ords' },
  { id: 'sarees', name: 'Sarees' },
  { id: 'party-wear', name: 'Party Wear' },
];
