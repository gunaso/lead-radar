import {
  ClipboardCheck,
  ClipboardClock,
  ClipboardCopy,
  Clipboard,
  Ellipsis,
  Package,
} from "lucide-react"

import { GenericDropdown } from "@/components/ui/dropdown-menu"

type Status =
  | "Needs Review"
  | "Ready to Engage"
  | "Engaging"
  | "Engaged"
  | "Archived"

type StatusDropdownProps = {
  initialStatus?: Status
  onStatusChange?: (status: Status) => void
}

function StatusDropdown({
  initialStatus = "Needs Review",
  onStatusChange,
}: StatusDropdownProps) {
  return (
    <GenericDropdown<Status>
      initialValue={initialStatus}
      options={[
        "Engaged",
        "Engaging",
        "Ready to Engage",
        "Needs Review",
        "Archived",
      ]}
      onValueChange={onStatusChange}
      renderIcon={(status) => <StatusIcon status={status} />}
      contentClassName="min-w-44"
    />
  )
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "Needs Review") {
    return <Clipboard className="text-muted-foreground size-4" />
  }
  if (status === "Ready to Engage") {
    return <ClipboardCopy className="text-ongoing size-4" />
  }
  if (status === "Engaging") {
    return <ClipboardClock className="text-success size-4" />
  }
  if (status === "Engaged") {
    return <ClipboardCheck className="text-primary size-4" />
  }
  if (status === "Archived") {
    return <Package className="text-muted-foreground/60 size-4" />
  }
  return <Ellipsis className="text-muted-foreground size-4" />
}

export { StatusDropdown, StatusIcon, type Status }
