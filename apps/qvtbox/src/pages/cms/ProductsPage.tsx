import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  prix_cents: number | null;
  origine: 'FR' | 'UE' | 'OCDE' | null;
  statut: 'draft' | 'published';
  stock: number;
  category?: {
    name: string;
  };
  created_at: string;
  published_at: string | null;
}

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          prix_cents,
          origine,
          statut,
          stock,
          created_at,
          published_at,
          category:categories(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.statut === statusFilter;
    const matchesOrigin = originFilter === 'all' || product.origine === originFilter;
    
    return matchesSearch && matchesStatus && matchesOrigin;
  });

  const handlePublish = async (productId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const updateData: any = { 
        statut: newStatus 
      };
      
      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Produit ${newStatus === 'published' ? 'publié' : 'mis en brouillon'}`,
      });

      fetchProducts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du produit.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" ?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Produit supprimé avec succès.",
      });

      fetchProducts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit.",
        variant: "destructive"
      });
    }
  };

  const getOriginBadge = (origin: string | null) => {
    switch (origin) {
      case 'FR':
        return <Badge className="bg-blue-100 text-blue-800">🇫🇷 France</Badge>;
      case 'UE':
        return <Badge className="bg-green-100 text-green-800">🇪🇺 Europe</Badge>;
      case 'OCDE':
        return <Badge className="bg-purple-100 text-purple-800">🌍 OCDE</Badge>;
      default:
        return <Badge variant="secondary">Non défini</Badge>;
    }
  };

  const formatPrice = (price: number, prixCents: number | null) => {
    if (prixCents !== null) {
      return `${(prixCents / 100).toFixed(2)}€`;
    }
    return `${price.toFixed(2)}€`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Gestion des produits</h1>
        </div>
        <Button onClick={() => navigate('/cms/products/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="published">Publiés</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
              </SelectContent>
            </Select>
            <Select value={originFilter} onValueChange={setOriginFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Origine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les origines</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="UE">Europe</SelectItem>
                <SelectItem value="OCDE">OCDE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} produit(s) trouvé(s)
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des produits</CardTitle>
          <CardDescription>
            Gérez vos produits, leur statut et leurs paramètres
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Chargement des produits...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Origine</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun produit trouvé</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            /{product.slug}
                          </div>
                          {product.category && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {product.category.name}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatPrice(product.price, product.prix_cents)}
                      </TableCell>
                      <TableCell>
                        {getOriginBadge(product.origine)}
                      </TableCell>
                      <TableCell>
                        <span className={`${product.stock <= 0 ? 'text-destructive' : ''}`}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.statut === 'published' ? 'default' : 'secondary'}
                        >
                          {product.statut === 'published' ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(product.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/product/${product.slug}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/cms/products/edit/${product.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/cms/products/new?copy=${product.id}`)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePublish(product.id, product.statut)}
                          >
                            {product.statut === 'published' ? 'Dépublier' : 'Publier'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;