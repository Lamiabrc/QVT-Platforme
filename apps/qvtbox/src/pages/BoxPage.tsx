import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function BoxPage() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18] min-h-screen">
      <Navigation />

      <main>
        <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-28">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#F3E0B9]/35 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#CFECE8]/35 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">QVT Box</p>
            <h1 className="text-4xl md:text-6xl font-semibold mt-4">
              Une box quand ça compte.
            </h1>
            <p className="text-base md:text-lg text-[#6F6454] mt-6 max-w-2xl mx-auto">
              La box n&rsquo;est pas automatique.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
