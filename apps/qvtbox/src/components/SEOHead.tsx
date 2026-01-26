import { useEffect } from "react";

type OgType = "website" | "article" | "product";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  /**
   * URL absolue recommandée pour l'image (og:image / twitter:image).
   * Si relative, on tentera de la convertir en absolue via l'URL courante.
   */
  ogImage?: string;
  /** URL canonique de la page (absolue préférée). Si absent, on utilise location.href en CSR. */
  url?: string;
  /** Open Graph type */
  type?: OgType;
  /** Nom du site, par défaut "QVT Box" */
  siteName?: string;
  /** Code langue/locale pour OG (ex: "fr_FR", "en_US") */
  locale?: string;
  /** Indique aux moteurs si la page doit être indexée */
  indexable?: boolean; // => robots
  /** Compte Twitter (ex: "@qvtbox") */
  twitterSite?: string;
  /**
   * Script JSON-LD à injecter (schema.org), p.ex. Organization / WebSite / Product…
   * Donne un objet JS – il sera stringifié proprement.
   */
  jsonLd?: Record<string, any> | Record<string, any>[];
  /**
   * Modèle du titre (suffix), ex: " | QVT Box - Bien-être au travail"
   * Laisse vide pour ne pas ajouter de suffixe.
   */
  titleTemplate?: string;
}

/** Utilitaires internes */
const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

function ensureAbsoluteUrl(input?: string, base?: string): string | undefined {
  if (!input) return undefined;
  try {
    // Si input est déjà absolue, new URL ne jette pas d'erreur
    return new URL(input, base || (isBrowser ? window.location.origin : undefined)).toString();
  } catch {
    return input; // on laisse tel quel si base inconnue (SSR sans base)
  }
}

function upsertMeta(nameOrProp: string, content: string, opts?: { property?: boolean }) {
  if (!isBrowser) return;
  const attribute = opts?.property ? "property" : "name";
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${nameOrProp}"][data-qvt="1"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, nameOrProp);
    el.setAttribute("data-qvt", "1");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  if (!isBrowser) return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-qvt="1"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute("data-qvt", "1");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id: string, data: any) {
  if (!isBrowser) return;
  let script = document.head.querySelector<HTMLScriptElement>(`script[type="application/ld+json"][data-qvt-id="${id}"]`);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-qvt", "1");
    script.setAttribute("data-qvt-id", id);
    document.head.appendChild(script);
  }
  script.text = Array.isArray(data) ? JSON.stringify(data) : JSON.stringify(data, null, 0);
}

export const SEOHead = ({
  title,
  description,
  keywords,
  ogImage = "/og-image.png",
  url,
  type = "website",
  siteName = "QVT Box",
  locale = "fr_FR",
  indexable = true,
  twitterSite, // ex: "@qvtbox"
  jsonLd,
  titleTemplate = " | QVT Box - Bien-être au travail",
}: SEOHeadProps) => {
  useEffect(() => {
    if (!isBrowser) return;

    // Déduire URL courante si non fournie
    const currentUrl = url || window.location.href;

    // Construire title final (avec template)
    const finalTitle = titleTemplate ? `${title}${titleTemplate}` : title;
    document.title = finalTitle;

    // Basic metas
    upsertMeta("description", description);
    if (keywords) upsertMeta("keywords", keywords);

    // Robots / indexation
    upsertMeta("robots", indexable ? "index, follow" : "noindex, nofollow");

    // Open Graph
    upsertMeta("og:title", title, { property: true });
    upsertMeta("og:description", description, { property: true });
    upsertMeta("og:type", type, { property: true });
    upsertMeta("og:url", ensureAbsoluteUrl(currentUrl) || currentUrl, { property: true });
    upsertMeta("og:image", ensureAbsoluteUrl(ogImage, currentUrl) || ogImage, { property: true });
    upsertMeta("og:site_name", siteName, { property: true });
    upsertMeta("og:locale", locale, { property: true });

    // Twitter
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    upsertMeta("twitter:image", ensureAbsoluteUrl(ogImage, currentUrl) || ogImage);
    if (twitterSite) upsertMeta("twitter:site", twitterSite);

    // Canonical
    const canonicalUrl = ensureAbsoluteUrl(currentUrl) || currentUrl;
    upsertLink("canonical", canonicalUrl);

    // JSON-LD (optionnel)
    if (jsonLd) {
      upsertJsonLd("primary", jsonLd);
    }

    // Cleanup optionnel : on ne supprime pas pour éviter le flicker entre routes
    // Si tu veux nettoyer sur unmount, dé-commente ci-dessous.
    // return () => {
    //   document.head.querySelectorAll('[data-qvt="1"]').forEach((el) => el.remove());
    // };

  }, [
    title,
    titleTemplate,
    description,
    keywords,
    ogImage,
    url,
    type,
    siteName,
    locale,
    indexable,
    twitterSite,
    jsonLd,
  ]);

  return null;
};
