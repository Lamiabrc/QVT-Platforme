// src/hooks/useScrollReveal.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  /** Révéler une seule fois puis désabonner (défaut: true) */
  once?: boolean;
  /** Root custom pour l'observer (si besoin) */
  root?: Element | Document | null;
  /** Valeur initiale (utile pour SSR) */
  initialVisible?: boolean;
}

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    root = null,
    initialVisible = false,
  } = options;

  const [isVisible, setIsVisible] = useState<boolean>(initialVisible);
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((el: HTMLElement | null) => {
    elementRef.current = el;
  }, []);

  useEffect(() => {
    if (!isBrowser) {
      // En SSR : on ne fait rien, on laisse la valeur initiale
      return;
    }
    const el = elementRef.current;
    if (!el) return;

    // Si IntersectionObserver indisponible (anciens navigateurs), on révèle immédiatement
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    // Nettoie tout observer précédent
    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin, root: (root as Element) ?? null }
    );

    observer.observe(el);
    observerRef.current = observer;

    return () => observerRef.current?.disconnect();
  }, [threshold, rootMargin, once, root]);

  return [setRef, isVisible] as const;
};

export const useStaggeredReveal = (itemCount: number, delay: number = 150) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  const setRef = useCallback((el: HTMLElement | null) => {
    elementRef.current = el;
  }, []);

  const prefersReducedMotion = useMemo(() => {
    if (!isBrowser || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (!isBrowser) return;
    const el = elementRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      // Pas d'observer → tout afficher instantanément
      setVisibleItems(new Set(Array.from({ length: itemCount }, (_, i) => i)));
      return;
    }

    // Reset éventuel
    timeoutsRef.current.forEach(id => window.clearTimeout(id));
    timeoutsRef.current = [];

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const effDelay = prefersReducedMotion ? 0 : Math.max(0, delay);

        for (let i = 0; i < itemCount; i++) {
          const id = window.setTimeout(() => {
            setVisibleItems(prev => {
              if (prev.has(i)) return prev;
              const next = new Set(prev);
              next.add(i);
              return next;
            });
          }, i * effDelay) as unknown as number;
          timeoutsRef.current.push(id);
        }

        observer.unobserve(entry.target);
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    observerRef.current = observer;

    return () => {
      observerRef.current?.disconnect();
      timeoutsRef.current.forEach(id => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [itemCount, delay, prefersReducedMotion]);

  // Si itemCount augmente après la révélation, on complète le set
  useEffect(() => {
    setVisibleItems(prev => {
      if (prev.size >= itemCount) return prev;
      const next = new Set(prev);
      for (let i = prev.size; i < itemCount; i++) next.add(i);
      return next;
    });
  }, [itemCount]);

  return [setRef, visibleItems] as const;
};
