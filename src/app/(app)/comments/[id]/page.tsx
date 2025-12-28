import { Suspense } from "react"
import { CommentPageContent } from "@/components/comment-page-content"

export default async function CommentPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  return (
    <Suspense>
      <CommentPageContent commentId={params.id} />
    </Suspense>
  )
}
