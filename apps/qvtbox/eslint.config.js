// eslint.config.ts
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // 0) Ignorés globalement
  { ignores: ["dist", "build", "coverage", "node_modules", "supabase/functions/**"] },

  // 1) Base TS/React (rapide, non "type-aware")
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    rules: {
      // Hooks React
      ...reactHooks.configs.recommended.rules,

      // Fast Refresh: ne pas exporter autre chose que des composants depuis un module de composant
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // Mieux que "off" : on tolère les variables/arguments préfixés par _
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }
      ],

      // Un peu d’hygiène
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn"
    }
  },

  // 2) Surcouche "type-aware" (active des règles plus intelligentes si tsconfig présent)
  //    -> nécessite TypeScript >= 5 et un tsconfig valide à la racine.
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // Active le service de projet TS sans lister manuellement chaque tsconfig
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      // ajustements fréquents pour éviter du bruit
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }
      ]
    }
  },

  // 3) Tests (ajuste à jest ou vitest selon ton stack)
  {
    files: ["**/*.{test,spec}.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest // si tu utilises Vitest, remplace par: ...globals.vitest
      }
    },
    rules: {
      "no-console": "off"
    }
  }
);



