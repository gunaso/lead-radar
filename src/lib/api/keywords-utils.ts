import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Find a keyword by canonical value (lower-cased), or create it.
 * Uses admin client due to RLS on global tables.
 */
export async function findOrCreateKeywordId(
  admin: SupabaseClient,
  rawName: string
): Promise<string> {
  const name = rawName.trim()
  const canonical = name.toLowerCase()
  // Try find by value
  const { data: existing } = await admin
    .from("keywords")
    .select("id")
    .eq("value", canonical)
    .maybeSingle<{ id: string }>()
  if (existing?.id) return existing.id

  const { data: inserted, error: insertError } = await admin
    .from("keywords")
    .insert({ name, value: canonical })
    .select("id")
    .single<{ id: string }>()
  if (insertError || !inserted?.id) {
    throw Object.assign(new Error("Failed to create keyword"), { cause: insertError })
  }
  return inserted.id
}

/**
 * Ensure a keyword is marked as process=true when linked to at least one workspace.
 * Best-effort; ignores errors to avoid breaking UX.
 */
export async function markKeywordProcessTrue(
  admin: SupabaseClient,
  keywordId: string
): Promise<void> {
  try {
    await admin.from("keywords").update({ process: true }).eq("id", keywordId)
  } catch {
    // ignore
  }
}

/**
 * If a keyword is no longer linked by any workspace, mark process=false.
 * Uses admin client to bypass RLS for global count/update.
 */
export async function markKeywordProcessFalseIfUnlinked(
  admin: SupabaseClient,
  keywordId: string
): Promise<void> {
  try {
    const { count } = await admin
      .from("workspaces_keywords")
      .select("id", { count: "exact", head: true })
      .eq("keyword", keywordId)
    const remaining = count ?? 0
    if (remaining === 0) {
      await admin.from("keywords").update({ process: false }).eq("id", keywordId)
    }
  } catch {
    // ignore
  }
}


