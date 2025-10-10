import type { SupabaseClient } from "@supabase/supabase-js"

import { getUserClient } from "@/services/supabase/user"

export type Profile = {
  onboarding: number
  workspace: number | null
  name: string | null
  role: string | null
}

export async function fetchProfile(client?: SupabaseClient) {
  const supabase = client ?? (await getUserClient())
  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding, workspace, name, role")
    .single()
  if (error) throw error
  return data as Profile
}

export async function updateProfile(payload: { name?: string; role?: string }, client?: SupabaseClient) {
  const supabase = client ?? (await getUserClient())
  const { error } = await supabase.from("profiles").update(payload)
  if (error) throw error
}



