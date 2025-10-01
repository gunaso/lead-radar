import { createAdminClient } from "@/lib/supabase/admin"

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
 */
export async function linkEntitiesToWorkspace(
  entityType: 'keywords' | 'subreddits',
  workspaceId: number,
  items: string[],
  userId: string
): Promise<void> {
  if (!items || items.length === 0) return

  const config = ENTITY_CONFIGS[entityType]
  const adminClient = createAdminClient()

  // Clear existing links for this workspace
  await adminClient
    .from(config.linkTable)
    .delete()
    .eq("workspace", workspaceId)

  // Process each item
  for (const itemName of items) {
    const trimmedName = itemName.trim()
    if (!trimmedName) continue

    // Check if entity exists
    const { data: existingEntity } = await adminClient
      .from(config.entityTable)
      .select("id")
      .eq("name", trimmedName)
      .single()

    let entityId: number

    if (existingEntity) {
      entityId = existingEntity.id
    } else {
      // Create new entity
      const { data: newEntity, error: entityError } = await adminClient
        .from(config.entityTable)
        .insert({ name: trimmedName })
        .select("id")
        .single()

      if (entityError || !newEntity) {
        console.error(`Error creating ${entityType.slice(0, -1)}:`, entityError)
        continue
      }
      entityId = newEntity.id
    }

    // Link entity to workspace
    await adminClient.from(config.linkTable).insert({
      workspace: workspaceId,
      [config.entityColumn]: entityId,
      created_by: userId,
    })
  }
}

/**
 * Links competitors to a workspace.
 * Competitors don't have a separate entity table, so they're handled differently.
 * 
 * @param workspaceId - ID of the workspace
 * @param competitors - Array of competitor names
 * @param userId - ID of the user creating the competitors
 */
export async function linkCompetitorsToWorkspace(
  workspaceId: number,
  competitors: string[],
  userId: string
): Promise<void> {
  if (!competitors || competitors.length === 0) return

  const adminClient = createAdminClient()

  // Clear existing competitors for this workspace
  await adminClient
    .from("competitors")
    .delete()
    .eq("workspace", workspaceId)

  // Insert new competitors
  for (const competitorName of competitors) {
    const trimmedCompetitor = competitorName.trim()
    if (!trimmedCompetitor) continue

    await adminClient.from("competitors").insert({
      workspace: workspaceId,
      name: trimmedCompetitor,
      created_by: userId,
    })
  }
}

