import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Scale, Lightbulb, Activity } from "lucide-react";
import { blogArticles } from "@/data/blogArticles";
import { legalContents } from "@/data/legalContents";
import { healthTips } from "@/data/healthTips";

/**
 * 🌸 Wellness Hub – Centre de ressources QVT
 * ----------------------------------------------------------
 * Bibliothèque de contenus éducatifs : articles, lois, tips
 */
export default function WellnessHub() {
  // Prendre les 3 derniers articles
  const featuredArticles = blogArticles.slice(0, 3);
  // Prendre 3 textes de loi aléatoires
  const featuredLegal = legalContents.slice(0, 3);
  // Prendre 4 tips aléatoires
  const featuredTips = healthTips.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-secondary/5 pb-20 md:pb-6">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Centre de bien-être</h1>
              <p className="text-sm text-muted-foreground">Votre bibliothèque QVT</p>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm">
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Section Articles de blog */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Articles bien-être</h2>
              <p className="text-sm text-muted-foreground">Guides pratiques pour votre QVT</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <img 
                  src={article.thumbnail} 
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">{article.readTime} min</span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription>{article.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Par {article.author}</span>
                    <Button variant="link" className="p-0 h-auto">
                      Lire →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button variant="outline">Voir tous les articles ({blogArticles.length})</Button>
          </div>
        </section>

        {/* Section Textes de loi */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Scale className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Cadre légal QVT</h2>
              <p className="text-sm text-muted-foreground">Connaissez vos droits</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLegal.map((legal) => (
              <Card key={legal.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{legal.category}</Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {legal.title}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-primary">
                    {legal.reference}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{legal.summary}</p>
                  <Button variant="link" className="p-0 h-auto">
                    Lire le texte complet →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button variant="outline">Voir tous les textes ({legalContents.length})</Button>
          </div>
        </section>

        {/* Section Health Tips */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Conseils santé express</h2>
              <p className="text-sm text-muted-foreground">Tips rapides pour votre quotidien</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTips.map((tip) => (
              <Card key={tip.id} className="hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-br from-background to-secondary/5">
                <CardHeader className="pb-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{tip.shortDescription}</p>
                  <Badge variant="outline" className="text-xs">
                    {tip.frequency === "daily" ? "Quotidien" : tip.frequency === "hourly" ? "Toutes les heures" : "Hebdomadaire"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button variant="outline">Voir tous les conseils ({healthTips.length})</Button>
          </div>
        </section>

        {/* Section Outils interactifs */}
        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Outils interactifs</h2>
              <p className="text-sm text-muted-foreground">Évaluez et suivez votre bien-être</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Test Burnout</CardTitle>
                <CardDescription>Évaluez votre niveau d'épuisement professionnel</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Faire le test</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Check-list vacances</CardTitle>
                <CardDescription>Préparez votre déconnexion sereinement</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Commencer</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Baromètre stress</CardTitle>
                <CardDescription>Check-in quotidien de votre état émotionnel</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Check-in du jour</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
