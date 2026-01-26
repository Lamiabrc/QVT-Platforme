import { createSupabaseBrowserClient } from "@qvt/shared";
import type { Database } from "./types";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createSupabaseBrowserClient<Database>();
