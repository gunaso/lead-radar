type Competitor = {
  id: number
  name: string
  logo: string | null
  website: string | null
  owner: Owner
  createdAt: string
}

type Keyword = {
  id: number
  name: string
  owner: Owner
  posts: number
  comments: number
  createdAt: string
}

type Subreddit = {
  id: number
  name: string
  image: string | null
  owner: Owner
  posts: number
  comments: number
  createdAt: string
}

type Workspace = {
  company: string
  logo: string | null
}

type Owner = {
  name: string
  image: string | null
}

export type { Competitor, Keyword, Owner, Subreddit, Workspace }