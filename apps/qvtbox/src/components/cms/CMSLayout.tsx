import React, { useState } from 'react';
import { useCMSAuth } from '@/hooks/useCMSAuth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  BarChart3, 
  Package, 
  Tags, 
  Box, 
  FileText, 
  Layout, 
  Menu, 
  Image, 
  Users, 
  UserCheck, 
  Settings, 
  Search, 
  Globe, 
  CreditCard, 
  Truck, 
  Plug,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

interface CMSLayoutProps {
  children: React.ReactNode;
}

const CMSLayout: React.FC<CMSLayoutProps> = ({ children }) => {
  const { hasAccess, loading, isAdmin, isEditor, isCatalogManager, isPartnersManager, canManageSettings } = useCMSAuth();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-bubble animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-foreground/60 mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Connexion requise</h1>
          <p className="text-foreground/70 mb-6">Vous devez être connecté pour accéder au CMS.</p>
          <Button onClick={() => navigate('/auth')}>Se connecter</Button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-foreground/60 mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Accès non autorisé</h1>
          <p className="text-foreground/70 mb-6">Vous n'avez pas les permissions nécessaires pour accéder au CMS.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
            <Button variant="outline" onClick={() => signOut()}>Se déconnecter</Button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      group: 'Tableau de bord',
      items: [
        { icon: BarChart3, label: 'Vue d\'ensemble', href: '/cms', exact: true }
      ]
    },
    {
      group: 'Catalogue',
      items: [
        ...(isCatalogManager ? [
          { icon: Package, label: 'Produits', href: '/cms/products' },
          { icon: Tags, label: 'Catégories', href: '/cms/categories' },
          { icon: Box, label: 'Box', href: '/cms/box' }
        ] : [])
      ]
    },
    {
      group: 'Contenus (CMS)',
      items: [
        ...(isEditor ? [
          { icon: FileText, label: 'Pages', href: '/cms/pages' },
          { icon: Layout, label: 'Sections', href: '/cms/sections' },
          { icon: Menu, label: 'Menus', href: '/cms/menus' },
          { icon: Image, label: 'Images', href: '/cms/images' },
          { icon: Image, label: 'Médias', href: '/cms/media' }
        ] : [])
      ]
    },
    {
      group: 'Partenaires',
      items: [
        ...(isPartnersManager ? [
          { icon: Users, label: 'Candidatures', href: '/cms/partners/applications' },
          { icon: UserCheck, label: 'Partenaires validés', href: '/cms/partners/approved' }
        ] : [])
      ]
    },
    {
      group: 'Administration',
      items: [
        ...(canManageSettings ? [
          { icon: Users, label: 'Utilisateurs & Rôles', href: '/cms/users' },
          { icon: Settings, label: 'Paramètres', href: '/cms/settings' },
          { icon: Search, label: 'SEO & Référencement', href: '/cms/seo' },
          { icon: Globe, label: 'Mentions OCDE', href: '/cms/mentions' },
          { icon: CreditCard, label: 'Paiements & TVA', href: '/cms/payments' },
          { icon: Truck, label: 'Expéditions', href: '/cms/shipping' },
          { icon: Plug, label: 'Intégrations', href: '/cms/integrations' }
        ] : [])
      ]
    }
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="w-64 border-r border-border">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <img src="/qvt-box-logo.png" alt="QVT Box" className="h-8 w-8" />
              <span className="font-bold text-lg">QVT Box CMS</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Bonjour, {user.email?.split('@')[0]}
            </div>
          </div>

          <SidebarContent className="flex-1 overflow-auto">
            {menuItems.map((group) => (
              group.items.length > 0 && (
                <SidebarGroup key={group.group}>
                  <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive(item.href, item.exact)}
                          >
                            <NavLink 
                              to={item.href} 
                              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )
            ))}
          </SidebarContent>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Site
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signOut()}
                className="flex-1"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-14 flex items-center">
              <SidebarTrigger className="mr-4" />
              <div className="flex-1" />
            </div>
          </header>

          <main className="flex-1 container mx-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CMSLayout;