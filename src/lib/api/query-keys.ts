// Centralized React Query keys

export const qk = {
  profile: () => ["profile"] as const,
  workspace: {
    base: () => ["workspace"] as const,
    byId: (id: number | null) => ["workspace", id] as const,
    validation: {
      company: (name: string) => ["workspace", "validate", "company", name] as const,
      name: (name: string) => ["workspace", "validate", "name", name] as const,
      website: (website: string) => ["workspace", "validate", "website", website] as const,
    },
  },
}

export type QueryKey = ReturnType<
  | typeof qk.profile
  | typeof qk.workspace.base
  | typeof qk.workspace.byId
  | typeof qk.workspace.validation.company
  | typeof qk.workspace.validation.name
  | typeof qk.workspace.validation.website
>



