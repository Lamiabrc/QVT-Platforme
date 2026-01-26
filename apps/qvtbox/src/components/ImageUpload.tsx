import { useState, useRef, useCallback } from 'react';
import { Upload, X, Eye, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string, fileName: string) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

interface UploadedImage {
  url: string;
  name: string;
  path: string;
  size: number;
}

export const ImageUpload = ({ 
  onImageSelect, 
  maxSize = 5, 
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] 
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<UploadedImage | null> => {
    try {
      // Validate file
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Type de fichier non supporté",
          description: `Types acceptés: ${allowedTypes.join(', ')}`,
          variant: "destructive",
        });
        return null;
      }

      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: `Taille maximum: ${maxSize}MB`,
          variant: "destructive",
        });
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `content/${fileName}`;

      const { data, error } = await supabase.storage
        .from('content-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from('content-images')
        .getPublicUrl(data.path);

      const uploadedImage: UploadedImage = {
        url: publicUrl.publicUrl,
        name: file.name,
        path: data.path,
        size: file.size
      };

      setImages(prev => [...prev, uploadedImage]);
      
      toast({
        title: "Image uploadée avec succès",
        description: file.name,
      });

      return uploadedImage;
    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader l'image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleFiles = useCallback(async (files: FileList) => {
    setUploading(true);
    
    const uploadPromises = Array.from(files).map(file => uploadImage(file));
    await Promise.all(uploadPromises);
    
    setUploading(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const deleteImage = async (image: UploadedImage) => {
    try {
      const { error } = await supabase.storage
        .from('content-images')
        .remove([image.path]);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.path !== image.path));
      
      if (selectedImage?.path === image.path) {
        setSelectedImage(null);
      }

      toast({
        title: "Image supprimée",
        description: image.name,
      });
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer l'image",
        variant: "destructive",
      });
    }
  };

  const selectImage = (image: UploadedImage) => {
    setSelectedImage(image);
    onImageSelect(image.url, image.name);
  };

  return (
    <div className="space-y-4">
      {/* Zone de drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            Glissez vos images ici ou{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-medium"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              parcourez
            </Button>
          </p>
          <p className="text-sm text-muted-foreground">
            Types acceptés: JPEG, PNG, WebP, GIF - Max {maxSize}MB
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Upload en cours...</span>
          </div>
        </div>
      )}

      {/* Galerie d'images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-medium">Images uploadées</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card 
                key={image.path} 
                className={`relative group overflow-hidden cursor-pointer transition-all ${
                  selectedImage?.path === image.path ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => selectImage(image)}
              >
                <div className="aspect-square">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay avec actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectImage(image);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(image);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Nom du fichier */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-2">
                  <p className="text-xs truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs opacity-75">
                    {(image.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Image sélectionnée */}
      {selectedImage && (
        <Card className="p-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Image sélectionnée</Label>
            <div className="flex items-center space-x-3">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedImage.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedImage.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};