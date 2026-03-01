import type { VercelRequest, VercelResponse } from "@vercel/node";

type ContactBody = {
  nom?: string;
  email?: string;
  role?: string;
  entreprise?: string;
  telephone?: string;
  message?: string;
};

const REQUIRED_FIELDS: (keyof ContactBody)[] = ["nom", "email", "message"];

const formatLine = (label: string, value?: string) => `${label}: ${value?.trim() || "-"}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = (req.body ?? {}) as ContactBody;

  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || !String(body[field]).trim()) {
      res.status(400).json({ error: `Missing field: ${field}` });
      return;
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    res.status(500).json({ error: "Missing RESEND_API_KEY" });
    return;
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || "contact@qvtbox.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "QVT Box <onboarding@resend.dev>";

  const subject = `[QVT Box] Nouveau contact - ${body.role?.trim() || "contact"}`;
  const text = [
    "Nouveau message depuis le formulaire de contact QVT Box",
    "",
    formatLine("Nom", body.nom),
    formatLine("Email", body.email),
    formatLine("Role", body.role),
    formatLine("Telephone", body.telephone),
    formatLine("Entreprise", body.entreprise),
    "",
    "Message:",
    body.message?.trim() || "-",
  ].join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: body.email,
      subject,
      text,
    }),
  });

  if (!resendResponse.ok) {
    const details = await resendResponse.text();
    res.status(502).json({ error: "Email provider error", details });
    return;
  }

  res.status(200).json({ ok: true });
}
