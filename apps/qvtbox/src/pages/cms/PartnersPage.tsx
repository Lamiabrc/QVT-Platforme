import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye, 
  Mail,
  Phone,
  Globe,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Partner {
  id: string;
  societe: string;
  contact_nom: string;
  contact_email: string;
  contact_tel: string | null;
  site_web: string | null;
  type_offre: 'premium_fr_local' | 'standard_ocde';
  origine: 'FR' | 'UE' | 'OCDE';
  categories: string[] | null;
  description_courte: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const PartnersPage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('applications');
  const { toast } = useToast();

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les partenaires.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.societe.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.contact_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.contact_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
    const matchesType = typeFilter === 'all' || partner.type_offre === typeFilter;
    
    // Filter by tab
    if (activeTab === 'applications' && partner.status !== 'pending') return false;
    if (activeTab === 'approved' && partner.status !== 'approved') return false;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const updatePartnerStatus = async (partnerId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      const { error } = await supabase
        .from('cms_partners')
        .update({ status: newStatus })
        .eq('id', partnerId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Partenaire ${newStatus === 'approved' ? 'approuvé' : 'rejeté'} avec succès.`,
      });

      fetchPartners();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du partenaire.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">En attente</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-50 text-green-700">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'premium_fr_local':
        return <Badge className="bg-blue-100 text-blue-800">Premium FR/Local</Badge>;
      case 'standard_ocde':
        return <Badge className="bg-purple-100 text-purple-800">Standard OCDE</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getOriginBadge = (origin: string) => {
    switch (origin) {
      case 'FR':
        return <Badge className="bg-blue-100 text-blue-800">🇫🇷 France</Badge>;
      case 'UE':
        return <Badge className="bg-green-100 text-green-800">🇪🇺 Europe</Badge>;
      case 'OCDE':
        return <Badge className="bg-purple-100 text-purple-800">🌍 OCDE</Badge>;
      default:
        return <Badge variant="secondary">{origin}</Badge>;
    }
  };

  const pendingCount = partners.filter(p => p.status === 'pending').length;
  const approvedCount = partners.filter(p => p.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Gestion des partenaires</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">Candidatures en attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-sm text-muted-foreground">Partenaires approuvés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{partners.length}</div>
            <p className="text-sm text-muted-foreground">Total des candidatures</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="applications">
            Candidatures ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Partenaires approuvés ({approvedCount})
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card className="mt-6">
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
                    placeholder="Rechercher par société, nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Type d'offre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="premium_fr_local">Premium FR/Local</SelectItem>
                  <SelectItem value="standard_ocde">Standard OCDE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredPartners.length} partenaire(s) trouvé(s)
            </div>
          </CardContent>
        </Card>

        {/* Partners Lists */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Candidatures en attente</CardTitle>
              <CardDescription>
                Examinez et approuvez les nouvelles candidatures de partenaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Chargement des candidatures...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Société</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type d'offre</TableHead>
                      <TableHead>Origine</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Aucune candidature en attente</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPartners.map((partner) => (
                        <TableRow key={partner.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{partner.societe}</div>
                              {partner.description_courte && (
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {partner.description_courte}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{partner.contact_nom}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {partner.contact_email}
                              </div>
                              {partner.contact_tel && (
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {partner.contact_tel}
                                </div>
                              )}
                              {partner.site_web && (
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  <a href={partner.site_web} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    Site web
                                  </a>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTypeBadge(partner.type_offre)}
                          </TableCell>
                          <TableCell>
                            {getOriginBadge(partner.origine)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(partner.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => updatePartnerStatus(partner.id, 'approved')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => updatePartnerStatus(partner.id, 'rejected')}
                              >
                                <X className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Partenaires approuvés</CardTitle>
              <CardDescription>
                Liste des partenaires validés et actifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Chargement des partenaires...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Société</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type d'offre</TableHead>
                      <TableHead>Origine</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Aucun partenaire approuvé</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPartners.map((partner) => (
                        <TableRow key={partner.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{partner.societe}</div>
                              {partner.description_courte && (
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {partner.description_courte}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{partner.contact_nom}</div>
                              <div className="text-sm text-muted-foreground">
                                {partner.contact_email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTypeBadge(partner.type_offre)}
                          </TableCell>
                          <TableCell>
                            {getOriginBadge(partner.origine)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(partner.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updatePartnerStatus(partner.id, 'pending')}
                              >
                                Remettre en attente
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnersPage;