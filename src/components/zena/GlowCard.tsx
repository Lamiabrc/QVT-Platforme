import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "turquoise" | "violet" | "rose";
}

export function GlowCard({ children, className, glowColor = "turquoise" }: GlowCardProps) {
  const glowClasses = {
    turquoise: "hover:shadow-[0_0_30px_rgba(64,224,208,0.3)]",
    violet: "hover:shadow-[0_0_30px_rgba(155,126,222,0.3)]",
    rose: "hover:shadow-[0_0_30px_rgba(255,182,217,0.3)]",
  };

  return (
    <Card className={cn(
      "transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm",
      glowClasses[glowColor],
      className
    )}>
      {children}
    </Card>
  );
}
