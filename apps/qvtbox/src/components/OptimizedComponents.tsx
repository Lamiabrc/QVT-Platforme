import { lazy, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Lazy loading des composants lourds
export const LazyInteractiveDemo = lazy(() => import('./InteractiveDemo'));
export const LazyPricingSection = lazy(() => import('./PricingSection'));
export const LazyROICalculator = lazy(() => import('./ROICalculator').then(module => ({ default: module.ROICalculator })));
export const LazyBoxConfigurator = lazy(() => import('./BoxConfigurator').then(module => ({ default: module.BoxConfigurator })));
export const LazyAdvancedProductFilters = lazy(() => import('./AdvancedProductFilters').then(module => ({ default: module.AdvancedProductFilters })));

// Composant de loading général
export const ComponentLoader = ({ className = "h-64" }: { className?: string }) => (
  <Card className={`card-professional animate-pulse ${className}`}>
    <CardContent className="p-6">
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    </CardContent>
  </Card>
);

// HOC pour lazy loading avec fallback
export const withLazyLoading = (Component: React.ComponentType<any>, loaderHeight?: string) => {
  return (props: any) => (
    <Suspense fallback={<ComponentLoader className={loaderHeight} />}>
      <Component {...props} />
    </Suspense>
  );
};

// Preloader intelligent
export const usePreloadComponents = () => {
  const preloadComponent = (componentImport: () => Promise<any>) => {
    // Preload on hover or when likely to be needed
    componentImport().catch(() => {}); // Silently fail
  };

  return { preloadComponent };
};