import type { ReactNode } from "react";
import { QVTBOX_URL, ZENA_FAMILY_URL, ZENA_VOICE_URL } from "../config/links";
import type { UniverseConfig } from "../theme/universe";

type AppShellProps = {
  universe: UniverseConfig;
  children: ReactNode;
  mainClassName?: string;
  account?: {
    isAuthenticated: boolean;
    accountHref: string;
    onSignOut: () => void;
  };
};

export const AppShell = ({
  universe,
  children,
  mainClassName,
  account,
}: AppShellProps) => {
  const styleVars: Record<string, string> = {
    "--background": universe.background,
    "--foreground": universe.foreground,
    "--accent": universe.accent,
    "--accent-foreground": universe.accentForeground,
    "--primary": universe.primary,
    "--primary-foreground": universe.primaryForeground,
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={styleVars}>
      {universe.showHeader ? (
        <header className="border-b border-border/40 bg-background/80 backdrop-blur">
          <div className="mx-auto w-full max-w-6xl px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold text-foreground">{universe.name}</div>
              <div className="text-xs text-muted-foreground">{universe.tagline}</div>
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-sm">
              {[
                { label: "QVT Box", href: QVTBOX_URL },
                { label: "ZENA Family", href: ZENA_FAMILY_URL },
                { label: "ZENA Voice", href: ZENA_VOICE_URL },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {account ? (
                account.isAuthenticated ? (
                  <>
                    <a
                      href={account.accountHref}
                      className="ml-1 inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      Mon compte
                    </a>
                    <button
                      type="button"
                      onClick={account.onSignOut}
                      className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <a
                    href={account.accountHref}
                    className="ml-1 inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Mon compte
                  </a>
                )
              ) : null}
              {universe.cta ? (
                <a
                  href={universe.cta.href}
                  className="ml-1 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {universe.cta.label}
                </a>
              ) : null}
            </nav>
          </div>
        </header>
      ) : null}

      <div className="border-b border-border/30 bg-background/70">
        <div className="mx-auto w-full max-w-6xl px-6 py-2 text-[0.68rem] uppercase tracking-[0.35em] text-muted-foreground">
          Écouter • Protéger • Agir
        </div>
      </div>

      <main className={mainClassName}>{children}</main>

      {universe.showFooter ? (
        <footer className="border-t border-border/40 bg-background/70">
          <div className="mx-auto w-full max-w-6xl px-6 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-muted-foreground">
            <span>QVT Platform</span>
            <div className="flex flex-wrap gap-4">
              {universe.footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
};
