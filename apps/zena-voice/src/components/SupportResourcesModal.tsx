import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SupportResource {
  id: string;
  resource_type: string;
  name: string;
  phone?: string;
  url?: string;
  description: string;
}

interface SupportResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: SupportResource[];
  language?: "fr-FR" | "en-US";
}

export function SupportResourcesModal({ 
  isOpen, 
  onClose, 
  resources,
  language = "fr-FR" 
}: SupportResourcesModalProps) {
  const isFr = language === "fr-FR";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="w-full max-w-lg bg-white shadow-2xl relative">
              {/* Animation de cœur pulsant */}
              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="bg-primary rounded-full p-4 shadow-glow">
                  <Heart className="w-8 h-8 text-white fill-white" />
                </div>
              </motion.div>

              {/* Header */}
              <div className="p-6 pb-4 border-b border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 right-4 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>

                <h2 className="text-2xl font-bold text-center mb-2 text-primary">
                  {isFr ? "Tu n'es pas seul(e) 💜" : "You're not alone 💜"}
                </h2>
                <p className="text-sm text-center text-muted-foreground">
                  {isFr 
                    ? "Je sens que tu traverses un moment difficile. Voici des personnes qui peuvent t'aider :"
                    : "I sense you're going through a difficult time. Here are people who can help:"}
                </p>
              </div>

              {/* Resources */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {resources.map((resource, i) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 hover:border-primary/40 transition-colors">
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">
                          {resource.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          {resource.description}
                        </p>
                        
                        <div className="flex gap-2">
                          {resource.phone && (
                            <Button
                              variant="default"
                              size="sm"
                              asChild
                              className="flex-1"
                            >
                              <a href={`tel:${resource.phone}`}>
                                <Phone className="w-3 h-3 mr-1" />
                                {resource.phone}
                              </a>
                            </Button>
                          )}
                          
                          {resource.url && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="flex-1"
                            >
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {isFr ? "Site web" : "Website"}
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-border bg-muted/30">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {isFr ? "🔒 100% Confidentiel" : "🔒 100% Confidential"}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
