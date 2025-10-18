import { FeedItem, type FeedItemType } from "@/components/feed-item"

type PostType = FeedItemType & {
  summary: string
}

function Post({ post }: { post: PostType }) {
  return (
    <FeedItem item={post} url="/posts">
      <div className="text-sm mx-4 mb-3 p-2 rounded-md bg-border/30 hidden group-hover:block">
        <span className="line-clamp-2">{post.summary}</span>
      </div>
    </FeedItem>
  )
}

export { Post, type PostType }
