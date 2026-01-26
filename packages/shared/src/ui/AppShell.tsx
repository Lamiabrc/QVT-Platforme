import type { ReactNode } from "react";
import type { UniverseConfig } from "../theme/universe";

type AppShellProps = {
  universe: UniverseConfig;
  children: ReactNode;
  mainClassName?: string;
};

export const AppShell = ({ universe, children, mainClassName }: AppShellProps) => {
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
          <div className="mx-auto w-full max-w-6xl px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-foreground">{universe.name}</div>
              <div className="text-xs text-muted-foreground">{universe.tagline}</div>
            </div>
          </div>
        </header>
      ) : null}

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
