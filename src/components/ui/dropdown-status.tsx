import {
  ClipboardCheck,
  ClipboardClock,
  ClipboardCopy,
  Clipboard,
  Ellipsis,
  Package,
} from "lucide-react"

import { GenericDropdown } from "@/components/ui/dropdown-menu"

import { type StatusType } from "@/types/reddit"
import { cn } from "@/lib/utils"

type StatusDropdownProps = {
  initialStatus?: StatusType
  onStatusChange?: (status: StatusType) => void
  showLabelInTrigger?: boolean
}

function StatusDropdown({
  initialStatus = "Needs Review",
  onStatusChange,
  showLabelInTrigger = false,
}: StatusDropdownProps) {
  return (
    <GenericDropdown<StatusType>
      initialValue={initialStatus}
      options={[
        "Engaged",
        "Engaging",
        "Ready to Engage",
        "Needs Review",
        "Archived",
      ]}
      onValueChange={onStatusChange}
      renderIcon={(status, bigIcon) => (
        <StatusIcon status={status} bigIcon={bigIcon} />
      )}
      contentClassName="min-w-44"
      showLabelInTrigger={showLabelInTrigger}
    />
  )
}

function StatusIcon({
  status,
  bigIcon,
}: {
  status: StatusType
  bigIcon?: boolean
}) {
  const size = bigIcon ? "size-4.5" : "size-4"

  if (status === "Needs Review") {
    return <Clipboard className={cn("text-muted-foreground", size)} />
  }
  if (status === "Ready to Engage") {
    return <ClipboardCopy className={cn("text-ongoing", size)} />
  }
  if (status === "Engaging") {
    return <ClipboardClock className={cn("text-success", size)} />
  }
  if (status === "Engaged") {
    return <ClipboardCheck className={cn("text-primary", size)} />
  }
  if (status === "Archived") {
    return <Package className={cn("text-muted-foreground/60", size)} />
  }
  return <Ellipsis className={cn("text-muted-foreground", size)} />
}

export { StatusDropdown, StatusIcon }
