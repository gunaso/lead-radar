import type { SupabaseClient } from "@supabase/supabase-js"

import { getUserClient } from "@/services/supabase/user"

export async function getUserWorkspaceId(client?: SupabaseClient) {
  const supabase = client ?? (await getUserClient())
  const { data } = await supabase
    .from("profiles")
    .select("workspace")
    .single()
  return data?.workspace as string | null | undefined
}



