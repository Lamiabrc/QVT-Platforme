import { motion } from "framer-motion";
import { Brain, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConversationMemoryProps {
  keyPoints: string[];
  language?: "fr-FR" | "en-US";
}

export function ConversationMemory({ 
  keyPoints, 
  language = "fr-FR" 
}: ConversationMemoryProps) {
  const isFr = language === "fr-FR";

  if (!keyPoints || keyPoints.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="bg-card/50 backdrop-blur-sm border-secondary/30 shadow-soft">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-secondary" />
            <p className="text-sm font-medium text-foreground">
              {isFr ? "💭 Ce que je retiens" : "💭 What I remember"}
            </p>
          </div>

          <div className="space-y-2">
            {keyPoints.slice(0, 3).map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-2"
              >
                <Tag className="w-3 h-3 text-secondary mt-1 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {point}
                </p>
              </motion.div>
            ))}
          </div>

          {keyPoints.length > 3 && (
            <motion.div
              className="mt-3 pt-3 border-t border-border/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge variant="outline" className="text-xs">
                +{keyPoints.length - 3} {isFr ? "autres points" : "more points"}
              </Badge>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
