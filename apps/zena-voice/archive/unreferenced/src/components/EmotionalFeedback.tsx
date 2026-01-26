import { motion } from "framer-motion";
import { Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EmotionalFeedbackProps {
  score: number;
  language?: "fr-FR" | "en-US";
  onFeedback?: (helpful: boolean) => void;
}

export function EmotionalFeedback({ 
  score, 
  language = "fr-FR",
  onFeedback
}: EmotionalFeedbackProps) {
  const isFr = language === "fr-FR";
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const getMessage = () => {
    if (score > 12) {
      return isFr 
        ? "✨ Je suis heureuse de voir que tu te sens bien ! Continue comme ça." 
        : "✨ I'm happy to see you're feeling good! Keep it up.";
    } else if (score > 8) {
      return isFr 
        ? "💙 Tu traverses quelques nuages, mais tu restes fort(e). Je suis là." 
        : "💙 You're going through some clouds, but you're staying strong. I'm here.";
    } else if (score > 5) {
      return isFr 
        ? "🤍 Je sens que c'est difficile en ce moment. Tu n'es pas seul(e)." 
        : "🤍 I sense it's difficult right now. You're not alone.";
    } else {
      return isFr 
        ? "💜 Tu traverses une tempête. Je suis là pour t'accompagner, pas à pas." 
        : "💜 You're going through a storm. I'm here to walk with you, step by step.";
    }
  };

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(true);
    onFeedback?.(helpful);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 overflow-hidden relative">
        {/* Animation de cœur qui bat */}
        <motion.div
          className="absolute top-2 right-2"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-5 h-5 text-primary/30 fill-primary/20" />
        </motion.div>

        <div className="p-4">
          <p className="text-sm text-foreground leading-relaxed mb-3">
            {getMessage()}
          </p>

          {!feedbackGiven ? (
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground flex-1">
                {isFr ? "Ça t'aide ?" : "Is this helpful?"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback(true)}
                className="h-8 px-3"
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                {isFr ? "Oui" : "Yes"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback(false)}
                className="h-8 px-3"
              >
                <ThumbsDown className="w-4 h-4 mr-1" />
                {isFr ? "Non" : "No"}
              </Button>
            </div>
          ) : (
            <motion.p
              className="text-xs text-primary font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {isFr ? "✓ Merci pour ton retour 💜" : "✓ Thanks for your feedback 💜"}
            </motion.p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
