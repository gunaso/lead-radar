import { Suspense, type ReactElement } from "react"
import Link from "next/link"

import { Inbox } from "lucide-react"

import NotFoundAnimation from "@/components/lottie/not-found-animation"
import { HeaderConfig } from "@/components/header/header-context"
import AppShellLayout from "@/app/(app)/layout"
import { Button } from "@/components/ui/button"

import { PATHS } from "@/lib/path"

export default function NotFound(): ReactElement {
  return (
    <Suspense>
      <AppShellLayout>
        <HeaderConfig
          config={{ breadcrumbs: [{ key: "404", label: "404 Not found" }] }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto w-full max-w-md">
              <NotFoundAnimation />
            </div>
            <div className="inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
              404 • Not found
            </div>
            <h1 className="mt-6 text-3xl font-semibold">We lost this page</h1>
            <p className="mt-2 text-muted-foreground">
              The page you’re looking for doesn’t exist or has been moved.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href={PATHS.INBOX}>
                  Go back to your inbox
                  <Inbox className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </HeaderConfig>
      </AppShellLayout>
    </Suspense>
  )
}
