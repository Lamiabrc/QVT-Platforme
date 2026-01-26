// src/hooks/useProducts.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  value: string;
  variant_type: string;
  price_modifier: number;
  sku: string | null;
  inventory_quantity: number;
  is_active: boolean;
  sort_order: number;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductTag {
  id: string;
  product_id: string;
  tag: string;
  tag_type: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  origin: string | null;
  artisan_info: string | null;
  is_featured: boolean;
  category_id: string | null;
  inventory_quantity: number;
  average_rating: number;
  review_count: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  created_at: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  tags?: ProductTag[];
}

const mapProduct = (product: any): Product => ({
  ...product,
  images:
    product.images?.sort(
      (a: ProductImage, b: ProductImage) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    ) ?? [],
  variants:
    product.variants?.sort(
      (a: ProductVariant, b: ProductVariant) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    ) ?? [],
  reviews:
    product.reviews
      ?.filter((r: ProductReview) => r.is_approved)
      .sort(
        (a: ProductReview, b: ProductReview) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ) ?? [],
  tags: product.tags ?? [],
});

export const useProducts = (categorySlug?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Jointure catégorie : inner si on filtre sur le slug
      const categoryJoin = categorySlug
        ? 'category:categories!inner(name, slug)'
        : 'category:categories(name, slug)';

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
        `
        )
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (categorySlug) {
        // ⚠️ filtre sur la table liée (fonctionne avec !inner)
        query = query.eq('categories.slug', categorySlug);
      }

      const { data, error } = await query;
      if (abortRef.current.aborted) return;
      if (error) throw error;

      const formatted = (data ?? []).map(mapProduct);
      setProducts(formatted);
    } catch (err: any) {
      if (abortRef.current.aborted) return;
      setError(err?.message ?? 'Une erreur est survenue');
      setProducts([]);
    } finally {
      if (!abortRef.current.aborted) setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    abortRef.current.aborted = false;
    fetchProducts();

    return () => {
      abortRef.current.aborted = true;
    };
  }, [fetchProducts]);

  // Realtime: on rafraîchit la liste si un produit (ou ses relations) bouge
  useEffect(() => {
    // Nettoie l’abonnement précédent
    channelRef.current?.unsubscribe();

    // Si besoin, tu peux ajouter un filtre côté Postgres (ex: is_active), mais
    // on reste simple et on refetch à chaque changement.
    const channel = supabase
      .channel(`products-list-${categorySlug || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => fetchProducts()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_images' },
        () => fetchProducts()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_variants' },
        () => fetchProducts()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_reviews' },
        () => fetchProducts()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_tags' },
        () => fetchProducts()
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [fetchProducts, categorySlug]);

  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (abortRef.current.aborted) return;
      if (error) throw error;

      setCategories(data ?? []);
    } catch (err: any) {
      if (abortRef.current.aborted) return;
      setError(err?.message ?? 'Une erreur est survenue');
      setCategories([]);
    } finally {
      if (!abortRef.current.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    abortRef.current.aborted = false;
    fetchCategories();
    return () => {
      abortRef.current.aborted = true;
    };
  }, [fetchCategories]);

  // Realtime sur les catégories
  useEffect(() => {
    channelRef.current?.unsubscribe();

    const channel = supabase
      .channel('categories-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        () => fetchCategories()
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [fetchCategories]);

  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch };
};
