import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, MessageCircle, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsNative } from '@/hooks/useIsNative';

const tabs = [
  { path: '/dashboard', icon: Home, label: 'Accueil' },
  { path: '/family', icon: Users, label: 'Famille' },
  { path: '/chat', icon: MessageCircle, label: 'ZÉNA' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
  { path: '/profile', icon: User, label: 'Profil' },
];

export function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isNative } = useIsNative();

  // Only show on mobile/native and authenticated pages
  const hiddenRoutes = ['/', '/auth', '/onboarding'];
  if (!isNative || hiddenRoutes.includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zena-night/95 backdrop-blur-lg border-t border-white/10 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors touch-target",
                isActive 
                  ? "text-[hsl(var(--zena-turquoise))]" 
                  : "text-gray-400 active:text-[hsl(var(--zena-violet))]"
              )}
            >
              <Icon className={cn(
                "h-6 w-6",
                isActive && "drop-shadow-[0_0_8px_rgba(78,205,196,0.6)]"
              )} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
