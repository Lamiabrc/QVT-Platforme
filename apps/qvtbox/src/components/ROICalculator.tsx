import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

export const ROICalculator = () => {
  const [employees, setEmployees] = useState(50);
  const [avgSalary, setAvgSalary] = useState(45000);
  const [currentTurnover, setCurrentTurnover] = useState(15);
  const [currentAbsenteeism, setCurrentAbsenteeism] = useState(8);
  const [results, setResults] = useState<any>(null);

  const calculateROI = () => {
    // Coûts actuels
    const turnoverCost = (employees * (currentTurnover / 100) * avgSalary * 0.8); // 80% du salaire pour remplacer
    const absenteeismCost = (employees * (currentAbsenteeism / 100) * avgSalary * 0.15); // 15% du salaire pour absentéisme
    const currentTotalCost = turnoverCost + absenteeismCost;

    // Améliorations avec QVT Box (basé sur études)
    const turnoverReduction = 0.35; // 35% de réduction
    const absenteeismReduction = 0.25; // 25% de réduction
    const productivityIncrease = 0.12; // 12% d'augmentation productivité

    // Nouveaux coûts après amélioration
    const newTurnoverCost = turnoverCost * (1 - turnoverReduction);
    const newAbsenteeismCost = absenteeismCost * (1 - absenteeismReduction);
    const productivityGain = employees * avgSalary * productivityIncrease;

    // Coût de la solution (estimation)
    const solutionCost = employees * 25 * 12; // 25€/mois/employé

    // Économies et ROI
    const totalSavings = (currentTotalCost - newTurnoverCost - newAbsenteeismCost) + productivityGain;
    const netBenefit = totalSavings - solutionCost;
    const roi = ((netBenefit / solutionCost) * 100);
    const paybackMonths = solutionCost / (totalSavings / 12);

    setResults({
      currentCost: Math.round(currentTotalCost),
      savings: Math.round(totalSavings),
      solutionCost: Math.round(solutionCost),
      netBenefit: Math.round(netBenefit),
      roi: Math.round(roi),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
      productivityGain: Math.round(productivityGain)
    });
  };

  useEffect(() => {
    calculateROI();
  }, [employees, avgSalary, currentTurnover, currentAbsenteeism]);

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-inter">
          <Calculator className="w-6 h-6 text-primary" />
          Calculateur de ROI
        </CardTitle>
        <p className="text-muted-foreground font-lato">
          Estimez le retour sur investissement de votre stratégie QVT
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="employees" className="font-inter">Nombre d'employés</Label>
            <Input
              id="employees"
              type="number"
              value={employees}
              onChange={(e) => setEmployees(Number(e.target.value))}
              min="1"
              max="10000"
            />
          </div>
          
          <div>
            <Label htmlFor="salary" className="font-inter">Salaire moyen annuel (€)</Label>
            <Input
              id="salary"
              type="number"
              value={avgSalary}
              onChange={(e) => setAvgSalary(Number(e.target.value))}
              min="20000"
              max="150000"
            />
          </div>
          
          <div>
            <Label htmlFor="turnover" className="font-inter">Taux de turnover actuel (%)</Label>
            <Input
              id="turnover"
              type="number"
              value={currentTurnover}
              onChange={(e) => setCurrentTurnover(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>
          
          <div>
            <Label htmlFor="absenteeism" className="font-inter">Taux d'absentéisme actuel (%)</Label>
            <Input
              id="absenteeism"
              type="number"
              value={currentAbsenteeism}
              onChange={(e) => setCurrentAbsenteeism(Number(e.target.value))}
              min="0"
              max="50"
            />
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-background-soft rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-bold text-foreground font-inter mb-4">
              Résultats de votre analyse ROI
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-secondary/20">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-secondary font-inter">
                    {results.roi}%
                  </div>
                  <p className="text-sm text-muted-foreground font-lato">ROI Annuel</p>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary font-inter">
                    {results.paybackMonths}
                  </div>
                  <p className="text-sm text-muted-foreground font-lato">Mois de retour</p>
                </CardContent>
              </Card>
              
              <Card className="border-accent/20">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent-foreground font-inter">
                    {(results.netBenefit / 1000).toFixed(0)}k€
                  </div>
                  <p className="text-sm text-muted-foreground font-lato">Bénéfice net</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-3 font-inter">Économies détaillées</h4>
                <div className="space-y-2 text-sm font-lato">
                  <div className="flex justify-between">
                    <span>Réduction turnover (-35%)</span>
                    <span className="text-secondary font-medium">
                      {Math.round(results.currentCost * 0.6 * 0.35 / 1000)}k€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Réduction absentéisme (-25%)</span>
                    <span className="text-secondary font-medium">
                      {Math.round(results.currentCost * 0.4 * 0.25 / 1000)}k€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gain productivité (+12%)</span>
                    <span className="text-secondary font-medium">
                      {Math.round(results.productivityGain / 1000)}k€
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-3 font-inter">Investissement</h4>
                <div className="space-y-2 text-sm font-lato">
                  <div className="flex justify-between">
                    <span>Solution QVT Box annuelle</span>
                    <span className="text-primary font-medium">
                      {Math.round(results.solutionCost / 1000)}k€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coût par employé/mois</span>
                    <span className="text-muted-foreground">25€</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">Basé sur études scientifiques</Badge>
              <Badge variant="outline">Méthodologie ANACT</Badge>
              <Badge variant="outline">Données moyennes secteur</Badge>
            </div>
            
            <Button className="w-full btn-primary font-inter" size="lg">
              <Users className="w-4 h-4 mr-2" />
              Planifier une démo personnalisée
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};