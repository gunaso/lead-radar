import { Suspense } from "react"
import { PostPageContent } from "@/components/post-page-content"

export default async function PostPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  return (
    <Suspense>
      <PostPageContent postId={params.id} />
    </Suspense>
  )
}
