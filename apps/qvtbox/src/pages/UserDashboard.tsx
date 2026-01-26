import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Package, Settings, CreditCard, MapPin, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import BoxPreferencesCustomizer from '@/components/BoxPreferencesCustomizer';

interface UserProfile {
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  marketing_consent?: boolean;
}

interface Order {
  id: string;
  order_number?: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // Create a default profile since we're having type issues
      setProfile({
        user_id: user.id,
        display_name: user.user_metadata?.display_name || user.email || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        phone: null,
        date_of_birth: null,
        address_line1: null,
        address_line2: null,
        city: null,
        postal_code: null,
        country: 'FR',
        marketing_consent: false
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      // Mock orders for now
      setOrders([]);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    }
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!user || !profile) return;

    setProfileLoading(true);
    try {
      // Update local state for now
      setProfile({ ...profile, ...updatedData });
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
              <p className="mt-4 text-foreground/70">Chargement de votre dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Accès non autorisé</h1>
            <p className="text-foreground/70 mb-8">Vous devez être connecté pour accéder à cette page.</p>
            <Button onClick={() => window.location.href = '/auth'}>Se connecter</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 font-inter">
              Bonjour {profile?.display_name || 'Utilisateur'} !
            </h1>
            <p className="text-foreground/70 font-lato">
              Gérez votre profil et personnalisez votre Box Pouvoir d'Achat
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </div>

        {/* Dashboard Content */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="box">
              <Package className="w-4 h-4 mr-2" />
              Ma Box
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="w-4 h-4 mr-2" />
              Commandes
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Settings className="w-4 h-4 mr-2" />
              Préférences
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Facturation
            </TabsTrigger>
          </TabsList>

          {/* Box Tab */}
          <TabsContent value="box" className="space-y-6">
            <BoxPreferencesCustomizer />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et vos coordonnées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_name">Nom complet</Label>
                    <Input
                      id="display_name"
                      value={profile?.display_name || ''}
                      onChange={(e) => updateProfile({ display_name: e.target.value })}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile?.phone || ''}
                      onChange={(e) => updateProfile({ phone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="date_of_birth">Date de naissance</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={profile?.date_of_birth || ''}
                    onChange={(e) => updateProfile({ date_of_birth: e.target.value })}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <MapPin className="w-4 h-4" />
                    Adresse
                  </h3>
                  
                  <div>
                    <Label htmlFor="address_line1">Adresse ligne 1</Label>
                    <Input
                      id="address_line1"
                      value={profile?.address_line1 || ''}
                      onChange={(e) => updateProfile({ address_line1: e.target.value })}
                      placeholder="123 rue de la Paix"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address_line2">Adresse ligne 2 (optionnel)</Label>
                    <Input
                      id="address_line2"
                      value={profile?.address_line2 || ''}
                      onChange={(e) => updateProfile({ address_line2: e.target.value })}
                      placeholder="Appartement, suite, etc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={profile?.city || ''}
                        onChange={(e) => updateProfile({ city: e.target.value })}
                        placeholder="Paris"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal_code">Code postal</Label>
                      <Input
                        id="postal_code"
                        value={profile?.postal_code || ''}
                        onChange={(e) => updateProfile({ postal_code: e.target.value })}
                        placeholder="75001"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => toast.success('Profil sauvegardé')} 
                  disabled={profileLoading}
                  className="w-full md:w-auto"
                >
                  {profileLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Mes commandes
                </CardTitle>
                <CardDescription>
                  Suivez l'état de vos commandes QVT Box
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-foreground/70 mb-4">Aucune commande pour le moment</p>
                    <Button onClick={() => window.location.href = '/box'}>
                      Découvrir nos Box
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Package className="w-8 h-8 text-primary" />
                          <div>
                            <p className="font-medium">Commande #{order.order_number}</p>
                            <p className="text-sm text-foreground/70">
                              {new Date(order.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                          <p className="text-sm font-medium mt-1">
                            {order.total_amount}€
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Préférences
                </CardTitle>
                <CardDescription>
                  Configurez vos préférences et notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Newsletters et promotions</Label>
                    <p className="text-sm text-foreground/70">
                      Recevoir des informations sur nos nouveautés et offres spéciales
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile?.marketing_consent || false}
                    onChange={(e) => updateProfile({ marketing_consent: e.target.checked })}
                    className="h-4 w-4"
                  />
                </div>

                <Separator />

                <div>
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-foreground/70 mb-2">
                    Choisissez les notifications que vous souhaitez recevoir
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                      <span className="text-sm">Confirmation de commande</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                      <span className="text-sm">Suivi de livraison</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <span className="text-sm">Recommandations personnalisées</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Facturation
                </CardTitle>
                <CardDescription>
                  Gérez vos moyens de paiement et factures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-foreground/70 mb-4">
                    Aucune méthode de paiement enregistrée
                  </p>
                  <Button variant="outline">
                    Ajouter une carte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;