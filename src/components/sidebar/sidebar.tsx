"use client"

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

const navWorkspace = {
  label: "Workspace",
  items: [
    {
      title: "Posts",
      url: "#",
      icon: Newspaper,
    },
    {
      title: "Comments",
      url: "#",
      icon: MessageCircle,
    },
  ],
}

const navTracking = {
  label: "Tracking",
  items: [
    {
      title: "Keywords",
      url: "#",
      icon: SearchCheck,
    },
    {
      title: "Subreddits",
      url: "#",
      icon: Layers,
    },
    {
      title: "Competitors",
      url: "#",
      icon: Swords,
    },
  ],
}

const navSubreddits = {
  label: "Subreddits",
  items: [
    {
      name: "r/SEO",
      image: null,
    },
    {
      name: "r/seogrowth",
      image:
        "https://styles.redditmedia.com/t5_4t7j8c/styles/communityIcon_gkpdve958xd71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=c8f055a39e68cc07a0f3573aba5f4fcc948291db",
    },
    {
      name: "r/SEO_Digital_Marketing",
      image:
        "https://styles.redditmedia.com/t5_3j43f/styles/communityIcon_tmxl7sjsju6d1.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=7b0a0073eefd147872ba5934c0157f3ffd150325",
    },
    {
      name: "r/bigseo",
      image:
        "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
    },
    {
      name: "r/SEO_Experts",
      image:
        "https://styles.redditmedia.com/t5_bshop8/styles/communityIcon_bei333mntv7d1.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=f4f1ad8fb4298cd5549d8591386b842402e7ef14",
    },
    {
      name: "r/localseo",
      image:
        "https://styles.redditmedia.com/t5_2sg2d/styles/communityIcon_obywzu5hm0991.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=a32231c60c3395edfc6da995de1de20198e4a3f1",
    },
  ],
}

export default function Sidebar({
  ...props
}: React.ComponentProps<typeof SidebarComponent>) {
  return (
    <SidebarComponent variant="inset" {...props}>
      <NavHeader />
      <SidebarContent>
        <UpgradeToPro />
        <Inbox notification />
        <NavGroup label={navTracking.label} items={navTracking.items} />
        <NavGroup label={navWorkspace.label} items={navWorkspace.items} />
        <NavSubreddits subreddits={navSubreddits.items} />
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
  return (
    <SidebarGroup>
      <SidebarMenuButton className="justify-between">
        <span className="flex items-center gap-2">
          <InboxIcon className="size-4" />
          Inbox
        </span>
        {notification && (
          <span className="size-2 mr-1 rounded-full bg-primary" />
        )}
      </SidebarMenuButton>
    </SidebarGroup>
  )
}
