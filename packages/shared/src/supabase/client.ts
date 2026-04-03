import { createClient } from "@supabase/supabase-js";

const getEnvValue = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing ${name}. Define it in your .env.local file.`);
  }
  return value;
};

const isValidHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const createSupabaseBrowserClient = <Database>() => {
  const url = getEnvValue(import.meta.env.VITE_SUPABASE_URL, "VITE_SUPABASE_URL");
  const anonKey = getEnvValue(
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    "VITE_SUPABASE_ANON_KEY"
  );

  if (!isValidHttpUrl(url)) {
    throw new Error("Invalid VITE_SUPABASE_URL. Expected a full http(s) URL.");
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      storage: localStorage,
      persistSession: true,
      // Avoid infinite refresh loops when DNS/project URL is misconfigured.
      // Session refresh can still be triggered explicitly when needed.
      autoRefreshToken: false,
    },
  });
};
