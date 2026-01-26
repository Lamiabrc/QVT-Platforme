import type { Config } from "tailwindcss";
import sharedPreset from "@qvt/shared/tailwind.preset";

export default {
  presets: [sharedPreset],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
