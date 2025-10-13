"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useHeaderConfig } from "@/components/header/header-context"

export default function Header() {
  const { isMobile } = useSidebar()
  const { config } = useHeaderConfig()

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
          <span className="text-sm font-semibold truncate">
            {config.title ?? ""}
          </span>
          {config.titleActions && config.titleActions.length > 0 && (
            <div className="flex items-center gap-2">
              {config.titleActions.map((action) => (
                <span key={action.key}>{action.element}</span>
              ))}
            </div>
          )}
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
