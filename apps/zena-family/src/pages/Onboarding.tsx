import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ZenaAvatar } from "@/components/zena/ZenaAvatar";
import { useToast } from "@/components/ui/use-toast";
import { FamilyRole } from "@/types/database";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [members, setMembers] = useState<Array<{ displayName: string; role: FamilyRole; ageRange: string }>>([
    { displayName: "", role: "parent", ageRange: "" }
  ]);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const addMember = () => {
    setMembers([...members, { displayName: "", role: "ado", ageRange: "" }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: string, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create family group
      const { data: familyData, error: familyError } = await supabase
        .from('family_groups')
        .insert({ name: familyName, created_by: user.id })
        .select()
        .single();

      if (familyError) throw familyError;

      // Create family members
      const memberInserts = members.map((member) => ({
        family_id: familyData.id,
        profile_id: user.id,
        role: member.role,
        display_name: member.displayName,
        age_range: member.ageRange || null,
        is_account_holder: true,
      }));

      const { error: membersError } = await supabase
        .from('family_members')
        .insert(memberInserts);

      if (membersError) throw membersError;

      toast({
        title: "Famille créée !",
        description: "Votre espace familial est prêt.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zena-turquoise/10 via-zena-violet/10 to-zena-rose/10 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <ZenaAvatar size="lg" />
          <div className="text-center">
            <h1 className="text-3xl font-bold">Créons votre espace familial</h1>
            <p className="text-muted-foreground">Quelques informations pour commencer</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Votre famille</CardTitle>
            <CardDescription>
              Donnez un nom à votre famille et ajoutez les membres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="family-name">Nom de la famille</Label>
                <Input
                  id="family-name"
                  placeholder="Ex: Famille Dupont"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Membres de la famille</Label>
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Prénom"
                        value={member.displayName}
                        onChange={(e) => updateMember(index, "displayName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-40">
                      <Select
                        value={member.role}
                        onValueChange={(value) => updateMember(index, "role", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="ado">Ado</SelectItem>
                          <SelectItem value="enfant">Enfant</SelectItem>
                          <SelectItem value="parrain">Parrain/Marraine</SelectItem>
                          <SelectItem value="tuteur">Tuteur</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMember(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addMember} className="w-full">
                  + Ajouter un membre
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Création..." : "Créer mon espace familial"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
