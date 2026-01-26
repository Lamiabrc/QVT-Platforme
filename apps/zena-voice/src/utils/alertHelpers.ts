import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export function getAlertLevelColor(level: string): BadgeVariant {
  switch (level.toLowerCase()) {
    case "critique":
      return "destructive";
    case "élevé":
      return "default";
    case "modéré":
      return "secondary";
    default:
      return "outline";
  }
}

export function getAlertTypeLabel(type: string): string {
  const normalized = type.toLowerCase();
  const labels: Record<string, string> = {
    burnout: "Burnout",
    démotivation: "Démotivation",
    demotivation: "Démotivation",
    isolement_social: "Isolement",
    surcharge: "Surcharge",
    conflits_valeurs: "Conflits de valeurs",
  };
  return labels[normalized] || type;
}
