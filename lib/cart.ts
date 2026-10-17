import { CartItem } from '@/components/CartDrawer';

const CART_STORAGE_KEY = 'hidewood_cart_items';

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cart_updated'));
  } catch (err) {
    console.error('Failed to sync cart storage', err);
  }
}