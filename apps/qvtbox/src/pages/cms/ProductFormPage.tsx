import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, Save, ArrowLeft, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useImageStorage } from '@/hooks/useImageStorage';

interface ProductForm {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  prix_cents: number | null;
  origine: 'FR' | 'UE' | 'OCDE' | null;
  statut: 'draft' | 'published';
  stock: number;
  category_id: string | null;
  seo_keywords: string[];
}

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { uploadImage } = useImageStorage();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    price: 0,
    prix_cents: null,
    origine: null,
    statut: 'draft',
    stock: 0,
    category_id: null,
    seo_keywords: []
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setFormData({
        name: data.name || '',
        slug: data.slug || '',
        short_description: data.short_description || '',
        description: data.description || '',
        price: data.price || 0,
        prix_cents: data.prix_cents || null,
        origine: data.origine || null,
        statut: data.statut || 'draft',
        stock: data.stock || 0,
        category_id: data.category_id || null,
        seo_keywords: data.seo_keywords || []
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le produit.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (field: keyof ProductForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'name' && !isEdit) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug) {
      toast({
        title: "Erreur",
        description: "Le nom et le slug sont obligatoires.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: formData.name,
        slug: formData.slug,
        short_description: formData.short_description,
        description: formData.description,
        price: formData.price,
        prix_cents: formData.prix_cents,
        origine: formData.origine,
        statut: formData.statut,
        stock: formData.stock,
        category_id: formData.category_id,
        seo_keywords: formData.seo_keywords.filter(k => k.trim() !== ''),
        updated_at: new Date().toISOString()
      };

      let result;
      if (isEdit) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('products')
          .insert(productData);
      }

      if (result.error) throw result.error;

      toast({
        title: "Succès",
        description: `Produit ${isEdit ? 'mis à jour' : 'créé'} avec succès.`,
      });

      navigate('/cms/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erreur",
        description: `Impossible de ${isEdit ? 'mettre à jour' : 'créer'} le produit.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !formData.seo_keywords.includes(keyword.trim())) {
      setFormData(prev => ({
        ...prev,
        seo_keywords: [...prev.seo_keywords, keyword.trim()]
      }));
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seo_keywords: prev.seo_keywords.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/cms/products')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nom du produit"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="slug-produit"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="short_description">Description courte</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Description courte du produit..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Description complète</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description complète du produit..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Keywords</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.seo_keywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="cursor-pointer"
                    onClick={() => removeKeyword(index)}
                  >
                    {keyword} ×
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Ajouter un mot-clé (Entrée pour valider)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Statut</Label>
                <Select 
                  value={formData.statut} 
                  onValueChange={(value: 'draft' | 'published') => handleInputChange('statut', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prix et stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="prix_cents">Prix en centimes</Label>
                <Input
                  id="prix_cents"
                  type="number"
                  value={formData.prix_cents}
                  onChange={(e) => handleInputChange('prix_cents', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Catégorie et origine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Catégorie</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => handleInputChange('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Origine</Label>
                <Select 
                  value={formData.origine || ''} 
                  onValueChange={(value: 'FR' | 'UE' | 'OCDE') => handleInputChange('origine', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'origine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FR">🇫🇷 France</SelectItem>
                    <SelectItem value="UE">🇪🇺 Union Européenne</SelectItem>
                    <SelectItem value="OCDE">🌍 OCDE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations complémentaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fonctionnalité d'upload d'images disponible dans la section "Images".
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;