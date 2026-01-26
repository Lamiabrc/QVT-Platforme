import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🧭 Bottom Navigation Bar – Mobile-first
 * ----------------------------------------------------------
 * Navigation native mobile avec 4 onglets principaux
 */
export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      icon: Home,
      label: "Accueil",
      labelEn: "Home"
    },
    {
      path: "/zena-chat",
      icon: MessageCircle,
      label: "ZÉNA",
      labelEn: "ZÉNA"
    },
    {
      path: "/qsh",
      icon: Shield,
      label: "QSH",
      labelEn: "QSH"
    },
    {
      path: "/dashboard",
      icon: User,
      label: "Moi",
      labelEn: "Me"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors rounded-lg",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-all",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
