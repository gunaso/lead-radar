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
          created_by: string | null
          id: number
          name: string
          website: string | null
          website_info: string | null
          website_summary: string | null
          workspace: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          name: string
          website?: string | null
          website_info?: string | null
          website_summary?: string | null
          workspace: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          name?: string
          website?: string | null
          website_info?: string | null
          website_summary?: string | null
          workspace?: number
        }
        Relationships: [
          {
            foreignKeyName: "competitor_organization_fkey"
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
          id: number
          name: string
          process: boolean
          similar_words: string[] | null
          value: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          process?: boolean
          similar_words?: string[] | null
          value: string
        }
        Update: {
          created_at?: string
          id?: number
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
          updated_at: string
          user_id: string
          workspace: number | null
        }
        Insert: {
          created_at?: string
          name?: string | null
          onboarded?: boolean
          onboarding?: number
          role?: string | null
          updated_at?: string
          user_id: string
          workspace?: number | null
        }
        Update: {
          created_at?: string
          name?: string | null
          onboarded?: boolean
          onboarding?: number
          role?: string | null
          updated_at?: string
          user_id?: string
          workspace?: number | null
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
          comment: string
          created_at: string
          display: boolean
          id: number
          imported_at: string
          post: number
          reddit_user: number
          reviewed: boolean
          sentiment: string | null
        }
        Insert: {
          comment: string
          created_at: string
          display?: boolean
          id?: number
          imported_at?: string
          post: number
          reddit_user: number
          reviewed?: boolean
          sentiment?: string | null
        }
        Update: {
          comment?: string
          created_at?: string
          display?: boolean
          id?: number
          imported_at?: string
          post?: number
          reddit_user?: number
          reviewed?: boolean
          sentiment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reddit_comment_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "reddit_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_comment_reddit_user_fkey"
            columns: ["reddit_user"]
            isOneToOne: false
            referencedRelation: "reddit_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_comments_keywords: {
        Row: {
          comment: number
          created_at: string
          id: number
          keywords: number
        }
        Insert: {
          comment: number
          created_at?: string
          id?: number
          keywords: number
        }
        Update: {
          comment?: number
          created_at?: string
          id?: number
          keywords?: number
        }
        Relationships: [
          {
            foreignKeyName: "reddit_comment_keywords_comment_fkey"
            columns: ["comment"]
            isOneToOne: false
            referencedRelation: "reddit_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_comment_keywords_keywords_fkey"
            columns: ["keywords"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_posts: {
        Row: {
          body: string | null
          created_at: string
          id: number
          imported_at: string
          reddit_user: number
          subreddit: number
          title: string
        }
        Insert: {
          body?: string | null
          created_at: string
          id?: number
          imported_at?: string
          reddit_user: number
          subreddit: number
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: number
          imported_at?: string
          reddit_user?: number
          subreddit?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_post_reddit_user_fkey"
            columns: ["reddit_user"]
            isOneToOne: false
            referencedRelation: "reddit_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_post_subreddit_fkey"
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
          id: number
          keyword: number
          post: number
        }
        Insert: {
          created_at?: string
          id?: number
          keyword: number
          post: number
        }
        Update: {
          created_at?: string
          id?: number
          keyword?: number
          post?: number
        }
        Relationships: [
          {
            foreignKeyName: "reddit_post_keywords_keyword_fkey"
            columns: ["keyword"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_post_keywords_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "reddit_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_users: {
        Row: {
          id: number
          imported_at: string
          username: string
        }
        Insert: {
          id?: number
          imported_at?: string
          username: string
        }
        Update: {
          id?: number
          imported_at?: string
          username?: string
        }
        Relationships: []
      }
      subreddits: {
        Row: {
          created_at: string | null
          description: string | null
          description_reddit: string | null
          id: number
          image: string | null
          imported_at: string
          name: string
          rules: string | null
          title: string | null
          total_members: number | null
          updated_at: string
          weekly_contrib: number | null
          weekly_visitors: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_reddit?: string | null
          id?: number
          image?: string | null
          imported_at?: string
          name: string
          rules?: string | null
          title?: string | null
          total_members?: number | null
          updated_at?: string
          weekly_contrib?: number | null
          weekly_visitors?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_reddit?: string | null
          id?: number
          image?: string | null
          imported_at?: string
          name?: string
          rules?: string | null
          title?: string | null
          total_members?: number | null
          updated_at?: string
          weekly_contrib?: number | null
          weekly_visitors?: number | null
        }
        Relationships: []
      }
      subreddits_keywords: {
        Row: {
          created_at: string
          id: number
          keyword: number
          subreddit: number
        }
        Insert: {
          created_at?: string
          id?: number
          keyword: number
          subreddit: number
        }
        Update: {
          created_at?: string
          id?: number
          keyword?: number
          subreddit?: number
        }
        Relationships: [
          {
            foreignKeyName: "subreddit_keywords_keyword_fkey"
            columns: ["keyword"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subreddit_keywords_subreddit_fkey"
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
          id: number
          keywords_suggested: string[] | null
          name: string
          owner: string
          updated_at: string
          website: string | null
          website_ai: string | null
          website_md: string | null
        }
        Insert: {
          company: string
          created_at?: string
          employees?: string | null
          id?: number
          keywords_suggested?: string[] | null
          name: string
          owner?: string
          updated_at?: string
          website?: string | null
          website_ai?: string | null
          website_md?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          employees?: string | null
          id?: number
          keywords_suggested?: string[] | null
          name?: string
          owner?: string
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
          created_by: string | null
          id: number
          keyword: number
          workspace: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          keyword: number
          workspace: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          keyword?: number
          workspace?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_keywords_keyword_fkey"
            columns: ["keyword"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_keywords_organization_fkey"
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
          created_by: string | null
          id: number
          subreddit: number
          workspace: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          subreddit: number
          workspace: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          subreddit?: number
          workspace?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_subreddits_organization_fkey"
            columns: ["workspace"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_subreddits_subreddit_fkey"
            columns: ["subreddit"]
            isOneToOne: false
            referencedRelation: "subreddits"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const

