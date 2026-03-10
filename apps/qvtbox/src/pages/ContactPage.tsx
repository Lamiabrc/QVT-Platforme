// src/pages/Contact.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  ArrowRight,
  Users,
  HeartHandshake
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { supabase } from "@/integrations/supabase/client";

const CONTACT_EMAIL = "contact@qvtbox.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`;

const ContactPage = () => {
  const { toast } = useToast();
  const { trackFormSubmission } = useAnalytics();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    role: "",
    entreprise: "",
    telephone: "",
    message: "",
    _honeypot: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (formData._honeypot.trim() !== "") return;

    setIsSubmitting(true);

    try {
      // --- Enregistrement dans Supabase ---
      const leadInsert = supabase.from("leads_demo").insert([
        {
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          entreprise: formData.entreprise,
          role: formData.role,
          message: formData.message,
          source_page: "/contact",
        },
      ]);

      // --- Envoi email ---
      const emailPayload = {
        name: formData.nom,
        email: formData.email,
        phone: formData.telephone,
        company: formData.entreprise,
        role: formData.role,
        message: formData.message,
        _subject: "Nouveau contact QVT Box",
        _template: "table",
        _captcha: "false",
      };

      const emailSend = fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(emailPayload),
      });

      const [leadRes, emailRes] = await Promise.allSettled([leadInsert, emailSend]);

      if (
        leadRes.status === "rejected" ||
        (emailRes.status === "fulfilled" ? !emailRes.value.ok : true)
      )
        throw new Error("Email send failed");

      trackFormSubmission("contact", true);

      toast({
        title: "Merci ! 💛",
        description: "Votre message a bien été envoyé. Nous revenons vers vous très vite.",
      });

      setFormData({
        nom: "",
        email: "",
        entreprise: "",
        telephone: "",
        role: "",
        message: "",
        _honeypot: "",
      });
    } catch (err) {
      trackFormSubmission("contact", false, [String(err)]);
      toast({
        title: "Impossible d’envoyer le message",
        description: "Vous pouvez réessayer ou nous écrire directement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      {/* HERO premium */}
      <section className="relative h-[38vh] min-h-[300px] w-full overflow-hidden sm:h-[46vh]">
        <img
          src="/images/contact-hero.jpg"
          alt="Contact QVT Box"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10" />

        <div className="absolute bottom-8 left-4 right-4 max-w-xl text-white sm:bottom-12 sm:left-8 md:left-16">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Prenez soin de votre bulle.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-white/90 md:text-xl">
            Entreprises, parents, ados ou seniors — nous sommes là pour vous.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="container mx-auto grid gap-10 lg:grid-cols-2 lg:gap-14">

          {/* LEFT COLUMN */}
          <div className="space-y-10">
            <img
              src="/images/contact-workspace.jpg"
              alt="Workspace QVT Box"
              className="rounded-xl shadow-xl"
            />

            <div>
              <h2 className="text-3xl font-bold mb-4">Un besoin, une question ?</h2>
              <p className="text-[#1B1A18]/70 leading-relaxed mb-6">
                Que vous soyez un salarié, une entreprise, un parent, un ado ou un senior —  
                QVT Box reste un espace pour parler, demander, se renseigner et avancer.
              </p>
            </div>

            {/* CONTACT INFOS */}
            <div className="space-y-6">

              <Card className="bg-white/70 border-none shadow-md">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Téléphone</h3>
                    <p className="text-[#1B1A18]/70">06 76 43 55 51</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 border-none shadow-md">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-[#1B1A18]/70">contact@qvtbox.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 border-none shadow-md">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Adresse</h3>
                    <p className="text-[#1B1A18]/70">Rennes, France</p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* RIGHT COLUMN — FORMULAIRE */}
          <Card className="bg-white/80 backdrop-blur-md border border-[#E9DFD1] shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Écrire à QVT Box
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="_honeypot" className="hidden" />

                <div>
                  <Label className="font-medium">Je suis… *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v) => setFormData({ ...formData, role: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salarie">Salarié(e)</SelectItem>
                      <SelectItem value="entreprise">Entreprise / RH</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="ado">Adolescent(e)</SelectItem>
                      <SelectItem value="senior">Grand-parent / Senior</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nom *</Label>
                    <Input name="nom" value={formData.nom} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label>Email *</Label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div>
                  <Label>Téléphone</Label>
                  <Input name="telephone" value={formData.telephone} onChange={handleChange} />
                </div>

                <div>
                  <Label>Entreprise (optionnel)</Label>
                  <Input name="entreprise" value={formData.entreprise} onChange={handleChange} />
                </div>

                <div>
                  <Label>Message *</Label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Parlez-nous de votre besoin…"
                  />
                </div>

                <Button type="submit" className="w-full flex items-center gap-2 justify-center" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi…" : "Envoyer"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
