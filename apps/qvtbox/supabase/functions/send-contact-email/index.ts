import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  nom: string;
  email: string;
  entreprise?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nom, email, entreprise, message }: ContactEmailRequest = await req.json();

    console.log("Sending contact email for:", { nom, email, entreprise });

    // Email to Lamia
    const emailToLamia = await resend.emails.send({
      from: "QVT Box Contact <onboarding@resend.dev>",
      to: ["lamia.brechet@outlook.fr"],
      subject: `Nouvelle demande de contact - ${nom}`,
      html: `
        <h1>Nouvelle demande de contact</h1>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Informations du contact :</h2>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          ${entreprise ? `<p><strong>Entreprise :</strong> ${entreprise}</p>` : ''}
        </div>
        
        <div style="background: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h3>Message :</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Email envoyé depuis le formulaire de contact QVT Box
        </p>
      `,
    });

    // Confirmation email to user
    const confirmationEmail = await resend.emails.send({
      from: "QVT Box <onboarding@resend.dev>",
      to: [email],
      subject: "Merci pour votre demande de contact - QVT Box",
      html: `
        <h1>Merci ${nom} !</h1>
        <p>Nous avons bien reçu votre demande de contact.</p>
        
        <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Récapitulatif de votre demande :</h3>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          ${entreprise ? `<p><strong>Entreprise :</strong> ${entreprise}</p>` : ''}
          <div style="margin-top: 15px;">
            <strong>Message :</strong>
            <p style="background: #fff; padding: 10px; border-radius: 4px; margin-top: 5px; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        
        <p>Nous revenons vers vous sous 24-48h pour vous présenter une solution personnalisée.</p>
        
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">
          <p><strong>QVT Box - Qualité de Vie au Travail</strong></p>
          <p>📞 +33 2 23 24 28 45</p>
          <p>📍 Rennes, France</p>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { emailToLamia, confirmationEmail });

    return new Response(JSON.stringify({ 
      success: true,
      message: "Emails sent successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);