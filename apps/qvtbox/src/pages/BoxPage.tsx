import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function BoxPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative overflow-hidden px-6 pb-24 pt-32 md:pt-40">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F4ECE0]" />
          <div className="absolute -right-10 top-24 h-72 w-72 rounded-full bg-[#F3E0B9]/45 blur-3xl" />
          <div className="absolute left-8 top-28 h-56 w-56 rounded-full bg-[#CFECE8]/45 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Box</p>
            <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Une box quand ça compte.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-[#6F6454] md:text-lg">
              La box n’est pas automatique. Elle est proposée au bon moment, selon la tendance et
              les besoins.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
