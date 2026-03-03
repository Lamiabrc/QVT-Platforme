import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BubbleCover from "@/components/social/BubbleCover";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { createBubble, fetchMyBubbles } from "@/lib/social";
import type { BubbleItem, BubbleType } from "@/lib/social";

const roleLabel = (role?: string) => {
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  if (role === "referent") return "Referent";
  if (role === "luciole") return "Luciole";
  return "Member";
};

export default function BullesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [name, setName] = useState("");
  const [bubbleType, setBubbleType] = useState<BubbleType>("personal");
  const [hasMinor, setHasMinor] = useState(false);

  const sorted = useMemo(
    () =>
      [...bubbles].sort(
        (a, b) => new Date(b.updated_at ?? b.created_at).getTime() - new Date(a.updated_at ?? a.created_at).getTime()
      ),
    [bubbles]
  );

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await fetchMyBubbles(user.id);
      setBubbles(data);
    } catch (error: any) {
      toast({
        title: "Impossible de charger vos bulles",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.id) return;
    if (!name.trim()) {
      toast({
        title: "Nom requis",
        description: "Ajoutez un nom de bulle.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await createBubble({
        userId: user.id,
        name,
        bubbleType,
        hasMinor,
      });

      setName("");
      setBubbleType("personal");
      setHasMinor(false);
      setShowCreate(false);

      toast({
        title: "Bulle créée",
        description: "Votre bulle est prête.",
      });

      await load();
    } catch (error: any) {
      toast({
        title: "Création impossible",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="px-6 pb-20 pt-32 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Mes bulles</p>
              <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Espace de confiance</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#6F6454] md:text-base">
                Privé par défaut. Partage choisi. Sécurité d’abord.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate((value) => !value)}
              className="rounded-full bg-[#1B1A18] px-5 py-2.5 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
            >
              Créer une bulle
            </button>
          </div>

          {showCreate ? (
            <form
              onSubmit={handleCreate}
              className="mt-6 grid gap-3 rounded-3xl border border-[#E8DCC8] bg-white p-5 md:grid-cols-[1.5fr,1fr,auto]"
            >
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nom de la bulle"
                className="rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm outline-none focus:border-[#8CC7BE]"
              />

              <div className="flex gap-2 rounded-2xl border border-[#E8DCC8] bg-[#FFFCF6] p-1">
                <button
                  type="button"
                  onClick={() => setBubbleType("personal")}
                  className={[
                    "flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition",
                    bubbleType === "personal"
                      ? "bg-[#1B1A18] text-[#FAF6EE]"
                      : "text-[#6F6454] hover:bg-[#F3E0B9]/35",
                  ].join(" ")}
                >
                  Vie perso
                </button>
                <button
                  type="button"
                  onClick={() => setBubbleType("enterprise")}
                  className={[
                    "flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition",
                    bubbleType === "enterprise"
                      ? "bg-[#1B1A18] text-[#FAF6EE]"
                      : "text-[#6F6454] hover:bg-[#F3E0B9]/35",
                  ].join(" ")}
                >
                  Entreprise
                </button>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-[#1B1A18] px-5 py-3 text-sm font-semibold text-[#FAF6EE] disabled:opacity-60"
              >
                {saving ? "Création..." : "Valider"}
              </button>

              <label className="md:col-span-3 flex items-center gap-2 text-sm text-[#6F6454]">
                <input
                  type="checkbox"
                  checked={hasMinor}
                  onChange={(event) => setHasMinor(event.target.checked)}
                />
                Mineur concerné ?
              </label>
            </form>
          ) : null}

          <section className="mt-8">
            {loading ? (
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 text-sm text-[#6F6454]">
                Chargement des bulles...
              </div>
            ) : sorted.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#DCCEB7] bg-white p-10 text-center">
                <h2 className="text-xl font-semibold">Crée ta première bulle</h2>
                <p className="mt-2 text-sm text-[#6F6454]">
                  Une bulle permet de partager avec les personnes de confiance, sans exposition publique.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="mt-5 rounded-full bg-[#1B1A18] px-5 py-2.5 text-sm font-semibold text-[#FAF6EE]"
                >
                  Créer ma bulle
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sorted.map((bubble, index) => (
                  <Link
                    key={bubble.id}
                    to={`/bulle/${bubble.id}`}
                    className="rounded-3xl border border-[#E8DCC8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <BubbleCover
                      title={bubble.name}
                      src={bubble.cover_path || `/covers/cover-${(index % 6) + 1}.svg`}
                    />

                    <div className="mt-3">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold">{bubble.name}</h2>
                        <span className="rounded-full bg-[#F3E0B9]/50 px-2 py-1 text-[11px] font-semibold text-[#5F4B2E]">
                          {roleLabel(bubble.role)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#9C8D77]">
                        {bubble.bubble_type === "enterprise" ? "Entreprise" : "Vie perso"}
                      </p>
                      {bubble.has_minor ? (
                        <p className="mt-3 rounded-xl bg-[#FFF4E7] px-3 py-2 text-xs text-[#7E5B2E]">
                          Mineur concerné: référent requis.
                        </p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
