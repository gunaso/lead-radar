"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Link from "next/link"

import { Ellipsis } from "lucide-react"

import { SidebarMenuButton } from "@/components/ui/sidebar"
import { SubredditAvatar } from "@/components/ui/avatar"
import { collapseVariants } from "@/lib/motion-config"
import { NavGroupContainer } from "./nav-group"

type SubredditEntry = {
  id: number
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
            key={subreddit.id}
            initial="closed"
            animate="open"
            exit="closed"
            variants={collapseVariants}
            className="overflow-hidden"
          >
            <SidebarMenuButton asChild>
              <Link href={`/subreddits/${subreddit.id}`}>
                <SubredditAvatar
                  classFallback="text-2xs font-medium"
                  className="size-4"
                  image={subreddit.image}
                  name={subreddit.name}
                />
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
