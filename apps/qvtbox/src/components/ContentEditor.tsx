import React, { useState } from 'react';
import { useEditableContent, type EditableContentItem } from '@/hooks/useEditableContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, 
  Save, 
  X, 
  Plus, 
  Type, 
  Image as ImageIcon, 
  Code, 
  Loader2,
  Upload
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ImageUpload';
import { ImageGallery } from '@/components/ImageGallery';
import type { StorageImage } from '@/hooks/useImageStorage';

interface ContentEditorProps {
  pageName?: string;
}

const ContentEditor = ({ pageName }: ContentEditorProps) => {
  const { contents, loading, updateContent, createContent } = useEditableContent(pageName);
  const [editingItem, setEditingItem] = useState<EditableContentItem | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [newContentForm, setNewContentForm] = useState({
    page_name: pageName || '',
    section_name: '',
    content_key: '',
    content_type: 'text',
    content_value: {},
    default_value: {},
    description: ''
  });

  const handleStartEdit = (item: EditableContentItem) => {
    setEditingItem(item);
    let displayValue = '';
    
    if (typeof item.content_value === 'object') {
      if (item.content_type === 'text' && item.content_value?.text) {
        displayValue = item.content_value.text;
      } else if (item.content_type === 'image' && item.content_value?.url) {
        displayValue = item.content_value.url;
        setSelectedImageUrl(item.content_value.url);
      } else {
        displayValue = JSON.stringify(item.content_value, null, 2);
      }
    } else {
      displayValue = item.content_value?.toString() || '';
    }
    
    setEditValue(displayValue);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    let valueToSave: any = editValue;
    
    if (editingItem.content_type === 'text') {
      // Pour le type text, on encapsule dans un objet JSON
      valueToSave = { text: editValue };
    } else if (editingItem.content_type === 'json') {
      try {
        valueToSave = JSON.parse(editValue);
      } catch (error) {
        alert('Format JSON invalide');
        return;
      }
    } else if (editingItem.content_type === 'image') {
      valueToSave = { url: selectedImageUrl || editValue };
    }

    await updateContent(editingItem.id, valueToSave);
    setEditingItem(null);
    setEditValue('');
    setSelectedImageUrl('');
  };

  const handleCreateContent = async () => {
    let contentValue: any = newContentForm.content_value;
    let defaultValue: any = newContentForm.default_value;

    if (newContentForm.content_type === 'text') {
      contentValue = { text: typeof contentValue === 'string' ? contentValue : '' };
      defaultValue = { text: typeof defaultValue === 'string' ? defaultValue : '' };
    } else if (newContentForm.content_type === 'image') {
      contentValue = { url: typeof contentValue === 'string' ? contentValue : '' };
      defaultValue = { url: typeof defaultValue === 'string' ? defaultValue : '' };
    } else if (newContentForm.content_type === 'json') {
      try {
        contentValue = typeof contentValue === 'string' ? JSON.parse(contentValue) : contentValue;
        defaultValue = typeof defaultValue === 'string' ? JSON.parse(defaultValue) : defaultValue;
      } catch (error) {
        alert('Format JSON invalide');
        return;
      }
    }

    await createContent({
      ...newContentForm,
      content_value: contentValue,
      default_value: defaultValue
    });

    // Reset form
    setNewContentForm({
      page_name: pageName || '',
      section_name: '',
      content_key: '',
      content_type: 'text',
      content_value: {},
      default_value: {},
      description: ''
    });
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'json': return <Code className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  const renderContentPreview = (item: EditableContentItem) => {
    if (item.content_type === 'image' && typeof item.content_value === 'object' && item.content_value?.url) {
      return (
        <img 
          src={item.content_value.url} 
          alt={item.content_key}
          className="w-20 h-20 object-cover rounded-lg border border-border"
        />
      );
    }

    let displayValue = '';
    if (typeof item.content_value === 'object') {
      if (item.content_value?.text) {
        displayValue = item.content_value.text;
      } else {
        displayValue = JSON.stringify(item.content_value);
      }
    } else {
      displayValue = item.content_value?.toString() || 'Vide';
    }

    return (
      <div className="text-sm text-muted-foreground max-w-xs truncate">
        {displayValue}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const groupedContents = contents.reduce((acc, item) => {
    const key = `${item.page_name}/${item.section_name}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, EditableContentItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Éditeur de Contenu</h2>
          <p className="text-muted-foreground">
            Gérez le contenu éditable de votre site
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Contenu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un nouveau contenu</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="page_name">Page</Label>
                <Input
                  id="page_name"
                  value={newContentForm.page_name}
                  onChange={(e) => setNewContentForm(prev => ({ ...prev, page_name: e.target.value }))}
                  placeholder="index, about, contact..."
                />
              </div>
              
              <div>
                <Label htmlFor="section_name">Section</Label>
                <Input
                  id="section_name"
                  value={newContentForm.section_name}
                  onChange={(e) => setNewContentForm(prev => ({ ...prev, section_name: e.target.value }))}
                  placeholder="hero, features, footer..."
                />
              </div>
              
              <div>
                <Label htmlFor="content_key">Clé du contenu</Label>
                <Input
                  id="content_key"
                  value={newContentForm.content_key}
                  onChange={(e) => setNewContentForm(prev => ({ ...prev, content_key: e.target.value }))}
                  placeholder="title, description, image_url..."
                />
              </div>
              
              <div>
                <Label htmlFor="content_type">Type</Label>
                <Select 
                  value={newContentForm.content_type} 
                  onValueChange={(value) => setNewContentForm(prev => ({ ...prev, content_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texte</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description (optionnel)</Label>
                <Input
                  id="description"
                  value={newContentForm.description}
                  onChange={(e) => setNewContentForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du contenu..."
                />
              </div>
              
              <Button onClick={handleCreateContent} className="w-full">
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedContents).map(([sectionKey, items]) => (
          <Card key={sectionKey} className="card-bubble">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                {sectionKey}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex items-center space-x-2">
                      {getContentTypeIcon(item.content_type)}
                      <Badge variant="secondary" className="text-xs">
                        {item.content_type}
                      </Badge>
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {item.content_key}
                      </div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      )}
                      <div className="mt-1">
                        {renderContentPreview(item)}
                      </div>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(item)}
                        className="ml-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Éditer: {item.content_key}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {item.content_type === 'image' ? (
                          <Tabs defaultValue="gallery" className="space-y-4">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="gallery">Galerie</TabsTrigger>
                              <TabsTrigger value="upload">Upload</TabsTrigger>
                              <TabsTrigger value="url">URL Manuelle</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="gallery" className="space-y-4">
                              <Label>Sélectionner depuis la galerie</Label>
                              <ImageGallery 
                                onImageSelect={(image: StorageImage) => {
                                  setSelectedImageUrl(image.publicUrl);
                                  setEditValue(image.publicUrl);
                                }}
                                selectable={true}
                                selectedImages={selectedImageUrl ? [selectedImageUrl.split('/').pop() || ''] : []}
                              />
                            </TabsContent>
                            
                            <TabsContent value="upload" className="space-y-4">
                              <Label>Uploader une nouvelle image</Label>
                              <ImageUpload 
                                onImageSelect={(imageUrl: string) => {
                                  setSelectedImageUrl(imageUrl);
                                  setEditValue(imageUrl);
                                }}
                              />
                            </TabsContent>
                            
                            <TabsContent value="url" className="space-y-4">
                              <Label>URL de l'image</Label>
                              <Input
                                value={editValue}
                                onChange={(e) => {
                                  setEditValue(e.target.value);
                                  setSelectedImageUrl(e.target.value);
                                }}
                                placeholder="https://example.com/image.jpg"
                              />
                              {editValue && (
                                <div className="mt-2">
                                  <img 
                                    src={editValue} 
                                    alt="Preview" 
                                    className="max-w-xs h-auto rounded border"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        ) : item.content_type === 'text' ? (
                          <div>
                            <Label>Contenu texte</Label>
                            <Textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={4}
                              className="w-full"
                            />
                          </div>
                        ) : (
                          <div>
                            <Label>Contenu JSON</Label>
                            <Textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={6}
                              className="w-full font-mono text-sm"
                              placeholder='{"key": "value"}'
                            />
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button variant="outline" onClick={() => {
                            setEditingItem(null);
                            setSelectedImageUrl('');
                          }}>
                            <X className="w-4 h-4 mr-2" />
                            Annuler
                          </Button>
                          <Button onClick={handleSaveEdit}>
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {contents.length === 0 && (
        <Card className="card-bubble">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun contenu éditable
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Commencez par créer du contenu éditable pour votre site
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentEditor;