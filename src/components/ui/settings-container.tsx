import { ReactNode } from "react"

import { CommingSoon } from "./comming-soon"

import { cn } from "@/lib/utils"

function SettingsContainer({
  title,
  children,
  className,
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className="flex flex-col w-full gap-2">
      {title && <span className="text-md font-medium">{title}</span>}
      <div
        className={cn(
          "flex flex-col w-full px-4 bg-card rounded-md border-[0.5px]",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

function SettingsContainerElem({
  title,
  description,
  children,
  className,
  childrenClassName,
  preTitle,
  commingSoon = false,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  childrenClassName?: string
  preTitle?: ReactNode
  commingSoon?: boolean
}) {
  return (
    <div
      className={cn(
        "group w-full py-3 min-h-15 flex items center justify-between not-last:border-b-[0.5px] first:rounded-t-md last:rounded-b-md",
        className
      )}
    >
      <div className="flex items-center gap-2 shrink-0">
        {preTitle && <>{preTitle}</>}
        <div className="flex flex-col justify-center shrink-0">
          <span className="flex items-center gap-2 text-md/tight">
            {title} {commingSoon && <CommingSoon />}
          </span>
          {description && (
            <span className="text-muted-foreground text-xs">{description}</span>
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex items-center justify-end w-full",
          childrenClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}

export { SettingsContainer, SettingsContainerElem }
