import { createClient } from "@supabase/supabase-js";

const getEnvValue = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing ${name}. Define it in your .env.local file.`);
  }
  return value;
};

export const createSupabaseBrowserClient = <Database>() => {
  const url = getEnvValue(import.meta.env.VITE_SUPABASE_URL, "VITE_SUPABASE_URL");
  const anonKey = getEnvValue(
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    "VITE_SUPABASE_ANON_KEY"
  );

  return createClient<Database>(url, anonKey, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};
