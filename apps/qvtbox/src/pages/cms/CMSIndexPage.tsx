import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Package, FileText, Users, TrendingUp, Eye, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CMSIndexPage = () => {
  const [stats, setStats] = useState({
    products: { total: 0, published: 0, draft: 0 },
    box: { total: 0, published: 0, draft: 0 },
    pages: { total: 0, published: 0, draft: 0 },
    partners: { pending: 0, approved: 0, rejected: 0 },
    media: { total: 0 },
    leads: { total: 0, thisMonth: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Products stats
        const { data: products } = await supabase
          .from('products')
          .select('statut');

        // Box stats
        const { data: box } = await supabase
          .from('box')
          .select('statut');

        // Pages stats
        const { data: pages } = await supabase
          .from('cms_pages')
          .select('statut');

        // Partners stats
        const { data: partners } = await supabase
          .from('cms_partners')
          .select('status');

        // Media stats
        const { data: media } = await supabase
          .from('media_library')
          .select('id', { count: 'exact', head: true });

        // Leads stats
        const { data: leads } = await supabase
          .from('leads_demo')
          .select('created_at');

        const thisMonth = new Date();
        thisMonth.setDate(1);
        const leadsThisMonth = leads?.filter(lead => 
          new Date(lead.created_at) >= thisMonth
        ).length || 0;

        setStats({
          products: {
            total: products?.length || 0,
            published: products?.filter(p => p.statut === 'published').length || 0,
            draft: products?.filter(p => p.statut === 'draft').length || 0
          },
          box: {
            total: box?.length || 0,
            published: box?.filter(b => b.statut === 'published').length || 0,
            draft: box?.filter(b => b.statut === 'draft').length || 0
          },
          pages: {
            total: pages?.length || 0,
            published: pages?.filter(p => p.statut === 'published').length || 0,
            draft: pages?.filter(p => p.statut === 'draft').length || 0
          },
          partners: {
            pending: partners?.filter(p => p.status === 'pending').length || 0,
            approved: partners?.filter(p => p.status === 'approved').length || 0,
            rejected: partners?.filter(p => p.status === 'rejected').length || 0
          },
          media: {
            total: media?.length || 0
          },
          leads: {
            total: leads?.length || 0,
            thisMonth: leadsThisMonth
          }
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Products Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products.total}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="default" className="text-xs">
                {stats.products.published} publiés
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {stats.products.draft} brouillons
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Box Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Box QVT</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.box.total}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="default" className="text-xs">
                {stats.box.published} publiées
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {stats.box.draft} brouillons
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pages Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pages.total}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="default" className="text-xs">
                {stats.pages.published} publiées
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {stats.pages.draft} brouillons
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Partners Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partenaires</CardTitle>
            <Users className="h-4 w-4 text-muted-forestground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.partners.approved}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {stats.partners.pending} en attente
              </Badge>
              <Badge variant="destructive" className="text-xs">
                {stats.partners.rejected} rejetés
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Leads Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leads.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.leads.thisMonth} ce mois-ci
            </p>
          </CardContent>
        </Card>

        {/* Media Library Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médias</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.media.total}</div>
            <p className="text-xs text-muted-foreground">
              Fichiers dans la bibliothèque
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Actions rapides
          </CardTitle>
          <CardDescription>
            Accès rapide aux fonctions les plus utilisées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4 text-center">
                <Package className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Nouveau produit</div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4 text-center">
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Nouvelle page</div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4 text-center">
                <Package className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Nouvelle box</div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Voir candidatures</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMSIndexPage;