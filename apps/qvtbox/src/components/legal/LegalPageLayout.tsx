import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LegalSectionLink = {
  id: string;
  label: string;
};

interface LegalPageLayoutProps {
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  heading: ReactNode;
  subtitle: string;
  eyebrow?: string;
  lastUpdated?: string;
  sections?: LegalSectionLink[];
  children: ReactNode;
}

interface LegalSectionCardProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function LegalPageLayout({
  seoTitle,
  seoDescription,
  seoKeywords,
  heading,
  subtitle,
  eyebrow = "Informations legales",
  lastUpdated,
  sections = [],
  children,
}: LegalPageLayoutProps) {
  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} keywords={seoKeywords} />

      <div className="min-h-screen bg-gradient-hero">
        <Navigation />

        <main className="relative z-10 px-4 pb-14 pt-24 sm:px-6 md:pt-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 rounded-[28px] border border-[#E8DCC8] bg-white/88 p-5 shadow-sm backdrop-blur sm:mb-8 sm:p-7 md:p-9">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#9C8D77]">{eyebrow}</p>
              <h1 className="mt-3 text-center font-kalam text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
                {heading}
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[#6F6454] sm:text-base">
                {subtitle}
              </p>

              {lastUpdated ? (
                <div className="mt-5 flex justify-center">
                  <span className="rounded-full border border-[#E8DCC8] bg-[#FAF6EE] px-4 py-2 text-xs font-medium text-[#6F6454]">
                    Mise a jour : {lastUpdated}
                  </span>
                </div>
              ) : null}
            </div>

            {sections.length ? (
              <div className="sticky top-[76px] z-20 mb-6 overflow-x-auto rounded-2xl border border-[#E8DCC8] bg-white/88 px-3 py-3 shadow-sm backdrop-blur sm:mb-8">
                <div className="flex min-w-max gap-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="rounded-full border border-[#E8DCC8] bg-[#FAF6EE] px-3 py-2 text-xs font-semibold text-[#6F6454] transition hover:border-[#D6C29D] hover:text-[#1B1A18]"
                    >
                      {section.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-5 sm:space-y-6 md:space-y-8">{children}</div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export function LegalSectionCard({ id, title, children, className }: LegalSectionCardProps) {
  return (
    <Card
      id={id}
      className={cn(
        "card-professional scroll-mt-36 border-[#E8DCC8] bg-white/94 shadow-sm",
        className,
      )}
    >
      <CardHeader className="px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="font-inter text-xl text-primary sm:text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5 text-sm leading-6 text-foreground/80 sm:px-6 sm:pb-6 sm:text-base">
        {children}
      </CardContent>
    </Card>
  );
}

