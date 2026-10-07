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
    badge: 'Series 01 // Limited Run',
    category: 'Full-Grain Steerhide 38mm',
    tagline: 'Single-slab Tuscan bovine cut with solid molten sand-cast brass buckle.',
    description:
      'Forged from single-origin English bridle hide. Hot-stuffed with tallow and beeswax to lock internal bovine collagen fibers against elongation. Hand-slicked beveled edges burnished to a glassy friction seal.',
    inStock: true,
    stockCount: 14,
    hideOrigin: 'Santa Croce sull’Arno, Tuscany, Italy',
    thickness: '4.2mm Unsplit Solid Hide (10–11 oz)',
    hardware: 'Solid Sand-Cast Molten Brass (185g)',
    tannage: '100% Organic Mimosa & Chestnut Tannin Bark',
    threadSpec: 'Braided Bonded Poly-Cord (Hand saddle-locked)',
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
    badge: 'Archive 2026 // Bespoke',
    category: 'Dress Silhouette 32mm',
    tagline: 'Precision profile with graphite beveled edge for bespoke charcoal tailoring.',
    description:
      'Ultra-refined profile tailored specifically for formal suiting. Surface features a subtle matte satin hand-feel that drinks atmospheric moisture and evolves an obsidian lustre.',
    inStock: true,
    stockCount: 8,
    hideOrigin: 'Arzignano Calfskin, Italy',
    thickness: '3.4mm Hand-Skived Profile',
    hardware: 'Brushed Surgical-Grade Stainless Steel',
    tannage: 'Dual Organic Tannage Barrel Steep',
    threadSpec: 'Fil Au Chinois Waxed French Linen',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    slug: 'heritage-raw-saddle',
    name: 'Heritage Raw Saddle',
    price: 6999,
    badge: 'Vault Item // Sold Out',
    category: 'Heavy Harness 40mm',
    tagline: 'Natural untreated pale hide engineered to record personal movement patina.',
    description:
      'Raw untreated vegetable-tanned bovine butt. Zero pigment coat, zero surface lacquer. Starts as pale oat-ochre and transitions to dark caramel and deep tea-core mahogany over 365 days of body warmth.',
    inStock: false,
    stockCount: 0,
    hideOrigin: 'Pisa Tannery Lot #402',
    thickness: '4.5mm Heavy Harness Butt',
    hardware: 'Hand-Peened Copper Hardware',
    tannage: 'Slow Pit Tannage (60 Days)',
    threadSpec: '0.8mm Hand Waxed Harness Cord',
    images: [
      '/HeirloomValut.png',
      '/BodyAcclimation.png',
    ],
  },
];