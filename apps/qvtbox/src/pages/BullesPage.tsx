import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BubbleUniverse from "@/components/social/BubbleUniverse";

export default function BullesPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="px-6 pb-20 pt-32 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <BubbleUniverse />
        </div>
      </main>

      <Footer />
    </div>
  );
}

