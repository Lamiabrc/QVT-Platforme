import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, Globe, CreditCard, Truck, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Setting {
  key: string;
  value: string;
  description: string;
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_settings')
        .select('key, value, description');

      if (error) throw error;

      const settingsMap: Record<string, Setting> = {};
      data?.forEach(item => {
        settingsMap[item.key] = {
          key: item.key,
          value: typeof item.value === 'string' ? item.value : JSON.stringify(item.value),
          description: item.description || ''
        };
      });

      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value
      }
    }));
  };

  const saveSetting = async (key: string) => {
    try {
      setSaving(true);
      const setting = settings[key];
      if (!setting) return;

      const { error } = await supabase
        .from('cms_settings')
        .upsert({
          key,
          value: setting.value.startsWith('"') ? setting.value : `"${setting.value}"`,
          description: setting.description
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Paramètre sauvegardé avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le paramètre.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveAllSettings = async () => {
    try {
      setSaving(true);
      const updates = Object.values(settings).map(setting => ({
        key: setting.key,
        value: setting.value.startsWith('"') ? setting.value : `"${setting.value}"`,
        description: setting.description
      }));

      const { error } = await supabase
        .from('cms_settings')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tous les paramètres ont été sauvegardés."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Paramètres</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const getValue = (key: string) => {
    const setting = settings[key];
    if (!setting) return '';
    const value = setting.value;
    // Remove quotes if present
    return value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Paramètres</h1>
        </div>
        <Button onClick={saveAllSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder tout'}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="commerce">Commerce</TabsTrigger>
          <TabsTrigger value="ctas">CTAs</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Paramètres généraux
              </CardTitle>
              <CardDescription>
                Configuration générale du site et de la marque
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="logo">URL du logo</Label>
                <Input
                  id="logo"
                  value={getValue('branding.logo_url')}
                  onChange={(e) => updateSetting('branding.logo_url', e.target.value)}
                  placeholder="/qvt-box-logo.png"
                />
                <div className="text-sm text-muted-foreground">
                  URL du logo principal du site
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cgv">URL des CGV</Label>
                <Input
                  id="cgv"
                  value={getValue('legal.cgv_url')}
                  onChange={(e) => updateSetting('legal.cgv_url', e.target.value)}
                  placeholder="/cgv"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacy">URL de la politique de confidentialité</Label>
                <Input
                  id="privacy"
                  value={getValue('legal.privacy_url')}
                  onChange={(e) => updateSetting('legal.privacy_url', e.target.value)}
                  placeholder="/politique-confidentialite"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ocde_message">Message OCDE personnalisable</Label>
                <Textarea
                  id="ocde_message"
                  value={getValue('content.ocde_message')}
                  onChange={(e) => updateSetting('content.ocde_message', e.target.value)}
                  placeholder="Nous privilégions le Made in France et les producteurs locaux..."
                  rows={3}
                />
                <div className="text-sm text-muted-foreground">
                  Ce message apparaît dans la section "Transparence d'origine"
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Paramètres SEO
              </CardTitle>
              <CardDescription>
                Configuration par défaut pour le référencement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="seo_title">Titre SEO par défaut</Label>
                <Input
                  id="seo_title"
                  value={getValue('seo.default_title')}
                  onChange={(e) => updateSetting('seo.default_title', e.target.value)}
                  placeholder="QVT Box - Solutions bien-être en entreprise"
                  maxLength={60}
                />
                <div className="text-sm text-muted-foreground">
                  Maximum 60 caractères. Utilisé quand aucun titre spécifique n'est défini.
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">Description SEO par défaut</Label>
                <Textarea
                  id="seo_description"
                  value={getValue('seo.default_description')}
                  onChange={(e) => updateSetting('seo.default_description', e.target.value)}
                  placeholder="Découvrez nos box QVT pour améliorer le bien-être au travail..."
                  maxLength={160}
                  rows={3}
                />
                <div className="text-sm text-muted-foreground">
                  Maximum 160 caractères. Utilisée quand aucune description spécifique n'est définie.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commerce Settings */}
        <TabsContent value="commerce">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Paramètres commerce
              </CardTitle>
              <CardDescription>
                Configuration des paiements et expéditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="free_threshold">Seuil de livraison gratuite (en centimes)</Label>
                <Input
                  id="free_threshold"
                  type="number"
                  value={getValue('shipping.free_threshold_cents')}
                  onChange={(e) => updateSetting('shipping.free_threshold_cents', e.target.value)}
                  placeholder="5000"
                />
                <div className="text-sm text-muted-foreground">
                  Montant minimum pour la livraison gratuite (5000 = 50€)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Settings */}
        <TabsContent value="ctas">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des CTAs</CardTitle>
              <CardDescription>
                Configuration des liens des boutons d'action principaux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cta_evaluate">Lien "Évaluer mes besoins"</Label>
                <Input
                  id="cta_evaluate"
                  value={getValue('ctas.evaluate.href')}
                  onChange={(e) => updateSetting('ctas.evaluate.href', e.target.value)}
                  placeholder="/simulateur"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta_demo">Lien "Demander une démo"</Label>
                <Input
                  id="cta_demo"
                  value={getValue('ctas.demo.href')}
                  onChange={(e) => updateSetting('ctas.demo.href', e.target.value)}
                  placeholder="/contact"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta_partner">Lien "Devenir partenaire"</Label>
                <Input
                  id="cta_partner"
                  value={getValue('ctas.partner.href')}
                  onChange={(e) => updateSetting('ctas.partner.href', e.target.value)}
                  placeholder="/partenaires"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;