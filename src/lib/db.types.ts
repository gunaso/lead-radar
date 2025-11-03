export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      competitors: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          updated_at: string | null
          updated_by: string | null
          website: string | null
          website_ai: string | null
          website_md: string | null
          workspace: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
          website_ai?: string | null
          website_md?: string | null
          workspace: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
          website_ai?: string | null
          website_md?: string | null
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitors_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      keywords: {
        Row: {
          created_at: string
          id: string
          name: string
          process: boolean
          similar_words: string[] | null
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          process?: boolean
          similar_words?: string[] | null
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          process?: boolean
          similar_words?: string[] | null
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          name: string | null
          onboarded: boolean
          onboarding: number
          role: string | null
          updated_at: string | null
          user_id: string
          workspace: string | null
        }
        Insert: {
          created_at?: string
          name?: string | null
          onboarded?: boolean
          onboarding?: number
          role?: string | null
          updated_at?: string | null
          user_id: string
          workspace?: string | null
        }
        Update: {
          created_at?: string
          name?: string | null
          onboarded?: boolean
          onboarding?: number
          role?: string | null
          updated_at?: string | null
          user_id?: string
          workspace?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_comments: {
        Row: {
          content: string | null
          display: boolean
          id: string
          imported_at: string
          post: string
          posted_at: string | null
          processed: boolean
          reddit_user: string | null
          score: number
          sentiment: Database["public"]["Enums"]["sentiment"]
          summary: string | null
          url: string | null
        }
        Insert: {
          content?: string | null
          display?: boolean
          id?: string
          imported_at?: string
          post: string
          posted_at?: string | null
          processed?: boolean
          reddit_user?: string | null
          score?: number
          sentiment?: Database["public"]["Enums"]["sentiment"]
          summary?: string | null
          url?: string | null
        }
        Update: {
          content?: string | null
          display?: boolean
          id?: string
          imported_at?: string
          post?: string
          posted_at?: string | null
          processed?: boolean
          reddit_user?: string | null
          score?: number
          sentiment?: Database["public"]["Enums"]["sentiment"]
          summary?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reddit_comments_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "reddit_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_comments_reddit_user_fkey"
            columns: ["reddit_user"]
            isOneToOne: false
            referencedRelation: "reddit_users"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_comments_keywords: {
        Row: {
          comment: string
          created_at: string
          id: string
          keyword: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          keyword: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          keyword?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_comments_keywords_comment_fkey"
            columns: ["comment"]
            isOneToOne: false
            referencedRelation: "reddit_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_comments_keywords_keyword_fkey"
            columns: ["keyword"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_posts: {
        Row: {
          bullet_points: string | null
          content: string | null
          created_at: string | null
          display: boolean
          id: string
          imported_at: string
          processed: boolean
          reddit_user: string | null
          reply: string | null
          score: number
          sentiment: Database["public"]["Enums"]["sentiment"]
          subreddit: string
          summary: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          bullet_points?: string | null
          content?: string | null
          created_at?: string | null
          display?: boolean
          id?: string
          imported_at?: string
          processed?: boolean
          reddit_user?: string | null
          reply?: string | null
          score?: number
          sentiment?: Database["public"]["Enums"]["sentiment"]
          subreddit: string
          summary?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          bullet_points?: string | null
          content?: string | null
          created_at?: string | null
          display?: boolean
          id?: string
          imported_at?: string
          processed?: boolean
          reddit_user?: string | null
          reply?: string | null
          score?: number
          sentiment?: Database["public"]["Enums"]["sentiment"]
          subreddit?: string
          summary?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reddit_posts_reddit_user_fkey"
            columns: ["reddit_user"]
            isOneToOne: false
            referencedRelation: "reddit_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_posts_subreddit_fkey"
            columns: ["subreddit"]
            isOneToOne: false
            referencedRelation: "subreddits"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_posts_keywords: {
        Row: {
          created_at: string
          id: string
          keyword: string
          post: string
        }
        Insert: {
          created_at?: string
          id?: string
          keyword: string
          post: string
        }
        Update: {
          created_at?: string
          id?: string
          keyword?: string
          post?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_posts_keywords_keyword_fkey"
            columns: ["keyword"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_posts_keywords_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "reddit_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_users: {
        Row: {
          id: string
          imported_at: string
          username: string
        }
        Insert: {
          id?: string
          imported_at?: string
          username: string
        }
        Update: {
          id?: string
          imported_at?: string
          username?: string
        }
        Relationships: []
      }
      subreddits: {
        Row: {
          description: string | null
          description_reddit: string | null
          id: string
          image: string | null
          imported_at: string
          name: string
          rules: string | null
          title: string | null
          updated: string | null
        }
        Insert: {
          description?: string | null
          description_reddit?: string | null
          id?: string
          image?: string | null
          imported_at?: string
          name: string
          rules?: string | null
          title?: string | null
          updated?: string | null
        }
        Update: {
          description?: string | null
          description_reddit?: string | null
          id?: string
          image?: string | null
          imported_at?: string
          name?: string
          rules?: string | null
          title?: string | null
          updated?: string | null
        }
        Relationships: []
      }
      subreddits_keywords: {
        Row: {
          created_at: string
          id: string
          keyword: string
          subreddit: string
        }
        Insert: {
          created_at?: string
          id?: string
          keyword: string
          subreddit: string
        }
        Update: {
          created_at?: string
          id?: string
          keyword?: string
          subreddit?: string
        }
        Relationships: [
          {
            foreignKeyName: "subreddits_keywords_keyword_fkey"
            columns: ["keyword"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subreddits_keywords_subreddit_fkey"
            columns: ["subreddit"]
            isOneToOne: false
            referencedRelation: "subreddits"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          company: string
          created_at: string
          employees: string | null
          goal: string[] | null
          id: string
          keywords_suggested: string[] | null
          name: string
          owner: string
          source: string | null
          updated_at: string
          website: string | null
          website_ai: string | null
          website_md: string | null
        }
        Insert: {
          company: string
          created_at?: string
          employees?: string | null
          goal?: string[] | null
          id?: string
          keywords_suggested?: string[] | null
          name: string
          owner: string
          source?: string | null
          updated_at?: string
          website?: string | null
          website_ai?: string | null
          website_md?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          employees?: string | null
          goal?: string[] | null
          id?: string
          keywords_suggested?: string[] | null
          name?: string
          owner?: string
          source?: string | null
          updated_at?: string
          website?: string | null
          website_ai?: string | null
          website_md?: string | null
        }
        Relationships: []
      }
      workspaces_keywords: {
        Row: {
          created_at: string
          created_by: string
          id: string
          keyword: string
          updated_at: string | null
          updated_by: string | null
          workspace: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          keyword: string
          updated_at?: string | null
          updated_by?: string | null
          workspace: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          keyword?: string
          updated_at?: string | null
          updated_by?: string | null
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_keywords_keyword_fkey"
            columns: ["keyword"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspaces_keywords_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces_reddit_comments: {
        Row: {
          comment: string
          created_at: string
          created_by: string
          id: string
          reply: string[] | null
          score: number | null
          status: Database["public"]["Enums"]["status"] | null
          updated_at: string | null
          updated_by: string | null
          workspace: string
        }
        Insert: {
          comment: string
          created_at?: string
          created_by: string
          id?: string
          reply?: string[] | null
          score?: number | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
          updated_by?: string | null
          workspace: string
        }
        Update: {
          comment?: string
          created_at?: string
          created_by?: string
          id?: string
          reply?: string[] | null
          score?: number | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
          updated_by?: string | null
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_reddit_comments_comment_fkey"
            columns: ["comment"]
            isOneToOne: false
            referencedRelation: "reddit_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspaces_reddit_comments_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces_reddit_posts: {
        Row: {
          created_at: string
          created_by: string
          id: string
          post: string
          reply: string[] | null
          score: number | null
          status: Database["public"]["Enums"]["status"] | null
          updated_at: string | null
          updated_by: string | null
          workspace: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          post: string
          reply?: string[] | null
          score?: number | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
          updated_by?: string | null
          workspace: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          post?: string
          reply?: string[] | null
          score?: number | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
          updated_by?: string | null
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_reddit_posts_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "reddit_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspaces_reddit_posts_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces_subreddits: {
        Row: {
          created_at: string
          created_by: string
          id: string
          subreddit: string
          workspace: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          subreddit: string
          workspace: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          subreddit?: string
          workspace?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_subreddits_subreddit_fkey"
            columns: ["subreddit"]
            isOneToOne: false
            referencedRelation: "subreddits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspaces_subreddits_workspace_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      sentiment: "Positive" | "Negative" | "Neutral"
      status: "-1" | "0" | "1" | "2" | "3"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      sentiment: ["Positive", "Negative", "Neutral"],
      status: ["-1", "0", "1", "2", "3"],
    },
  },
} as const

