// Centralized React Query keys

export const qk = {
  profile: () => ["profile"] as const,
  keywords: () => ["keywords"] as const,
  competitors: () => ["competitors"] as const,
  subreddits: () => ["subreddits"] as const,
  workspace: {
    base: () => ["workspace"] as const,
    byId: (id: string | null) => ["workspace", id] as const,
    validation: {
      company: (name: string) => ["workspace", "validate", "company", name] as const,
      name: (name: string) => ["workspace", "validate", "name", name] as const,
      website: (website: string) => ["workspace", "validate", "website", website] as const,
    },
  },
}

export type QueryKey = ReturnType<
  | typeof qk.profile
  | typeof qk.keywords
  | typeof qk.competitors
  | typeof qk.subreddits
  | typeof qk.workspace.base
  | typeof qk.workspace.byId
  | typeof qk.workspace.validation.company
  | typeof qk.workspace.validation.name
  | typeof qk.workspace.validation.website
>



