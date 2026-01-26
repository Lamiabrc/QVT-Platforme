import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Image, 
  Upload, 
  Search, 
  Filter, 
  Trash2, 
  Download,
  Grid,
  List,
  Plus,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MediaFile {
  id: string;
  fichier_url: string;
  alt: string;
  width: number | null;
  height: number | null;
  type: string;
  uploaded_by: string | null;
  created_at: string;
}

const MediaPage = () => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les médias.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Upload to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('content-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('content-images')
          .getPublicUrl(fileName);

        // Get image dimensions if it's an image
        let width = null;
        let height = null;
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          await new Promise((resolve) => {
            img.onload = () => {
              width = img.width;
              height = img.height;
              resolve(null);
            };
          });
        }

        // Save to database
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            fichier_url: urlData.publicUrl,
            alt: file.name.split('.')[0], // Default alt text
            width,
            height,
            type: file.type
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Succès",
        description: `${files.length} fichier(s) téléchargé(s) avec succès.`,
      });

      fetchMedia();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement des fichiers.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (mediaId: string, fileUrl: string) => {
    try {
      // Extract file path from URL
      const fileName = fileUrl.split('/').pop();
      if (fileName) {
        // Delete from storage
        await supabase.storage
          .from('content-images')
          .remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', mediaId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Fichier supprimé avec succès.",
      });

      fetchMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du fichier.",
        variant: "destructive"
      });
    }
  };

  const updateAltText = async (mediaId: string, newAlt: string) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .update({ alt: newAlt })
        .eq('id', mediaId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Texte alternatif mis à jour.",
      });

      fetchMedia();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du texte alternatif.",
        variant: "destructive"
      });
    }
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.fichier_url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type.startsWith(typeFilter);
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type === 'application/pdf') return '📄';
    return '📁';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Bibliothèque médias</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Plus className="h-4 w-4 mr-2" />
            {uploading ? 'Téléchargement...' : 'Télécharger'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Zone de téléchargement
          </CardTitle>
          <CardDescription>
            Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Cliquez pour télécharger ou glissez vos fichiers</p>
            <p className="text-sm text-muted-foreground">
              Images, vidéos, audio, PDF acceptés (max 10MB par fichier)
            </p>
          </div>
        </CardContent>
      </Card>

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
                  placeholder="Rechercher par nom ou URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Tous les types</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
              <option value="audio">Audio</option>
              <option value="application">Documents</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredMedia.length} fichier(s) trouvé(s)
            </div>
            {selectedFiles.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm">{selectedFiles.length} sélectionné(s)</span>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFiles([])}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      <Card>
        <CardHeader>
          <CardTitle>Fichiers médias</CardTitle>
          <CardDescription>
            Gérez votre bibliothèque de médias
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Chargement des médias...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-8">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun fichier trouvé</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="aspect-square border rounded-lg overflow-hidden bg-muted">
                    {item.type.startsWith('image/') ? (
                      <img
                        src={item.fichier_url}
                        alt={item.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {getFileTypeIcon(item.type)}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button variant="secondary" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteMedia(item.id, item.fichier_url)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium truncate">{item.alt}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.type.split('/')[1]?.toUpperCase()}
                      </Badge>
                      {item.width && item.height && (
                        <span className="text-xs text-muted-foreground">
                          {item.width}×{item.height}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                  <div className="w-16 h-16 border rounded overflow-hidden bg-muted flex-shrink-0">
                    {item.type.startsWith('image/') ? (
                      <img
                        src={item.fichier_url}
                        alt={item.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {getFileTypeIcon(item.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.alt}</div>
                    <div className="text-sm text-muted-foreground truncate">{item.fichier_url}</div>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                      {item.width && item.height && (
                        <span className="text-xs text-muted-foreground">
                          {item.width} × {item.height}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteMedia(item.id, item.fichier_url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;