import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Allow API routes to pass through without redirects
  if (pathname.startsWith("/api/")) {
    return supabaseResponse
  }

  // If authenticated, prevent access to login/signup
  if (user && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // If unauthenticated, block access to signout
  if (!user && pathname.startsWith("/auth/signout")) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // For all other unauthenticated routes, redirect to login except allowlist
  const isAllowlistedForGuests =
    pathname.startsWith("/login") ||
    pathname.startsWith("/error") ||
    pathname.startsWith("/login-email") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth/confirm") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")

  if (!user && !isAllowlistedForGuests) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // If authenticated but not fully onboarded, force redirect to onboarding for all non-auth routes
  if (user) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding")
        .eq("user_id", user.id)
        .single<{ onboarding: number | null }>()

      const isOnboarded = (profile?.onboarding ?? 0) === -1
      const isAuthRoute =
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/auth/") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password")

      const isOnboardingRoute = pathname.startsWith("/onboarding")

      if (!isOnboarded && !isOnboardingRoute && !isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = "/onboarding"
        return NextResponse.redirect(url)
      }
    } catch (_e) {
      // Ignore and fall through
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.* (favicon files - all formats)
     * - *.webp, *.png, *.jpg, *.jpeg, *.svg, *.ico (static assets)
     */
    "/((?!_next/static|_next/image|favicon\\..*|.*\\.(?:webp|png|jpg|jpeg|svg|ico|gif)).*)",
  ],
}


