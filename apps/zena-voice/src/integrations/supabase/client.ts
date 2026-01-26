import { createSupabaseBrowserClient } from "@qvt/shared";
import type { Database } from "./types";

export const supabase = createSupabaseBrowserClient<Database>();
