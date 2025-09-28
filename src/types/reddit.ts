export type Sentiment = "Positive" | "Neutral" | "Negative"

export type Post = {
  id: string
  title: string
  content: string
  subreddit: string
  user: string
  createdAt: Date
  sentiment: Sentiment
  keywords: string[]
  url: string
}

export type Comment = {
  id: string
  content: string
  user: string
  createdAt: Date
  sentiment: Sentiment
  post: Pick<Post, "id" | "title" | "subreddit" | "url">
}


