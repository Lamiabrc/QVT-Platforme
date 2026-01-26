import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface DUERPData {
  lastUpdate: string;
  riskAssessments: number;
  preventionMeasures: number;
  complianceScore: number;
}

const DUERPExport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  // Données simulées DUERP
  const duerpData: DUERPData = {
    lastUpdate: '2024-01-15',
    riskAssessments: 24,
    preventionMeasures: 18,
    complianceScore: 87
  };

  const riskCategories = [
    { name: 'Risques psychosociaux', count: 8, status: 'analyzed' },
    { name: 'Ergonomie et TMS', count: 6, status: 'in-progress' },
    { name: 'Environnement de travail', count: 4, status: 'analyzed' },
    { name: 'Organisation du travail', count: 6, status: 'analyzed' }
  ];

  const handleExport = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    
    try {
      // Simuler la génération du document
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler le téléchargement
      const blob = new Blob(['Document DUERP généré automatiquement'], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DUERP_${selectedPeriod}_${Date.now()}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "🎉 Export DUERP terminé !",
        description: `Votre document ${exportFormat.toUpperCase()} a été généré et téléchargé.`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible de générer le document. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return 'bg-green-500/20 text-green-700';
      case 'in-progress': return 'bg-orange-500/20 text-orange-700';
      case 'pending': return 'bg-red-500/20 text-red-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'analyzed': return 'Analysé';
      case 'in-progress': return 'En cours';
      case 'pending': return 'En attente';
      default: return 'Non défini';
    }
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-kalam text-xl">📋 Export DUERP Simplifié</CardTitle>
          <Badge className="bg-gradient-primary text-white">
            Conformité: {duerpData.complianceScore}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Statut du DUERP */}
        <div className="p-4 bg-white/5 rounded-xl">
          <h4 className="font-kalam text-lg text-foreground mb-3">📊 État du DUERP</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{duerpData.riskAssessments}</div>
              <div className="text-xs text-foreground/70">Évaluations des risques</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{duerpData.preventionMeasures}</div>
              <div className="text-xs text-foreground/70">Mesures de prévention</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{duerpData.complianceScore}%</div>
              <div className="text-xs text-foreground/70">Taux de conformité</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-foreground/50 text-center">
            Dernière mise à jour: {new Date(duerpData.lastUpdate).toLocaleDateString('fr-FR')}
          </div>
        </div>

        {/* Catégories de risques */}
        <div>
          <h4 className="font-kalam text-lg text-foreground mb-3">🛡️ Catégories analysées</h4>
          <div className="space-y-3">
            {riskCategories.map((category, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">{category.name}</div>
                  <div className="text-sm text-foreground/70">{category.count} points d'analyse</div>
                </div>
                <Badge className={getStatusColor(category.status)}>
                  {getStatusLabel(category.status)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Options d'export */}
        <div className="space-y-4">
          <h4 className="font-kalam text-lg text-foreground">📥 Générer le document</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-foreground/70 mb-2 block">Format d'export</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="bg-white/10 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">📄 PDF</SelectItem>
                  <SelectItem value="docx">📝 Word (.docx)</SelectItem>
                  <SelectItem value="xlsx">📊 Excel (.xlsx)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-foreground/70 mb-2 block">Période</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="bg-white/10 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Situation actuelle</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                  <SelectItem value="custom">Période personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Bouton d'export */}
        <div className="pt-4 border-t border-white/10">
          <Button 
            onClick={handleExport}
            disabled={isGenerating}
            className="w-full bg-gradient-primary hover:opacity-90 text-white"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Génération en cours...
              </>
            ) : (
              <>
                📋 Générer le DUERP {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
          
          <div className="mt-3 text-xs text-foreground/50 text-center">
            Document conforme au Code du travail (articles R4121-1 à R4121-4)
          </div>
        </div>

        {/* Informations légales */}
        <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-300/20">
          <h5 className="font-medium text-blue-700 mb-2">ℹ️ Informations importantes</h5>
          <ul className="text-xs text-blue-600/80 space-y-1">
            <li>• Le DUERP doit être mis à jour au minimum une fois par an</li>
            <li>• Toute modification de l'organisation doit être documentée</li>
            <li>• Les représentants du personnel doivent être consultés</li>
            <li>• Le document doit être accessible à tous les salariés</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DUERPExport;