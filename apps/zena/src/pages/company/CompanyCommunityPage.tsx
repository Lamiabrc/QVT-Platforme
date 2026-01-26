import { useState } from "react";
import SphereLayout from "@/components/SphereLayout";
import { supabase } from "@/lib/supabase";
import { getCompanyId } from "@/lib/tenants";

const CompanyCommunityPage = () => {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<string[]>([]);

  const handlePost = async () => {
    if (!content) return;

    const companyId = await getCompanyId();
    if (!companyId) return;

    setPosts((prev) => [content, ...prev]);
    setContent("");

    await supabase.from("posts").insert({
      tenant_type: "company",
      tenant_id: companyId,
      visibility: "tenant",
      content,
    });
  };

  return (
    <SphereLayout
      sphere="company"
      title="Communaute Entreprise"
      description="Feed interne reserve aux membres de l'entreprise."
    >
      <div className="rounded-2xl border border-border p-6 space-y-4">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Partager une information interne."
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

export default CompanyCommunityPage;
