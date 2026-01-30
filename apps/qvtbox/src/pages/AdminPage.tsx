import React, { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { UserManagement } from "@/components/UserManagement";
import ContentEditor from "@/components/ContentEditor";
import Navigation from '@/components/Navigation';
import FloatingBubbles from '@/components/FloatingBubbles';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Package, Plus, Upload, Users, Shield, Home } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const { products, loading: productsLoading } = useProducts();
  const { categories } = useCategories();

  const [familyLoading, setFamilyLoading] = useState(false);
  const [familyStats, setFamilyStats] = useState({
    families: 0,
    members: 0,
    invites: 0,
    alerts: 0,
  });
  const [families, setFamilies] = useState<any[]>([]);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [familyInvites, setFamilyInvites] = useState<any[]>([]);
  const [familyAlerts, setFamilyAlerts] = useState<any[]>([]);
  
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    compare_at_price: '',
    origin: '',
    artisan_info: '',
    category_id: '',
    inventory_quantity: '0',
    is_featured: false
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: '0'
  });

  const loading = authLoading || roleLoading;

  useEffect(() => {
    if (isAdmin) {
      loadFamilyData();
    }
  }, [isAdmin]);

  const loadFamilyData = async () => {
    setFamilyLoading(true);
    try {
      const { data: familiesData } = await supabase
        .from("families")
        .select("id, name, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      const { data: membersData } = await supabase
        .from("family_members")
        .select("family_id, user_id, role, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      const { data: invitesData } = await supabase
        .from("family_invitations")
        .select("family_id, code, role, created_at, used_at, expires_at")
        .order("created_at", { ascending: false })
        .limit(100);

      const { data: alertsData } = await supabase
        .from("alerts")
        .select("family_id, category, severity, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      setFamilies(familiesData || []);
      setFamilyMembers(membersData || []);
      setFamilyInvites(invitesData || []);
      setFamilyAlerts(alertsData || []);
      setFamilyStats({
        families: familiesData?.length || 0,
        members: membersData?.length || 0,
        invites: invitesData?.length || 0,
        alerts: alertsData?.length || 0,
      });
    } catch (error) {
      toast({
        title: "Erreur Famille",
        description: "Impossible de charger les données famille.",
        variant: "destructive"
      });
    } finally {
      setFamilyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <FloatingBubbles />
        <div className="w-16 h-16 rounded-full bg-gradient-bubble animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <FloatingBubbles />
        <Navigation />
        <div className="relative z-10 pt-24 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-kalam font-bold text-foreground mb-6">
              Accès Restreint
            </h1>
            <p className="text-xl text-foreground/70 mb-8">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <Button onClick={() => window.location.href = "/connexion"}>
              Se connecter
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <FloatingBubbles />
        <Navigation />
        <div className="relative z-10 pt-24 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-kalam font-bold text-foreground mb-6">
              <Shield className="inline-block mr-2 h-8 w-8" />
              Accès Administrateur Requis
            </h1>
            <p className="text-xl text-foreground/70 mb-8">
              Vous devez être administrateur pour accéder à cette page.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          ...productForm,
          price: parseFloat(productForm.price),
          compare_at_price: productForm.compare_at_price ? parseFloat(productForm.compare_at_price) : null,
          inventory_quantity: parseInt(productForm.inventory_quantity),
          slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-')
        }]);

      if (error) throw error;

      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès."
      });

      setProductForm({
        name: '',
        slug: '',
        description: '',
        short_description: '',
        price: '',
        compare_at_price: '',
        origin: '',
        artisan_info: '',
        category_id: '',
        inventory_quantity: '0',
        is_featured: false
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit.",
        variant: "destructive"
      });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{
          ...categoryForm,
          sort_order: parseInt(categoryForm.sort_order),
          slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-')
        }]);

      if (error) throw error;

      toast({
        title: "Catégorie ajoutée",
        description: "La catégorie a été ajoutée avec succès."
      });

      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        sort_order: '0'
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <FloatingBubbles />
      <Navigation />
      
      <div className="relative z-10 pt-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-6">
              <Shield className="inline-block mr-3 h-10 w-10" />
              Administration
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Gérez votre boutique, vos utilisateurs et votre contenu
            </p>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Produits
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Catégories
              </TabsTrigger>
              <TabsTrigger value="add-product" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter Produit
              </TabsTrigger>
              <TabsTrigger value="cms" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                CMS
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="family" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Famille
              </TabsTrigger>
            </TabsList>

            <div className="mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900 dark:text-blue-100">
                    Nouveau CMS Disponible
                  </h3>
                </div>
                <p className="text-blue-700 dark:text-blue-200 text-sm mb-3">
                  Un nouveau système de gestion de contenu complet est maintenant disponible avec gestion des produits, pages, partenaires et plus.
                </p>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => window.open('/cms', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Accéder au nouveau CMS
                </Button>
              </div>
            </div>

            {/* Liste des produits */}
            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Produits existants</CardTitle>
                  <CardDescription>
                    Liste de tous les produits de la boutique
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {productsLoading ? (
                    <div className="text-center py-8">Chargement...</div>
                  ) : (
                    <div className="grid gap-4">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {product.price.toFixed(2)}€ - {product.origin}
                            </p>
                            {product.category && (
                              <Badge variant="secondary" className="mt-1">
                                {product.category.name}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Modifier
                            </Button>
                            <Button variant="destructive" size="sm">
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Liste des catégories */}
            <TabsContent value="categories" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Catégories existantes</CardTitle>
                  <CardDescription>
                    Gestion des catégories de produits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                          <Button variant="destructive" size="sm">
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Ajouter une catégorie</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="category-name">Nom</Label>
                              <Input
                                id="category-name"
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="category-slug">Slug (URL)</Label>
                              <Input
                                id="category-slug"
                                value={categoryForm.slug}
                                onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                                placeholder="Auto-généré si vide"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="category-description">Description</Label>
                            <Textarea
                              id="category-description"
                              value={categoryForm.description}
                              onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="category-sort">Ordre d'affichage</Label>
                            <Input
                              id="category-sort"
                              type="number"
                              value={categoryForm.sort_order}
                              onChange={(e) => setCategoryForm({...categoryForm, sort_order: e.target.value})}
                            />
                          </div>
                          <Button type="submit">Ajouter la catégorie</Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ajouter un produit */}
            <TabsContent value="add-product" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter un nouveau produit</CardTitle>
                  <CardDescription>
                    Remplissez les informations du produit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom du produit</Label>
                        <Input
                          id="name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                          id="slug"
                          value={productForm.slug}
                          onChange={(e) => setProductForm({...productForm, slug: e.target.value})}
                          placeholder="Auto-généré si vide"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="short_description">Description courte</Label>
                      <Input
                        id="short_description"
                        value={productForm.short_description}
                        onChange={(e) => setProductForm({...productForm, short_description: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description complète</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Prix (€)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="compare_at_price">Prix barré (€)</Label>
                        <Input
                          id="compare_at_price"
                          type="number"
                          step="0.01"
                          value={productForm.compare_at_price}
                          onChange={(e) => setProductForm({...productForm, compare_at_price: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="inventory_quantity">Stock</Label>
                        <Input
                          id="inventory_quantity"
                          type="number"
                          value={productForm.inventory_quantity}
                          onChange={(e) => setProductForm({...productForm, inventory_quantity: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="origin">Origine</Label>
                        <Input
                          id="origin"
                          value={productForm.origin}
                          onChange={(e) => setProductForm({...productForm, origin: e.target.value})}
                          placeholder="ex: Provence, France"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category_id">Catégorie</Label>
                        <Select value={productForm.category_id} onValueChange={(value) => setProductForm({...productForm, category_id: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="artisan_info">Informations artisan</Label>
                      <Textarea
                        id="artisan_info"
                        value={productForm.artisan_info}
                        onChange={(e) => setProductForm({...productForm, artisan_info: e.target.value})}
                        placeholder="Informations sur l'artisan créateur"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Ajouter le produit
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cms" className="space-y-6">
              <ContentEditor />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="family" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vue Famille</CardTitle>
                  <CardDescription>Données temps réel des familles et alertes</CardDescription>
                </CardHeader>
                <CardContent>
                  {familyLoading ? (
                    <div className="text-center py-8">Chargement...</div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="rounded-xl border p-4">
                        <div className="text-xs text-muted-foreground">Familles</div>
                        <div className="text-2xl font-semibold">{familyStats.families}</div>
                      </div>
                      <div className="rounded-xl border p-4">
                        <div className="text-xs text-muted-foreground">Membres</div>
                        <div className="text-2xl font-semibold">{familyStats.members}</div>
                      </div>
                      <div className="rounded-xl border p-4">
                        <div className="text-xs text-muted-foreground">Invitations</div>
                        <div className="text-2xl font-semibold">{familyStats.invites}</div>
                      </div>
                      <div className="rounded-xl border p-4">
                        <div className="text-xs text-muted-foreground">Alertes</div>
                        <div className="text-2xl font-semibold">{familyStats.alerts}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Familles récentes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {families.map((family) => (
                      <div key={family.id} className="flex items-center justify-between text-sm border-b pb-2">
                        <span className="font-medium">{family.name || family.id}</span>
                        <span className="text-muted-foreground">
                          {family.created_at ? new Date(family.created_at).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Invitations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {familyInvites.map((invite) => (
                      <div key={invite.code} className="flex items-center justify-between border-b pb-2">
                        <span className="font-medium">{invite.code}</span>
                        <span className="text-muted-foreground">{invite.role}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Membres</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {familyMembers.map((member) => (
                      <div key={`${member.family_id}-${member.user_id}`} className="flex items-center justify-between border-b pb-2">
                        <span className="font-medium">{member.user_id}</span>
                        <span className="text-muted-foreground">{member.role}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alertes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {familyAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between border-b pb-2">
                        <span className="font-medium">{alert.category || "Alerte"}</span>
                        <span className="text-muted-foreground">{alert.status || alert.severity || "—"}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPage;
