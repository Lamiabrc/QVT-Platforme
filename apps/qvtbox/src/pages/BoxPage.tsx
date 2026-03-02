import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function BoxPage() {
  const boxes = [
    { title: "Box Salarié", image: "/images/box-salarie.jpg" },
    { title: "Box Parent", image: "/images/box-parent.jpg" },
    { title: "Box Proches", image: "/images/box-ado.jpg" },
    { title: "Box Senior", image: "/images/box-senior.jpg" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative min-h-[64vh] overflow-hidden">
          <img
            src="/images/hero-boxes.jpg"
            alt="Visuels des box QVT Box"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/75 via-[#151515]/40 to-[#151515]/25" />

          <div className="relative z-10 mx-auto flex min-h-[64vh] max-w-5xl items-end px-6 pb-16 pt-32">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[#E7D9C2]">Box</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">
                Une box quand ça compte.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-[#F3EBDD] md:text-lg">
                La box n’est pas automatique. Elle est proposée au bon moment, selon la tendance et
                les besoins.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#FAF6EE] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {boxes.map((box) => (
                <article
                  key={box.title}
                  className="overflow-hidden rounded-3xl border border-[#E8DCC8] bg-white shadow-sm"
                >
                  <img src={box.image} alt={box.title} className="h-48 w-full object-cover" />
                  <div className="p-5">
                    <h2 className="text-lg font-semibold">{box.title}</h2>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#1B1A18] px-6 py-3 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
              >
                Demander une box
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/simulateur"
                className="inline-flex items-center gap-2 rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/40"
              >
                Estimer le bon moment
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
