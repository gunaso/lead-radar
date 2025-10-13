import { PlusIcon } from "lucide-react"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function Header() {
  const { isMobile } = useSidebar()

  return (
    <header className="flex h-10 shrink-0 items-center gap-2 lg:pl-8 lg:pr-6 pl-4 pr-5 border-b-1">
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
        <span className="text-sm font-semibold">Keywords</span>
        <Button variant="outline" size="sm">
          <PlusIcon className="size-4" />
          New Keyword
        </Button>
      </div>
    </header>
  )
}
