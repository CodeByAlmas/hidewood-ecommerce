export interface ProductDetail {
  slug: string;
  name: string;
  price: number;
  badge: string;
  category: string;
  tagline: string;
  description: string;
  inStock: boolean;
  stockCount?: number;
  hideOrigin: string;
  thickness: string;
  hardware: string;
  tannage: string;
  threadSpec: string;
  images: string[];
}

export const PRODUCTS_CATALOG: ProductDetail[] = [
  {
    slug: 'the-bridle-edition',
    name: 'The Bridle Edition',
    price: 5499,
    badge: 'Best Seller',
    category: 'Full-Grain 38mm Leather Belt',
    tagline: 'Solid full-grain leather belt with heavy solid brass buckle.',
    description:
      'Handcrafted from 100% thick, pure real leather. Infused with natural wax to ensure it never stretches, peels, or cracks over years of daily wear. Hand-beveled smooth edges guarantee a clean, comfortable fit with jeans and casual trousers.',
    inStock: true,
    stockCount: 14,
    hideOrigin: 'Tuscany, Italy',
    thickness: '4.2mm Thick Solid Leather',
    hardware: 'Solid Sand-Cast Brass (Heavyweight)',
    tannage: 'Natural Tree Bark Pit-Tanning (No Chemicals)',
    threadSpec: 'Heavy-Duty Reinforced Saddle Thread',
    images: [
      '/belt-macro.png',
      '/AtelierFresh.png',
      '/BodyAcclimation.png',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    slug: 'the-onyx-dress',
    name: 'The Onyx Dress',
    price: 6299,
    badge: 'Formal Classic',
    category: 'Dress 32mm Suiting Belt',
    tagline: 'Slim, elegant formal belt with matte steel buckle tailored for suits.',
    description:
      'Designed specifically for formal suits and dress trousers. Features a slim, comfortable profile with smooth hand-painted black edges that look sharp and sophisticated for office and evening wear.',
    inStock: true,
    stockCount: 8,
    hideOrigin: 'Italian Calfskin',
    thickness: '3.4mm Tailored Profile',
    hardware: 'Brushed Stainless Steel',
    tannage: 'Natural Smooth Tanned Leather',
    threadSpec: 'Fine French Waxed Linen Thread',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    slug: 'heritage-raw-saddle',
    name: 'Heritage Raw Saddle',
    price: 6999,
    badge: 'Sold Out',
    category: 'Heavy Jeans 40mm Belt',
    tagline: 'Untreated natural leather belt that gets darker with sunlight and wear.',
    description:
      'Cut from raw, untreated real leather. It starts out as a light tan color and naturally turns into a deep, rich caramel brown with daily friction, sunlight, and movement. Completely unique to each wearer.',
    inStock: false,
    stockCount: 0,
    hideOrigin: 'Pisa, Italy',
    thickness: '4.5mm Extra Heavy Leather',
    hardware: 'Solid Hand-Peened Copper Hardware',
    tannage: 'Traditional 60-Day Pit Tanning',
    threadSpec: 'Heavy Hand-Waxed Stitching',
    images: [
      '/HeirloomValut.png',
      '/BodyAcclimation.png',
    ],
  },
];