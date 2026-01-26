import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as pdfjsLib from "https://esm.sh/pdfjs-dist@4.6.82";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supa = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const EMB_MODEL = "text-embedding-3-small";

/** Utilitaire hash (pour les chunks) */
async function sha256(s: string) {
  const data = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Découpage du texte pour RAG */
function chunkText(txt: string, size = 1200, overlap = 150) {
  const chunks: string[] = [];
  let i = 0;
  while (i < txt.length) {
    const end = Math.min(i + size, txt.length);
    chunks.push(txt.slice(i, end));
    i = end - overlap;
  }
  return chunks.filter((c) => c.trim().length > 0);
}

/** Récupération sécurisée depuis Supabase Storage */
async function signedFetch(bucket: string, path: string): Promise<Uint8Array> {
  const { data, error } = await supa.storage.from(bucket).createSignedUrl(path, 180);
  if (error) throw error;
  const res = await fetch(data.signedUrl);
  if (!res.ok) throw new Error("fetch storage " + res.status);
  return new Uint8Array(await res.arrayBuffer());
}

/** Extraction de texte locale multi-format */
async function extractText(bucket: string, obj: { path: string; name?: string; mime?: string }): Promise<string> {
  const name = (obj.name || "").toLowerCase();
  const mime = (obj.mime || "").toLowerCase();
  const bytes = await signedFetch(bucket, obj.path);

  // --- TXT & MD ---
  if (mime.includes("text/plain") || name.endsWith(".txt") || name.endsWith(".md")) {
    return new TextDecoder().decode(bytes);
  }

  // --- PDF ---
  if (mime.includes("pdf") || name.endsWith(".pdf")) {
    try {
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((it: any) => it.str).join(" ") + "\n";
      }
      return text;
    } catch (err) {
      console.error("[extractText] PDF error:", err);
      throw new Error("Erreur extraction PDF");
    }
  }

  // --- DOCX ---
  if (mime.includes("word") || name.endsWith(".docx")) {
    return "[DOCX non encore supporté — à venir]";
  }

  throw new Error("Type de fichier non pris en charge : " + mime);
}

/** Génération d’embeddings via OpenAI */
async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({ model: EMB_MODEL, input: texts }),
  });
  if (!res.ok) throw new Error("embeddings " + res.status);
  const j = await res.json();
  return j.data.map((d: any) => d.embedding);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tenant_id, objects, lang = "fr", tags = [], bucket = "kb" } = await req.json();
    if (!tenant_id || !objects?.length)
      return new Response(JSON.stringify({ error: "missing tenant_id or objects" }), {
        status: 400,
        headers: corsHeaders,
      });

    console.log(`[ingest] ${objects.length} fichiers à traiter pour ${tenant_id}`);

    for (const obj of objects) {
      const { data: src, error: e1 } = await supa
        .from("kb_sources")
        .insert({
          tenant_id,
          object_path: obj.path,
          original_name: obj.name ?? null,
          mime_type: obj.mime ?? null,
          status: "processing",
        })
        .select()
        .single();

      if (e1) throw e1;

      try {
        const text = (await extractText(bucket, obj)).trim();
        if (!text) throw new Error("empty text");

        const chunks = chunkText(text);
        const embeddings = await embedBatch(chunks);

        const rows = await Promise.all(
          chunks.map(async (content, i) => ({
            tenant_id,
            source_id: src.id,
            title: obj.name ?? "Document QVT",
            content,
            lang,
            tags,
            content_sha256: await sha256(content),
            embedding: JSON.stringify(embeddings[i]),
          }))
        );

        await supa.from("kb_chunks").insert(rows);
        await supa.from("kb_sources").update({ status: "done" }).eq("id", src.id);

        console.log(`[ingest] ✅ ${obj.name} traité (${chunks.length} segments)`);
      } catch (err) {
        console.error(`[ingest] ❌ ${obj.name}:`, err);
        await supa.from("kb_sources").update({ status: "error", error: String(err) }).eq("id", src.id);
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[ingest] Fatal:", e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
