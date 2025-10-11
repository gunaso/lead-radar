export type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type CompetitorInput = {
  name: string
  website?: string | null
}

export type SourceOption =
  | "Youtube"
  | "Reddit"
  | "Twitter / X"
  | "Google Search"
  | "LLM Recommendation"
  | "A friend or colleague"
  | "Newsletter / Blog"
  | "Other"

export type GoalOption =
  | "Find new leads"
  | "Improve AI visibility"
  | "Monitor my industry / competitors"
  | "Understand audience pain points"

export type CompanyRoleOption =
  | "Founder / CEO"
  | "Co-Founder"
  | "Product Manager"
  | "Marketing Manager"
  | "Growth Manager"
  | "Community Manager"
  | "Developer"
  | "Designer"
  | "Sales"
  | "Customer Success"
  | "Other"

export const SOURCE_OPTIONS = [
  "Youtube",
  "Reddit",
  "Twitter / X",
  "Google Search",
  "LLM Recommendation",
  "A friend or colleague",
  "Newsletter / Blog",
  "Other",
] as const satisfies readonly SourceOption[]

export const GOAL_OPTIONS = [
  "Find new leads",
  "Improve AI visibility",
  "Monitor my industry / competitors",
  "Understand audience pain points",
] as const satisfies readonly GoalOption[]

export const COMPANY_ROLES = [
  "Founder / CEO",
  "Co-Founder",
  "Product Manager",
  "Marketing Manager",
  "Growth Manager",
  "Community Manager",
  "Developer",
  "Designer",
  "Sales",
  "Customer Success",
  "Other",
] as const satisfies readonly CompanyRoleOption[]

