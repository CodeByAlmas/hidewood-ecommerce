export const DEFAULT_CATEGORY_SUB_MAP: Record<string, string[]> = {
  'Full-Grain Belts': ['Formal Dress Belts', 'Heavy Jeans 40mm', 'Raw Saddle Harness', 'Reversible Belts'],
  'Wallets & Carry': ['Slim Bifold Wallets', 'Cardholders', 'Field Backpacks', 'Travel Duffles', 'Leather Cases'],
  'Outerwear Atelier': ['Moto Jackets', 'Bomber Jackets', 'Field Coats'],
  'Welted Footwear': ['Service Derby Shoes', 'Oxford Dress Shoes', 'Raw Harness Slides', 'Boots'],
};

export const getStoredCategories = (): Record<string, string[]> => {
  if (typeof window === 'undefined') return DEFAULT_CATEGORY_SUB_MAP;
  try {
    const cached = localStorage.getItem('hidewood_categories_map');
    return cached ? JSON.parse(cached) : DEFAULT_CATEGORY_SUB_MAP;
  } catch {
    return DEFAULT_CATEGORY_SUB_MAP;
  }
};

export const saveStoredCategories = (data: Record<string, string[]>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hidewood_categories_map', JSON.stringify(data));
  window.dispatchEvent(new Event('hidewood_categories_updated'));
};