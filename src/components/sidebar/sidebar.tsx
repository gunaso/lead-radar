"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"
import Link from "next/link"

import {
  MessageCircle,
  SearchCheck,
  InboxIcon,
  Newspaper,
  Rocket,
  Layers,
  Swords,
} from "lucide-react"

import { ShineBorder } from "@/components/ui/shine-border"
import NavCompetitors from "./nav-competitors"
import NavSubreddits from "./nav-subreddits"
import NavSecondary from "./nav-secondary"
import NavHeader from "./nav-header"
import NavGroup from "./nav-group"
import {
  Sidebar as SidebarComponent,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
} from "@/components/ui/sidebar"

import { useSubreddits } from "@/queries/subreddits"
import { PATHS } from "@/lib/path"

const navWorkspace = {
  label: "Workspace",
  items: [
    {
      title: "Posts",
      url: PATHS.POSTS,
      icon: Newspaper,
    },
    {
      title: "Comments",
      url: PATHS.COMMENTS,
      icon: MessageCircle,
    },
  ],
}

const navTracking = {
  label: "Tracking",
  items: [
    {
      title: "Keywords",
      url: PATHS.KEYWORDS,
      icon: SearchCheck,
    },
    {
      title: "Subreddits",
      url: PATHS.SUBREDDITS,
      icon: Layers,
    },
    {
      title: "Competitors",
      url: PATHS.COMPETITORS,
      icon: Swords,
    },
  ],
}

export default function Sidebar({
  ...props
}: React.ComponentProps<typeof SidebarComponent>) {
  const { data: subreddits = [] } = useSubreddits()
  const sidebarSubs = useMemo(
    () =>
      subreddits.map((s) => ({
        id: s.id,
        name: s.name,
        image: s.image,
      })),
    [subreddits]
  )
  return (
    <SidebarComponent variant="inset" {...props}>
      <NavHeader />
      <SidebarContent>
        <UpgradeToPro />
        <Inbox notification />
        <NavGroup label={navTracking.label} items={navTracking.items} />
        <NavGroup label={navWorkspace.label} items={navWorkspace.items} />
        <NavSubreddits subreddits={sidebarSubs} />
        <NavCompetitors />
        <NavSecondary />
      </SidebarContent>
    </SidebarComponent>
  )
}

function UpgradeToPro() {
  return (
    <div className="relative rounded-lg hover:cursor-pointer active:scale-100 hover:scale-103 transition-transform mx-1">
      <ShineBorder
        shineColor={["#8B79F8", "#FF90A6", "var(--primary)"]}
        duration={10}
      />
      <span className=" flex items-center justify-center gap-2 rounded-lg py-1.5 px-2.5 border">
        <span className="text-sm">Upgrade to Pro</span>
        <Rocket className="size-4" strokeWidth={1.5} />
      </span>
    </div>
  )
}

function Inbox({ notification = false }: { notification?: boolean }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenuButton isActive={pathname === PATHS.INBOX}>
        <Link
          href={PATHS.INBOX}
          className="flex items-center justify-between w-full hover:cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <InboxIcon className="size-4" />
            Inbox
          </span>
          {notification && (
            <span className="size-2 mr-1 rounded-full bg-primary" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarGroup>
  )
}
