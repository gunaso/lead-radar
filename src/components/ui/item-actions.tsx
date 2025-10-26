"use client"

import { useState } from "react"
import Link from "next/link"

import { MessageCircleReply, FolderOpen } from "lucide-react"

import { ReplyAssistant } from "@/components/replies/reply-assistant"
import { Button } from "@/components/ui/button"

function ItemActions({
  redditItemUrl,
  openUrl,
  context,
  extraActions,
}: {
  redditItemUrl: string
  openUrl?: string
  context?: {
    postTitle?: string
    subreddit?: string
    keywords?: string[]
    commentsSample?: string[]
  }
  extraActions?: React.ReactNode
}) {
  const [replyOpen, setReplyOpen] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 justify-between">
        <div className="flex items-center gap-2">{extraActions}</div>
        <div className="flex items-center gap-1.5 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setReplyOpen((v) => !v)}
          >
            <MessageCircleReply className="size-3.5" />
            Reply
          </Button>
          {openUrl && (
            <Link href={openUrl}>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <FolderOpen className="size-3.5" />
                Open
              </Button>
            </Link>
          )}
        </div>
      </div>
      {replyOpen && redditItemUrl && (
        <ReplyAssistant
          redditItemUrl={redditItemUrl}
          context={context}
          onClose={() => setReplyOpen(false)}
        />
      )}
    </div>
  )
}

export { ItemActions }
