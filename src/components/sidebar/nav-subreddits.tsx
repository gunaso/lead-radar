"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { Ellipsis } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { collapseVariants } from "@/lib/motion-config"
import { NavGroupContainer } from "./nav-group"

type SubredditEntry = {
  name: string
  image: string | null
}

export default function NavSubreddits({
  subreddits,
}: {
  subreddits: SubredditEntry[]
}) {
  const [totalShowing, setTotalShowing] = useState(3)

  return (
    <NavGroupContainer label="Subreddits">
      <AnimatePresence initial={false}>
        {subreddits.slice(0, totalShowing).map((subreddit) => (
          <motion.div
            key={subreddit.name}
            initial="closed"
            animate="open"
            exit="closed"
            variants={collapseVariants}
            className="overflow-hidden"
          >
            <SidebarMenuButton asChild>
              <Link href={`/subreddits/${subreddit.name}`}>
                <Avatar className="size-4 rounded-full">
                  <AvatarImage
                    src={subreddit.image || undefined}
                    alt={subreddit.name}
                  />
                  <AvatarFallback className="text-2xs text-muted-foreground">
                    r/
                  </AvatarFallback>
                </Avatar>
                <span>{subreddit.name}</span>
              </Link>
            </SidebarMenuButton>
          </motion.div>
        ))}
      </AnimatePresence>
      {totalShowing < subreddits.length && (
        <SidebarMenuButton onClick={() => setTotalShowing(totalShowing + 5)}>
          <Ellipsis className="size-4" />
          <span>More</span>
        </SidebarMenuButton>
      )}
    </NavGroupContainer>
  )
}
