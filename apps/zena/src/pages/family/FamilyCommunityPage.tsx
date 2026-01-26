import { useState } from "react";
import SphereLayout from "@/components/SphereLayout";
import { supabase } from "@/lib/supabase";
import { getFamilyId } from "@/lib/tenants";

const FamilyCommunityPage = () => {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<string[]>([]);

  const handlePost = async () => {
    if (!content) return;

    const familyId = await getFamilyId();
    if (!familyId) return;

    setPosts((prev) => [content, ...prev]);
    setContent("");

    await supabase.from("posts").insert({
      tenant_type: "family",
      tenant_id: familyId,
      visibility: "tenant",
      content,
    });
  };

  return (
    <SphereLayout
      sphere="family"
      title="Communaute Famille"
      description="Feed prive invite-only. Aucun annuaire public, pas de DM en MVP."
    >
      <div className="rounded-2xl border border-border p-6 space-y-4">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Partager un message au cercle famille/amis."
        />
        <button
          type="button"
          onClick={handlePost}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Publier
        </button>
      </div>
      <div className="space-y-3">
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun message pour le moment.</p>
        ) : (
          posts.map((post, index) => (
            <div key={`${post}-${index}`} className="rounded-lg border border-border p-4 text-sm">
              {post}
            </div>
          ))
        )}
      </div>
    </SphereLayout>
  );
};

export default FamilyCommunityPage;
