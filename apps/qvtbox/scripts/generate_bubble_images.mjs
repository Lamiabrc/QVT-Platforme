import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OUTPUT_DIR = path.resolve(process.cwd(), "apps/qvtbox/public/images/bubbles");

const assets = [
  {
    filename: "starfield-4k.jpg",
    prompt:
      "ultra realistic deep space galaxy starfield milky way cosmic dust cinematic dark blue purple 4k",
    output_format: "jpeg",
  },
  {
    filename: "accueil.jpg",
    prompt:
      "warm lifestyle home entrance wooden table coffee mug keys sunlight cozy realistic photography",
    output_format: "jpeg",
  },
  {
    filename: "zena.jpg",
    prompt:
      "young female mentor portrait inside glowing transparent glass bubble golden light cosmic background",
    output_format: "jpeg",
  },
  {
    filename: "univers.jpg",
    prompt: "modern wellbeing social network interface on smartphone calm warm lighting realistic",
    output_format: "jpeg",
  },
  {
    filename: "boutique.jpg",
    prompt: "premium wellness box with tea candle lavender natural light photography",
    output_format: "jpeg",
  },
  {
    filename: "luciole.png",
    prompt: "realistic glowing firefly golden particles magical light transparent background",
    output_format: "png",
    background: "transparent",
  },
];

if (!OPENAI_API_KEY) {
  console.error(
    "OPENAI_API_KEY manquante. Definis la variable d'environnement puis relance le script.",
  );
  process.exit(1);
}

await mkdir(OUTPUT_DIR, { recursive: true });

for (const asset of assets) {
  const body = {
    model: IMAGE_MODEL,
    prompt: asset.prompt,
    size: "2048x2048",
    quality: "high",
    output_format: asset.output_format,
    response_format: "b64_json",
    n: 1,
    ...(asset.background ? { background: asset.background } : {}),
  };

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(`Erreur generation ${asset.filename}: ${response.status} ${errorPayload}`);
  }

  const json = await response.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`Aucune image retournee pour ${asset.filename}`);
  }

  const filePath = path.join(OUTPUT_DIR, asset.filename);
  await writeFile(filePath, Buffer.from(b64, "base64"));
  console.log(`OK ${asset.filename}`);
}

console.log(`Generation terminee dans: ${OUTPUT_DIR}`);
