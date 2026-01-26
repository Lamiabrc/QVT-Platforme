import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Image as ImageIcon, 
  Plus, 
  Search, 
  Trash2, 
  Copy,
  Download,
  Upload
} from 'lucide-react';
import { useImageStorage } from '@/hooks/useImageStorage';
import { useToast } from '@/hooks/use-toast';

const ImagesPage = () => {
  const { images, loading, uploading, uploadImage, deleteImage } = useImageStorage();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      await uploadImage(files[i]);
    }
  };

  const handleCopyUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiée",
      description: `L'URL de ${name} a été copiée dans le presse-papiers.`,
    });
  };

  const handleDelete = async (imageName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'image "${imageName}" ?`)) {
      return;
    }
    await deleteImage(imageName);
  };

  const formatFileSize = (size: number) => {
    if (size === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Gestion des images</h1>
        </div>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="upload-images"
          />
          <Button asChild disabled={uploading}>
            <label htmlFor="upload-images" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Upload en cours...' : 'Uploader des images'}
            </label>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Rechercher dans les images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par nom d'image..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {filteredImages.length} image(s) trouvée(s)
          </div>
        </CardContent>
      </Card>

      {/* Images Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Galerie d'images</CardTitle>
          <CardDescription>
            Gérez vos images, copiez leurs URLs et organisez votre médiathèque
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Chargement des images...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Aucune image trouvée pour cette recherche' : 'Aucune image uploadée'}
              </p>
              <div className="relative inline-block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="upload-first-images"
                />
                <Button asChild>
                  <label htmlFor="upload-first-images" className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    Uploader vos premières images
                  </label>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={image.publicUrl} 
                      alt={image.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm truncate" title={image.name}>
                        {image.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {image.metadata.mimetype}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatFileSize(image.metadata.size)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Créé le {new Date(image.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopyUrl(image.publicUrl, image.name)}
                          className="flex-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(image.publicUrl, '_blank')}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(image.name)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImagesPage;