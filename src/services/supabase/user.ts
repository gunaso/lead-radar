import type { SupabaseClient } from "@supabase/supabase-js"

import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

// Returns an authenticated supabase client for the current environment
export async function getUserClient(): Promise<SupabaseClient> {
  if (typeof window === "undefined") {
    return await createServerClient()
  }
  return createBrowserClient()
}



