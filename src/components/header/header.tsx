"use client"

import Link from "next/link"

import { PanelRightIcon } from "lucide-react"

import { useSideSlot } from "@/components/side-slot/side-slot-context"
import { useHeaderConfig } from "@/components/header/header-context"
import { SidebarTrigger } from "@/components/ui/sidebar"
import LoadingDots from "@/components/ui/loading-dots"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  Breadcrumb,
} from "@/components/ui/breadcrumb"

import { useIsBellowLg, useIsMobile } from "@/hooks/use-mobile"
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs"

export default function Header() {
  const isBelowLg = useIsBellowLg()
  const isMobile = useIsMobile()
  const { config } = useHeaderConfig()
  const { config: sideSlotConfig, setOpenMobile } = useSideSlot()
  const crumbs = useBreadcrumbs(config.breadcrumbs)

  return (
    <header className="page-padding-x flex h-10 shrink-0 items-center gap-2 border-b-[0.5px] max-[28rem]:h-20">
      {isBelowLg && (
        <>
          <SidebarTrigger className="[&_svg]:size-4" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </>
      )}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-5 min-w-0 max-[28rem]:flex-col max-[28rem]:gap-2 max-[28rem]:items-start">
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
          {config.afterCrumbs}
        </div>
        {config.actions && config.actions.length > 0 && (
          <div className="flex items-center gap-2">
            {config.actions.map((action) => (
              <span key={action.key}>{action.element}</span>
            ))}
          </div>
        )}
      </div>
      {isMobile && sideSlotConfig?.content && (
        <Button
          variant="ghost"
          size="icon"
          className="[&_svg]:size-4"
          onClick={() => setOpenMobile(true)}
        >
          <PanelRightIcon />
          <span className="sr-only">Open Side Slot</span>
        </Button>
      )}
    </header>
  )
}
