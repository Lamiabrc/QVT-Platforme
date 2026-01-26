// src/pages/BoxPage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Users, HeartHandshake } from "lucide-react";

export default function BoxPage() {
  const boxes = [
    {
      id: "salarie",
      title: "Box Salarié",
      description:
        "Une box utile, minimaliste et vraiment pensée pour soutenir les collaborateurs dans leur quotidien professionnel et personnel.",
      image: "/images/box-salarie.jpg",
      color: "#4FD1C5",
    },
    {
      id: "parent",
      title: "Box Parent",
      description:
        "Une box qui soutient les parents dans l’équilibre entre vie pro et vie familiale avec des outils concrets et bienveillants.",
      image: "/images/box-parent.jpg",
      color: "#5B4B8A",
    },
    {
      id: "ado",
      title: "Box Ado",
      description:
        "Pour accompagner les adolescents dans la confiance, l’hygiène, l’identité et la santé mentale. Une box moderne, douce et utile.",
      image: "/images/box-ado.jpg",
      color: "#00A7B4",
    },
    {
      id: "senior",
      title: "Box Senior / Grand-Parent",
      description:
        "Une box tendre et utile pour les retraités : mémoire, dégustation, jardinage, activités douces et transmission.",
      image: "/images/box-senior.jpg",
      color: "#E8CFAF",
    },
  ];

  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      {/* HERO */}
      <section className="relative h-[70vh] flex items-end overflow-hidden">
        <img
          src="/images/hero-boxes.jpg"
          alt="Box QVT"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/70 via-transparent to-transparent" />

        <div className="relative z-10 px-8 md:px-16 pb-20 max-w-3xl">
          <p className="uppercase tracking-[0.18em] text-[11px] text-[#EDE3D0]/80 mb-4">
            QVT Box · Solutions concrètes
          </p>

          <h1 className="text-4xl md:text-6xl font-light text-white leading-tight drop-shadow-xl">
            Des box vraiment utiles.
            <br />
            <span className="text-[#F3E0B9]">Jamais gadgets.</span>
          </h1>

          <p className="text-white/80 mt-4 max-w-xl leading-relaxed">
            4 box pensées pour améliorer la vie quotidienne : au travail, à la
            maison, en famille ou dans le grand âge.
          </p>
        </div>
      </section>

      {/* GRID DES BOX */}
      <section className="py-24 px-8 md:px-16 bg-[#FAF6EE]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14">
          {boxes.map((box) => (
            <div
              key={box.id}
              className="group rounded-3xl overflow-hidden shadow-lg bg-white border border-[#E8DCC8] hover:shadow-xl transition"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={box.image}
                  alt={box.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div
                  className="absolute inset-0 opacity-40"
                  style={{ backgroundColor: box.color }}
                />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-light mb-3">{box.title}</h3>
                <p className="text-[#6F6454] mb-6">{box.description}</p>

                <Link
                  to={`/contact`}
                  className="inline-flex items-center gap-2 text-[#1B1A18] hover:underline"
                >
                  Demander cette box
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION VALEUR */}
      <section className="py-32 bg-[#151515] text-[#FDF9F0]">
        <div className="max-w-4xl mx-auto px-8 md:px-16 text-center">
          <p className="uppercase tracking-[0.2em] text-[11px] text-[#E5D7BF]/70 mb-4">
            Une approche humaine
          </p>

          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Ce ne sont pas des cadeaux.
            <br />
            Ce sont des soutiens.
          </h2>

          <p className="text-[#E5D7BF]/80 max-w-2xl mx-auto mb-10">
            Les box QVT Box sont conçues avec des artisans français, des experts
            en santé émotionnelle et l’expérience du terrain.  
            L’objectif : répondre à un vrai besoin.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/simulateur"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#F3E0B9] text-[#151515] hover:bg-[#F7E7C5] transition"
            >
              Découvrir ma bulle attentionnée
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#EADCC7] text-[#FDF9F0] hover:bg-white/10 transition"
            >
              Contact entreprise
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
