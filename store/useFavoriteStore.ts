'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  badge?: string;
  category: string;
  image: string;
  spec?: string;
}

interface FavoriteStore {
  items: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      items: [],
      addFavorite: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        if (!exists) {
          set({ items: [item, ...get().items] });
        }
      },
      removeFavorite: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      isFavorite: (id) => {
        return get().items.some((i) => i.id === id);
      },
      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: 'hidewood_favorites_vault',
    }
  )
);