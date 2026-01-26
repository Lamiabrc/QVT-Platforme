// src/hooks/useImageStorage.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StorageImage {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag?: string;
    size?: number;
    mimetype?: string;
    cacheControl?: string;
    lastModified?: string;
    contentLength?: number;
    httpStatusCode?: number;
  };
  publicUrl: string;
}

type HookOptions = {
  /** Dossier interne du bucket (par défaut "content/") */
  folder?: string;
  /** Types MIME autorisés pour l’upload */
  allowedTypes?: string[];
  /** Taille max fichier en Mo (défaut 5) */
  maxSizeMB?: number;
  /** Utiliser des URLs signées par défaut (si bucket privé) */
  defaultSigned?: boolean;
  /** Durée des URLs signées en secondes (défaut 60) */
  signedExpiresIn?: number;
};

const BUCKET = 'content-images';
const DEFAULT_FOLDER = 'content';

const isBrowser = typeof window !== 'undefined';

const safeJoin = (folder: string, name: string) =>
  folder.replace(/\/+$/, '') + '/' + name.replace(/^\/+/, '');

const uniqueFileName = (original: string) => {
  const dot = original.lastIndexOf('.');
  const base = dot === -1 ? original : original.slice(0, dot);
  const ext = dot === -1 ? '' : original.slice(dot + 1);
  const slugBase = base
    .toLowerCase()
    .replace(/[^\w\d]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${slugBase}${ext ? '.' + ext : ''}`;
};

// Liste supportée par Supabase: 'name' | 'updated_at'
const LIST_SORT_COLUMN: 'name' | 'updated_at' = 'updated_at';

export const useImageStorage = (opts?: HookOptions) => {
  const {
    folder = DEFAULT_FOLDER,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSizeMB = 5,
    defaultSigned = false,
    signedExpiresIn = 60,
  } = opts || {};

  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const cancelledRef = useRef(false);

  const mapFile = useCallback(
    (file: any): StorageImage => {
      const path = safeJoin(folder, file.name);
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

      return {
        name: file.name,
        id: file.id || file.name,
        updated_at: file.updated_at || new Date().toISOString(),
        created_at: file.created_at || file.updated_at || new Date().toISOString(),
        last_accessed_at: file.last_accessed_at || file.updated_at || new Date().toISOString(),
        metadata: {
          eTag: file.metadata?.eTag,
          size: file.metadata?.size,
          mimetype: file.metadata?.mimetype,
          cacheControl: file.metadata?.cacheControl,
          lastModified: file.metadata?.lastModified ?? file.updated_at,
          contentLength: file.metadata?.contentLength ?? file.metadata?.size,
          httpStatusCode: file.metadata?.httpStatusCode,
        },
        publicUrl: pub.publicUrl,
      };
    },
    [folder]
  );

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const { data: files, error } = await supabase.storage.from(BUCKET).list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: LIST_SORT_COLUMN, order: 'desc' },
      });

      if (error) throw error;

      const mapped = (files || []).map(mapFile);
      if (!cancelledRef.current) setImages(mapped);
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de charger les images.",
        variant: 'destructive',
      });
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [folder, mapFile, toast]);

  const uploadImage = useCallback(
    async (file: File): Promise<StorageImage | null> => {
      try {
        setUploading(true);

        // Validation
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: 'Type de fichier non supporté',
            description: `Types acceptés: ${allowedTypes.join(', ')}`,
            variant: 'destructive',
          });
          return null;
        }

        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
          toast({
            title: 'Fichier trop volumineux',
            description: `Taille maximum: ${maxSizeMB}MB`,
            variant: 'destructive',
          });
          return null;
        }

        const fname = uniqueFileName(file.name);
        const path = safeJoin(folder, fname);

        const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

        if (error) throw error;

        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

        const nowIso = new Date().toISOString();
        const newImage: StorageImage = {
          name: fname,
          id: fname,
          updated_at: nowIso,
          created_at: nowIso,
          last_accessed_at: nowIso,
          metadata: {
            size: file.size,
            mimetype: file.type,
            cacheControl: 'max-age=3600',
            lastModified: nowIso,
            contentLength: file.size,
            httpStatusCode: 200,
          },
          publicUrl: pub.publicUrl,
        };

        setImages(prev => [newImage, ...prev]);

        toast({
          title: 'Image uploadée avec succès',
          description: file.name,
        });

        return newImage;
      } catch (error) {
        console.error('Erreur upload:', error);
        toast({
          title: "Erreur d'upload",
          description: "Impossible d'uploader l'image",
          variant: 'destructive',
        });
        return null;
      } finally {
        setUploading(false);
      }
    },
    [allowedTypes, folder, maxSizeMB, toast]
  );

  const deleteImage = useCallback(
    async (imageName: string): Promise<boolean> => {
      try {
        const path = safeJoin(folder, imageName);
        const { error } = await supabase.storage.from(BUCKET).remove([path]);
        if (error) throw error;

        setImages(prev => prev.filter(img => img.name !== imageName));

        toast({
          title: 'Image supprimée',
          description: imageName,
        });

        return true;
      } catch (error) {
        console.error('Erreur suppression:', error);
        toast({
          title: 'Erreur de suppression',
          description: "Impossible de supprimer l'image",
          variant: 'destructive',
        });
        return false;
      }
    },
    [folder, toast]
  );

  /** URL publique classique (bucket public) */
  const getImageUrl = useCallback(
    (imageName: string): string => {
      const path = safeJoin(folder, imageName);
      return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    },
    [folder]
  );

  /** URL signée temporaire (bucket privé) */
  const getSignedUrl = useCallback(
    async (imageName: string, expiresIn: number = signedExpiresIn): Promise<string | null> => {
      try {
        const path = safeJoin(folder, imageName);
        const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn);
        if (error) throw error;
        return data.signedUrl;
      } catch (e) {
        console.error('Erreur getSignedUrl:', e);
        return null;
      }
    },
    [folder, signedExpiresIn]
  );

  /** URL transformée (CDN Images activé sur le bucket) */
  const getTransformedUrl = useCallback(
    (imageName: string, transform?: { width?: number; height?: number; quality?: number; resize?: 'cover' | 'contain' }) => {
      const path = safeJoin(folder, imageName);
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path, {
        transform: transform
          ? {
              width: transform.width,
              height: transform.height,
              quality: transform.quality,
              resize: transform.resize,
            }
          : undefined,
      });
      return data.publicUrl;
    },
    [folder]
  );

  /** Renommer/déplacer un fichier (move) */
  const renameImage = useCallback(
    async (oldName: string, newName: string): Promise<boolean> => {
      try {
        const fromPath = safeJoin(folder, oldName);
        const toPath = safeJoin(folder, newName);
        const { error } = await supabase.storage.from(BUCKET).move(fromPath, toPath);
        if (error) throw error;

        // MAJ locale
        setImages(prev =>
          prev.map(img =>
            img.name === oldName
              ? { ...img, name: newName, publicUrl: supabase.storage.from(BUCKET).getPublicUrl(toPath).data.publicUrl }
              : img
          )
        );

        toast({ title: 'Image renommée', description: `${oldName} → ${newName}` });
        return true;
      } catch (e) {
        console.error('Erreur renameImage:', e);
        toast({ title: 'Erreur', description: "Impossible de renommer l'image", variant: 'destructive' });
        return false;
      }
    },
    [folder, toast]
  );

  /** Vérifier l'existence d’un nom (pour éviter les collisions de nom personnalisé) */
  const exists = useCallback(
    async (imageName: string): Promise<boolean> => {
      try {
        const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
          search: imageName, // supporté côté API
          limit: 1,
        } as any);
        if (error) throw error;
        return (data || []).some((f: any) => f.name === imageName);
      } catch {
        return false;
      }
    },
    [folder]
  );

  // Chargement initial
  useEffect(() => {
    cancelledRef.current = false;
    fetchImages();
    return () => {
      cancelledRef.current = true;
    };
  }, [fetchImages]);

  // Si on souhaite des URLs signées par défaut, on peut remplacer les publicUrl lors du mapping
  useEffect(() => {
    if (!defaultSigned) return;
    // Remplace les URLs publiques par des signées en mémoire (optionnel, non bloquant)
    (async () => {
      const updated = await Promise.all(
        images.map(async img => {
          const signed = await getSignedUrl(img.name);
          return signed ? { ...img, publicUrl: signed } : img;
        })
      );
      if (!cancelledRef.current) setImages(updated);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSigned]); // une seule passe si activé

  return {
    images,
    loading,
    uploading,
    uploadImage,
    deleteImage,
    getImageUrl,
    /** nouveaux utilitaires (sans casser l’existant) */
    getSignedUrl,
    getTransformedUrl,
    renameImage,
    exists,
    refetch: fetchImages,
  };
};
