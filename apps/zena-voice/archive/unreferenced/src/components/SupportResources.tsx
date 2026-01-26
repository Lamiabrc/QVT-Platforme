import { motion } from "framer-motion";
import { Phone, ExternalLink, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SupportResource {
  id: string;
  resource_type: string;
  name: string;
  phone?: string;
  url?: string;
  description: string;
}

interface SupportResourcesProps {
  resources: SupportResource[];
  language?: "fr-FR" | "en-US";
}

export function SupportResources({ resources, language = "fr-FR" }: SupportResourcesProps) {
  if (!resources || resources.length === 0) return null;

  const isFr = language === "fr-FR";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-md mt-6"
    >
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm shadow-glow overflow-hidden relative">
        {/* Animation de fond pulsante */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <div className="bg-primary/20 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
            </motion.div>
            <div className="flex-1">
              <CardTitle className="text-lg text-primary">
                {isFr ? "💜 Ressources d'aide disponibles" : "💜 Support resources available"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {isFr 
                  ? "Tu n'es pas seul(e). Ces personnes peuvent t'aider."
                  : "You're not alone. These people can help you."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {resources.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-md">
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      {resource.resource_type === 'urgency' && <Phone className="w-4 h-4 text-red-600" />}
                      {resource.resource_type === 'internal' && <Phone className="w-4 h-4 text-primary" />}
                      {resource.resource_type === 'external' && <ExternalLink className="w-4 h-4 text-secondary" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-foreground mb-1">
                        {resource.name}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {resource.phone && (
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a href={`tel:${resource.phone}`}>
                          <Phone className="h-3 w-3 mr-1" />
                          {resource.phone}
                        </a>
                      </Button>
                    )}
                    
                    {resource.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {isFr ? "Site web" : "Website"}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Message de réassurance */}
          <motion.div
            className="mt-4 pt-4 border-t border-border/50 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
              <span>🔒</span>
              <span>{isFr ? "Toutes tes données restent anonymes" : "All your data remains anonymous"}</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
