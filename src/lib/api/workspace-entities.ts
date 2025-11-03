import type { SupabaseClient } from "@supabase/supabase-js"

type EntityConfig = {
  entityTable: string
  linkTable: string
  entityColumn: string
}

const ENTITY_CONFIGS: Record<string, EntityConfig> = {
  keywords: {
    entityTable: "keywords",
    linkTable: "workspaces_keywords",
    entityColumn: "keyword",
  },
  subreddits: {
    entityTable: "subreddits",
    linkTable: "workspaces_subreddits",
    entityColumn: "subreddit",
  },
}

/**
 * Generic function to link entities (keywords/subreddits) to a workspace.
 * Follows the pattern:
 * 1. Clear existing links
 * 2. For each item: find or create entity
 * 3. Create link between workspace and entity
 * 
 * @param entityType - Type of entity ('keywords' or 'subreddits')
 * @param workspaceId - ID of the workspace
 * @param items - Array of entity names to link
 * @param userId - ID of the user creating the links
 * @param supabase - Authenticated Supabase client
 */
export async function linkEntitiesToWorkspace(
  entityType: 'keywords' | 'subreddits',
  workspaceId: string,
  items: string[],
  userId: string,
  supabase: SupabaseClient
): Promise<void> {
  const config = ENTITY_CONFIGS[entityType]

  // Always clear existing links for this workspace first
  await supabase
    .from(config.linkTable)
    .delete()
    .eq("workspace", workspaceId)

  // If no items provided, we're done (removes associations without deleting entities)
  if (!items || items.length === 0) return

  // Process each item
  for (const itemName of items) {
    let trimmedName = itemName.trim()
    // Normalize subreddits by stripping the r/ prefix for canonical storage
    if (entityType === 'subreddits') {
      trimmedName = trimmedName.replace(/^r\//i, '')
    }
    if (!trimmedName) continue

    // Check if entity exists (case-insensitive for subreddits)
  let existingEntity: { id: string } | null = null
    if (entityType === 'subreddits') {
      const { data } = await supabase
        .from(config.entityTable)
        .select("id")
        .ilike("name", trimmedName)
        .single()
      existingEntity = data as any
    } else {
      const { data } = await supabase
        .from(config.entityTable)
        .select("id")
        .eq("name", trimmedName)
        .single()
      existingEntity = data as any
    }

  let entityId: string

    if (existingEntity) {
      entityId = existingEntity.id
    } else {
      // Create new entity
      const insertPayload: Record<string, unknown> = { name: trimmedName }
      if (entityType === 'keywords') {
        insertPayload.value = trimmedName.toLowerCase()
      } else if (entityType === 'subreddits') {
        // Attempt to fetch subreddit metadata from Reddit and map fields
        try {
          const res = await fetch(`https://www.reddit.com/r/${encodeURIComponent(trimmedName)}/about.json`, {
            mode: "cors",
            // Node runtime ignores mode, included for consistency
          })
          if (res.ok) {
            const json = await res.json()
            const d = json?.data ?? {}
            // Field mappings
            // name -> display_name (we already set name to trimmedName)
            if (typeof d.title === 'string') insertPayload.title = d.title
            if (typeof d.public_description === 'string') insertPayload.description = d.public_description
            if (typeof d.description === 'string') insertPayload.description_reddit = d.description
          }
        } catch (e) {
          // Ignore fetch errors and proceed with minimal insert
          // Intentionally left blank
        }
      }

      const { data: newEntity, error: entityError } = await supabase
        .from(config.entityTable)
        .insert(insertPayload)
        .select("id")
        .single()

      if (entityError || !newEntity) {
        console.error(`Error creating ${entityType.slice(0, -1)}:`, entityError)
        continue
      }
      entityId = newEntity.id
    }

    // Link entity to workspace
    await supabase.from(config.linkTable).insert({
      workspace: workspaceId,
      [config.entityColumn]: entityId,
      created_by: userId,
    })
  }
}

export type SubredditDetailsInput = {
  name: string
  title?: string | null
  description?: string | null
  description_reddit?: string | null
  created_utc?: number | null // unix seconds; will be converted to date (YYYY-MM-DD)
  total_members?: number | null
}

/**
 * Specialized helper to upsert subreddits with metadata and link to a workspace.
 */
export async function linkSubredditsToWorkspace(
  workspaceId: string,
  names: string[],
  details: SubredditDetailsInput[] | undefined,
  userId: string,
  supabase: SupabaseClient
): Promise<void> {
  // Clear existing links
  {
    const { error } = await supabase
      .from("workspaces_subreddits")
      .delete()
      .eq("workspace", workspaceId)
    if (error) {
      console.error("Failed clearing existing subreddit links:", error)
    }
  }

  if (!names || names.length === 0) return

  const detailsByName = new Map<string, SubredditDetailsInput>()
  for (const d of details || []) {
    const key = (d?.name || "").replace(/^r\//i, "").trim().toLowerCase()
    if (key) detailsByName.set(key, d)
  }

  for (const raw of names) {
    const canonical = raw.replace(/^r\//i, "").trim()
    if (!canonical) continue
    const key = canonical.toLowerCase()
    const meta = detailsByName.get(key)

    // Check if subreddit exists (case-insensitive)
    let entityId: string | null = null
    const { data: existing, error: existingError } = await supabase
      .from("subreddits")
      .select("id")
      .ilike("name", canonical)
      .single()
    if (existingError && existingError.code !== "PGRST116") {
      // Ignore "No rows" but log other errors
      console.error("Error checking existing subreddit:", { name: canonical, error: existingError })
    }
    if (existing?.id) {
      entityId = existing.id
      // Optionally update metadata if provided
      const updatePayload: Record<string, unknown> = {}
      if (meta) {
        if (typeof meta.title === 'string') updatePayload.title = meta.title
        if (typeof meta.description === 'string') updatePayload.description = meta.description
        if (typeof meta.description_reddit === 'string') updatePayload.description_reddit = meta.description_reddit
      }
      if (Object.keys(updatePayload).length > 0) {
        await supabase.from("subreddits").update(updatePayload).eq("id", entityId)
      }
    } else {
      // Insert new with metadata
      const insertPayload: Record<string, unknown> = { name: key }
      if (meta) {
        if (typeof meta.title === 'string') insertPayload.title = meta.title
        if (typeof meta.description === 'string') insertPayload.description = meta.description
        if (typeof meta.description_reddit === 'string') insertPayload.description_reddit = meta.description_reddit
      }
      const { data: newRow, error } = await supabase
        .from("subreddits")
        .insert(insertPayload)
        .select("id")
        .single()
      if (error || !newRow) {
        console.error("Error inserting subreddit:", { name: key, error })
        continue
      }
      entityId = newRow.id
    }

    if (!entityId) continue
    const { error: linkError } = await supabase.from("workspaces_subreddits").insert({
      workspace: workspaceId,
      subreddit: entityId,
      created_by: userId,
    })
    if (linkError) {
      console.error("Error linking subreddit to workspace:", { workspaceId, subredditId: entityId, error: linkError })
    }
  }
}

export type CompetitorInput = {
  name: string
  website?: string | null
}

/**
 * Links competitors to a workspace.
 * Clears existing competitors and inserts the provided list.
 */
export async function linkCompetitorsToWorkspace(
  workspaceId: string,
  competitors: Array<CompetitorInput | string>,
  userId: string,
  supabase: SupabaseClient
): Promise<void> {
  // Always clear existing competitors for this workspace
  await supabase.from("competitors").delete().eq("workspace", workspaceId)

  if (!competitors || competitors.length === 0) return

  for (const item of competitors) {
    const name = (typeof item === "string" ? item : item?.name)?.trim() || ""
    if (!name) continue

    const websiteRaw = typeof item === "string" ? undefined : item?.website
    const website = (websiteRaw || "").trim()

    await supabase.from("competitors").insert({
      workspace: workspaceId,
      name,
      website: website || null,
      created_by: userId,
    })
  }
}

