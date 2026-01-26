// src/hooks/useProductSearch.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from './useProducts';

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  origin?: string;
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  tags?: string[];

  // ✅ ajouts non-cassants
  page?: number;        // 1-based
  pageSize?: number;    // défaut 24
  debounceMs?: number;  // défaut 250ms
  matchAllTags?: boolean; // AND (true) / OR (false, défaut)
}

export const useProductSearch = (filters: SearchFilters = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // meta pour la pagination
  const [total, setTotal] = useState<number | null>(null);

  const debounceMs = filters.debounceMs ?? 250;
  const pageSize = Math.max(1, filters.pageSize ?? 24);
  const page = Math.max(1, filters.page ?? 1);

  const hasAnyFilter = useMemo(
    () => Object.values({ ...filters, page: undefined, pageSize: undefined, debounceMs: undefined })
      .some(v => v !== undefined && v !== ''),
    [filters]
  );

  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    abortRef.current.aborted = false;
    return () => {
      abortRef.current.aborted = true;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        // Jointure catégorie : !inner seulement si on filtre par catégorie
        const categoryJoin = filters.category
          ? 'category:categories!inner(name,slug)'
          : 'category:categories(name,slug)';

        // with count for pagination
        let query = supabase
          .from('products')
          .select(
            `
            *,
            ${categoryJoin},
            images:product_images(*),
            variants:product_variants(*),
            reviews:product_reviews(*),
            tags:product_tags(*)
          `,
            { count: 'exact' }
          )
          .eq('is_active', true);

        // Recherche plein texte
        if (filters.query) {
          query = query.textSearch('search_vector', filters.query, {
            type: 'websearch',
            config: 'french',
          });
        }

        // Filtre catégorie (⚠️ filtrer sur la table source, pas l'alias)
        if (filters.category) {
          query = query.eq('categories.slug', filters.category);
        }

        // Plage de prix
        if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice);
        if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);

        // Note moyenne
        if (filters.rating !== undefined) query = query.gte('average_rating', filters.rating);

        // Origine
        if (filters.origin) query = query.ilike('origin', `%${filters.origin}%`);

        // Tri
        switch (filters.sortBy) {
          case 'name':
            query = query.order('name', { ascending: true, nullsFirst: true });
            break;
          case 'price_asc':
            query = query.order('price', { ascending: true, nullsFirst: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false, nullsFirst: false });
            break;
          case 'rating':
            query = query.order('average_rating', { ascending: false, nullsFirst: false });
            break;
          case 'newest':
          default:
            query = query.order('created_at', { ascending: false, nullsFirst: false });
            break;
        }

        // Pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;
        if (abortRef.current.aborted) return;
        if (error) throw error;

        // Normalisation client (ordre, filtres secondaires)
        let formatted: Product[] =
          data?.map((product: any) => ({
            ...product,
            images: product.images?.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) || [],
            variants:
              product.variants?.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) || [],
            reviews:
              product.reviews
                ?.filter((r: any) => r.is_approved)
                .sort(
                  (a: any, b: any) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                ) || [],
            tags: product.tags || [],
          })) || [];

        // Filtre tags côté client (OR par défaut / AND si matchAllTags)
        if (filters.tags && filters.tags.length > 0) {
          const wanted = filters.tags.map(t => t.toLowerCase());
          formatted = formatted.filter(p => {
            const pTags: string[] = (p.tags || []).map((t: any) => String(t.tag || '').toLowerCase());
            if (filters.matchAllTags) {
              return wanted.every(w => pTags.some(t => t.includes(w)));
            }
            return wanted.some(w => pTags.some(t => t.includes(w)));
          });
        }

        setProducts(formatted);
        setTotal(typeof count === 'number' ? count : null);
      } catch (err: any) {
        if (abortRef.current.aborted) return;
        setError(err?.message ?? 'Une erreur est survenue');
        setProducts([]);
        setTotal(null);
      } finally {
        if (!abortRef.current.aborted) setLoading(false);
      }
    };

    // Debounce pour éviter les rafales de requêtes
    if (timerRef.current) window.clearTimeout(timerRef.current);

    if (hasAnyFilter) {
      timerRef.current = window.setTimeout(run, debounceMs) as unknown as number;
    } else {
      // pas de filtres -> on vide (comportement existant)
      setProducts([]);
      setTotal(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // dépendances utiles
    filters.query,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
    filters.origin,
    filters.sortBy,
    (filters.tags || []).join('|'),
    filters.matchAllTags,
    page,
    pageSize,
    debounceMs,
    hasAnyFilter,
  ]);

  const pageCount =
    total !== null ? Math.max(1, Math.ceil(total / pageSize)) : null;
  const hasMore = pageCount !== null ? page < pageCount : false;

  const refetch = () => {
    // change a tiny dep to forcer l’effet; ici on passe par setState noop
    setProducts(p => [...p]);
  };

  return { products, loading, error, total, page, pageSize, pageCount, hasMore, refetch };
};

/* =========================
   Options de filtres dispo
   ========================= */

export const useSearchFilters = () => {
  const [origins, setOrigins] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });

  useEffect(() => {
    abortRef.current.aborted = false;
    return () => {
      abortRef.current.aborted = true;
    };
  }, []);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);

        // Origines distinctes
        const { data: originsData, error: oErr } = await supabase
          .from('products')
          .select('origin')
          .eq('is_active', true)
          .not('origin', 'is', null);
        if (oErr) throw oErr;
        if (!abortRef.current.aborted) {
          const unique = [...new Set((originsData || []).map(p => p.origin).filter(Boolean))] as string[];
          setOrigins(unique);
        }

        // Min / Max prix (simple et fiable)
        const { data: priceData, error: pErr } = await supabase
          .from('products')
          .select('price')
          .eq('is_active', true)
          .order('price', { ascending: true });
        if (pErr) throw pErr;
        if (!abortRef.current.aborted) {
          if (priceData && priceData.length > 0) {
            setPriceRange({
              min: priceData[0].price,
              max: priceData[priceData.length - 1].price,
            });
          } else {
            setPriceRange({ min: 0, max: 0 });
          }
        }

        // Tags populaires
        const { data: tagsData, error: tErr } = await supabase
          .from('product_tags')
          .select(`
            tag,
            products!inner(is_active)
          `)
          .eq('products.is_active', true);
        if (tErr) throw tErr;
        if (!abortRef.current.aborted) {
          const counts = (tagsData || []).reduce((acc: Record<string, number>, it: any) => {
            const k = String(it.tag || '').trim();
            if (!k) return acc;
            acc[k] = (acc[k] || 0) + 1;
            return acc;
          }, {});
          const popular = Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20)
            .map(([tag]) => tag);
          setTags(popular);
        }
      } catch (e) {
        if (!abortRef.current.aborted) {
          // silencieux; tu peux ajouter un toast ici si besoin
          setOrigins([]);
          setTags([]);
          setPriceRange({ min: 0, max: 0 });
        }
      } finally {
        if (!abortRef.current.aborted) setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  return { origins, priceRange, tags, loading };
};
