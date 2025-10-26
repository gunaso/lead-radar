type SubredditType = {
  name: string
  image: string
  url: string
  rules: string
}

type PostType = {
  id: string
  title: string
  content: string
  author: string
  subreddit: SubredditType
  sentiment: SentimentType
  status: StatusType
  score: ScoreType
  keywords: string[]
  summary: string
  postedAt: string
  url: string
}

type PostCommentType = {
  id: string
  content: string
  status: StatusType
  score: ScoreType
  sentiment: SentimentType
  author: string
  postedAt: string
  url: string
}

type CommentType = PostCommentType & {
  post: PostType
  subreddit: SubredditType
  keywords: string[]
  summary: string
}

type SentimentType = "Positive" | "Neutral" | "Negative"

type ScoreType = "Prime" | "High" | "Medium" | "Low"

type StatusType =
| "Needs Review"
| "Ready to Engage"
| "Engaging"
| "Engaged"
| "Archived"

export type {
  PostCommentType,
  SubredditType,
  SentimentType,
  CommentType,
  StatusType,
  ScoreType,
  PostType,
}