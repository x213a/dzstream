import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { subscribeCategories, subscribeChannels } from '@/services/catalog';
import type { Category, Channel } from '@/types';

import { useAuth } from './AuthProvider';

interface CatalogContextValue {
  loading: boolean;
  error: Error | null;
  /** Chaînes visibles du public (actives et avec un flux). */
  channels: Channel[];
  /** Toutes les chaînes, y compris inactives (panneau d'administration). */
  allChannels: Channel[];
  categories: Category[];
  getChannel: (id: string) => Channel | undefined;
  getCategory: (id: string) => Category | undefined;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const [allChannels, setAllChannels] = useState<Channel[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const offChannels = subscribeChannels(setAllChannels, setError);
    const offCategories = subscribeCategories(setCategories, setError);
    return () => {
      offChannels();
      offCategories();
    };
  }, []);

  const value = useMemo<CatalogContextValue>(() => {
    const all = allChannels ?? [];
    const cats = categories ?? [];
    const channelMap = new Map(all.map((c) => [c.id, c]));
    const categoryMap = new Map(cats.map((c) => [c.id, c]));
    return {
      loading: allChannels === null || categories === null,
      error,
      channels: all.filter((c) => c.isActive && c.streamUrl),
      allChannels: all,
      categories: cats,
      // Les admins peuvent ouvrir une chaîne inactive pour tester son flux.
      getChannel: (id) => {
        const c = channelMap.get(id);
        return c && (isAdmin || (c.isActive && c.streamUrl)) ? c : undefined;
      },
      getCategory: (id) => categoryMap.get(id),
    };
  }, [allChannels, categories, error, isAdmin]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog doit être utilisé dans <CatalogProvider>');
  return ctx;
}
