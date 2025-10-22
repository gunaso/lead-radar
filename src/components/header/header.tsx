"use client"

import Link from "next/link"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { useHeaderConfig } from "@/components/header/header-context"
import LoadingDots from "@/components/ui/loading-dots"
import { Separator } from "@/components/ui/separator"
import {
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  Breadcrumb,
} from "@/components/ui/breadcrumb"

import { useBreadcrumbs } from "@/hooks/use-breadcrumbs"

export default function Header() {
  const { isMobile } = useSidebar()
  const { config } = useHeaderConfig()
  const crumbs = useBreadcrumbs(config.breadcrumbs)

  return (
    <header className="page-padding-x flex h-10 shrink-0 items-center gap-2 border-b-1">
      {isMobile && (
        <>
          <SidebarTrigger className="[&_svg]:size-4" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </>
      )}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 min-w-0">
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((c, idx) => {
                const isLast = idx === crumbs.length - 1
                return (
                  <BreadcrumbItem key={c.key}>
                    {isLast ? (
                      <BreadcrumbPage>
                        {c.loading ? <LoadingDots label="Loading" /> : c.label}
                      </BreadcrumbPage>
                    ) : c.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={c.href}>{c.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <span className="text-muted-foreground">{c.label}</span>
                    )}
                    {!isLast && <BreadcrumbSeparator />}
                  </BreadcrumbItem>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {config.actions && config.actions.length > 0 && (
          <div className="flex items-center gap-2">
            {config.actions.map((action) => (
              <span key={action.key}>{action.element}</span>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
