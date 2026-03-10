import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { fetchBoxes } from "@/lib/social";
import type { BoxItem } from "@/lib/social";

const fallbackBoxes: BoxItem[] = [
  {
    id: "fallback-1",
    slug: "box-salarie",
    title: "Box Salarié",
    description: "Cohésion et attention dans la durée.",
    image_path: "/images/box-salarie.jpg",
    price_cents: 4900,
    cadence: "one_shot",
    is_active: true,
  },
  {
    id: "fallback-2",
    slug: "box-parent",
    title: "Box Parent",
    description: "Soutien parental et respiration.",
    image_path: "/images/box-parent.jpg",
    price_cents: 5900,
    cadence: "one_shot",
    is_active: true,
  },
  {
    id: "fallback-3",
    slug: "box-proches",
    title: "Box Proches",
    description: "Présence concrète dans les moments clés.",
    image_path: "/images/box-ado.jpg",
    price_cents: 4200,
    cadence: "one_shot",
    is_active: true,
  },
  {
    id: "fallback-4",
    slug: "box-senior",
    title: "Box Senior",
    description: "Lien, sécurité et réconfort.",
    image_path: "/images/box-senior.jpg",
    price_cents: 5600,
    cadence: "monthly",
    is_active: true,
  },
];

export default function BoxPage() {
  const [boxes, setBoxes] = useState<BoxItem[]>(fallbackBoxes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await fetchBoxes();
        if (rows.length) setBoxes(rows);
      } catch {
        setBoxes(fallbackBoxes);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative min-h-[56vh] overflow-hidden sm:min-h-[64vh]">
          <img
            src="/images/hero-boxes.jpg"
            alt="Visuels des box QVT Box"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/75 via-[#151515]/40 to-[#151515]/25" />

          <div className="relative z-10 mx-auto flex min-h-[56vh] max-w-5xl items-end px-4 pb-12 pt-28 sm:min-h-[64vh] sm:px-6 sm:pb-16 sm:pt-32">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[#E7D9C2]">Box</p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-6xl">
                Une box quand ça compte.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-[#F3EBDD] md:text-lg">
                La box n’est pas automatique. Elle est proposée au bon moment, selon la tendance et
                les besoins.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#FAF6EE] px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            {loading ? (
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-5 text-sm text-[#6F6454]">
                Chargement du catalogue...
              </div>
            ) : null}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {boxes.map((box) => (
                <article
                  key={box.id}
                  className="overflow-hidden rounded-3xl border border-[#E8DCC8] bg-white shadow-sm"
                >
                  <img
                    src={box.image_path || "/images/box-parent.jpg"}
                    alt={box.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-lg font-semibold">{box.title}</h2>
                    {box.description ? <p className="mt-2 text-sm text-[#6F6454]">{box.description}</p> : null}
                    <p className="mt-3 text-sm font-semibold">
                      {Math.round(box.price_cents / 100)} € • {box.cadence === "one_shot" ? "ponctuelle" : box.cadence}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/bulles"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1B1A18] px-6 py-3 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90 sm:w-auto"
              >
                Voir mes recommandations
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/simulateur"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/40 sm:w-auto"
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
