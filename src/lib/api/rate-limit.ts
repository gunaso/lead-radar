import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/db.types"

export type TicketType = "support" | "feedback"

type CheckResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number }

const DEFAULT_WINDOW_SECONDS = 60 * 60 // 1 hour
const DEFAULT_LIMIT = 3

export async function checkAndConsumeTicketRateLimit({
  supabase,
  userId,
  ticketType,
  limit = DEFAULT_LIMIT,
  windowSeconds = DEFAULT_WINDOW_SECONDS,
}: {
  supabase: SupabaseClient<Database>
  userId: string
  ticketType: TicketType
  limit?: number
  windowSeconds?: number
}): Promise<CheckResult> {
  const now = Date.now()
  const windowStart = new Date(now - windowSeconds * 1000).toISOString()

  // Best-effort cleanup of old rows (keeps table small)
  const cutoff = new Date(now - 24 * 60 * 60 * 1000).toISOString()
  await supabase
    .from("ticket_rate_limits")
    .delete()
    .eq("user_id", userId)
    .lt("created_at", cutoff)

  const { data: recent, error } = await supabase
    .from("ticket_rate_limits")
    .select("created_at")
    .eq("user_id", userId)
    .eq("ticket_type", ticketType)
    .gte("created_at", windowStart)
    .order("created_at", { ascending: true })

  if (error) {
    // If rate-limiter fails, fail open (don't block real users)
    return { allowed: true }
  }

  const count = recent?.length ?? 0
  if (count >= limit) {
    const oldest = recent?.[0]?.created_at
    const oldestMs = oldest ? new Date(oldest).getTime() : now
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldestMs + windowSeconds * 1000 - now) / 1000)
    )
    return { allowed: false, retryAfterSeconds }
  }

  // Consume a token
  await supabase.from("ticket_rate_limits").insert({
    user_id: userId,
    ticket_type: ticketType,
  })

  return { allowed: true }
}

