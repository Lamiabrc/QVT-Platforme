import { Button } from "@/components/ui/button";
import { Briefcase, Heart, Scale, Users } from "lucide-react";

export type RoleType = "coach" | "manager" | "parent" | "legal";

interface RoleSelectorProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
}

const roles = [
  {
    id: "coach" as RoleType,
    label: "Coach Bien-être",
    icon: Heart,
    description: "Gérer le stress et l'énergie",
    color: "from-[#4FD1C5] to-[#78A085]",
  },
  {
    id: "manager" as RoleType,
    label: "Manager QVT",
    icon: Briefcase,
    description: "Performance et équilibre",
    color: "from-[#5B4B8A] to-[#A4D4AE]",
  },
  {
    id: "parent" as RoleType,
    label: "Parent Mentor",
    icon: Users,
    description: "Soutien émotionnel et bienveillance",
    color: "from-[#A4D4AE] to-[#4FD1C5]",
  },
  {
    id: "legal" as RoleType,
    label: "Conseiller",
    icon: Scale,
    description: "Informer et protéger avec justesse",
    color: "from-[#78A085] to-[#5B4B8A]",
  },
];

const RoleSelector = ({ currentRole, onRoleChange }: RoleSelectorProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6 animate-slide-up">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = currentRole === role.id;

        return (
          <Button
            key={role.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => onRoleChange(role.id)}
            className={`
              relative flex flex-col items-center gap-2 px-5 py-4 rounded-2xl
              transition-all duration-300 ease-in-out
              hover:scale-[1.03] focus-visible:ring-2
              ${
                isActive
                  ? `bg-gradient-to-br ${role.color} text-white shadow-lg shadow-[#4FD1C5]/30 animate-breathe`
                  : "bg-white/70 text-[#212121] border border-[#A4D4AE]/40 hover:bg-[#F2F7F6]"
              }
            `}
          >
            <Icon className={`w-6 h-6 ${isActive ? "opacity-100" : "opacity-80"}`} />
            <div className="text-center">
              <div className="font-semibold text-sm leading-tight">{role.label}</div>
              <div className="text-xs opacity-80">{role.description}</div>
            </div>

            {/* Halo animé autour du bouton actif */}
            {isActive && (
              <span
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent blur-md animate-pulse"
                aria-hidden="true"
              />
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default RoleSelector;
