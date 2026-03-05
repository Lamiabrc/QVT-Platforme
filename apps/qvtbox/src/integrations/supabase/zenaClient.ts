import { createSupabaseBrowserClient } from "@qvt/shared";

// Dedicated untyped client for ZenaFamily tables that are not in Database public types.
export const zenaSupabase = createSupabaseBrowserClient<any>();
