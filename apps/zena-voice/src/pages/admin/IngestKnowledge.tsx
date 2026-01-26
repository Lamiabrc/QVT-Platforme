import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { pdfToText } from "@/utils/pdfToText";
import { toast } from "sonner";

export default function IngestKnowledge() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [textPreview, setTextPreview] = useState("");
  const [progress, setProgress] = useState(0);

  const uploadToSupabase = async (fileToUpload: File) => {
    const { data, error } = await supabase.storage.from("kb").upload(fileToUpload.name, fileToUpload, {
      upsert: true,
    });

    if (error || !data?.path) throw error ?? new Error("Échec de l'upload");
    return data.path;
  };

  const handleIngest = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier avant de lancer l’analyse.");
      return;
    }

    setIsUploading(true);
    setProgress(10);
    toast.info("Téléversement en cours…");

    try {
      const path = await uploadToSupabase(file);
      setProgress(30);
      toast.success("Fichier téléversé avec succès.");

      let extractedText = "";
      if (file.type === "application/pdf") {
        extractedText = await pdfToText(file);
        setTextPreview(`${extractedText.slice(0, 800)}...`);
        toast.info("Texte extrait depuis le PDF.");
      } else {
        const text = await file.text();
        extractedText = text;
        setTextPreview(`${text.slice(0, 800)}...`);
      }
      setProgress(60);

      const { data, error } = await supabase.functions.invoke("ingest", {
        body: {
          tenant_id: "default-tenant",
          objects: [{ path, name: file.name, mime: file.type }],
          lang: "fr",
          tags: ["qvt", "document"],
          preview: extractedText.slice(0, 2000),
        },
      });

      if (error) throw error;
      setProgress(100);
      toast.success("Analyse IA terminée.");
      console.log("Ingest result:", data);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      toast.error(`Erreur pendant l’ingestion : ${message}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2F7F6] to-[#E9F9F5] flex flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-semibold text-[#005B5F] mb-4">Ingestion de documents – QVT Box</h1>

        <div className="border-2 border-dashed border-[#78A085] rounded-lg p-6 text-center mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ingest-file">
            Sélectionnez un fichier à ingérer (PDF, TXT ou MD)
          </label>
          <input
            id="ingest-file"
            type="file"
            accept=".pdf,.txt,.md"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full cursor-pointer"
            title="Choisir un fichier à ingérer"
          />
          {file && (
            <p className="text-sm mt-2 text-gray-600">
              Fichier sélectionné : <strong>{file.name}</strong> ({file.type || "type inconnu"})
            </p>
          )}
        </div>

        <button
          onClick={handleIngest}
          disabled={!file || isUploading}
          className={`w-full py-3 rounded-lg font-medium text-white transition ${isUploading ? "bg-gray-400" : "bg-[#005B5F] hover:bg-[#017177]"}`}
        >
          {isUploading ? "Analyse en cours..." : "Envoyer et analyser"}
        </button>

        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div className="bg-[#78A085] h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        )}

        {textPreview && (
          <div className="mt-6 p-4 bg-[#F2F7F6] rounded-lg text-sm text-gray-700 max-h-60 overflow-y-auto">
            <p>{textPreview}</p>
          </div>
        )}
      </div>
    </div>
  );
}
