"use client"
import type { ReactElement } from "react"
import { useSearchParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ReplyPage(): ReactElement {
  const params = useSearchParams()
  const type = params.get("type") || "post"
  const id = params.get("id") || ""

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Reply</CardTitle>
          <CardDescription>
            Replying to {type} {id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Write your reply..." />
          <div className="flex justify-end">
            <Button>Send</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
