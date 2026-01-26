export type ThemeTokens = {
  colors: {
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
  };
  radius: {
    base: string;
    sm: string;
    md: string;
  };
  typography: {
    fontSans: string;
    fontDisplay: string;
  };
  spacing: {
    container: string;
  };
};

export const baseTokens: ThemeTokens = {
  colors: {
    primary: "250 75% 68%",
    primaryForeground: "0 0% 98%",
    accent: "280 75% 65%",
    accentForeground: "280 15% 15%",
    background: "0 0% 100%",
    foreground: "240 10% 3.9%",
  },
  radius: {
    base: "1rem",
    sm: "0.5rem",
    md: "0.75rem",
  },
  typography: {
    fontSans: "Montserrat, sans-serif",
    fontDisplay: "Montserrat, sans-serif",
  },
  spacing: {
    container: "2rem",
  },
};
