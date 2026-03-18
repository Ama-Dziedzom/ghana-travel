/**
 * Ghana Travel Blog — Supabase Database Types
 *
 * This file is the hand-authored version of the DB types.
 * Once the Supabase project is created, replace this with the
 * auto-generated output from:
 *   npx supabase gen types typescript --project-id <your-project-id> > src/lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      authors: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          avatar_url: string | null
          bio: string | null
          role: 'admin' | 'editor' | 'author'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email: string
          avatar_url?: string | null
          bio?: string | null
          role?: 'admin' | 'editor' | 'author'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string
          avatar_url?: string | null
          bio?: string | null
          role?: 'admin' | 'editor' | 'author'
          created_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          category: 'culture' | 'history' | 'festivals' | 'neighbourhoods'
          excerpt: string | null
          cover_image: string | null
          author_id: string | null
          published_at: string | null
          read_time: number | null
          body_mdx: string | null
          status: 'draft' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category: 'culture' | 'history' | 'festivals' | 'neighbourhoods'
          excerpt?: string | null
          cover_image?: string | null
          author_id?: string | null
          published_at?: string | null
          read_time?: number | null
          body_mdx?: string | null
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: 'culture' | 'history' | 'festivals' | 'neighbourhoods'
          excerpt?: string | null
          cover_image?: string | null
          author_id?: string | null
          published_at?: string | null
          read_time?: number | null
          body_mdx?: string | null
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
      }
      itineraries: {
        Row: {
          id: string
          title: string
          slug: string
          duration: number | null
          regions: string[] | null
          vibe_tags: string[] | null
          best_season: string | null
          cover_image: string | null
          summary: string | null
          map_embed_url: string | null
          status: 'draft' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          duration?: number | null
          regions?: string[] | null
          vibe_tags?: string[] | null
          best_season?: string | null
          cover_image?: string | null
          summary?: string | null
          map_embed_url?: string | null
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          duration?: number | null
          regions?: string[] | null
          vibe_tags?: string[] | null
          best_season?: string | null
          cover_image?: string | null
          summary?: string | null
          map_embed_url?: string | null
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
      }
      itinerary_days: {
        Row: {
          id: string
          itinerary_id: string
          day_number: number
          title: string | null
          stops: Json | null
        }
        Insert: {
          id?: string
          itinerary_id: string
          day_number: number
          title?: string | null
          stops?: Json | null
        }
        Update: {
          id?: string
          itinerary_id?: string
          day_number?: number
          title?: string | null
          stops?: Json | null
        }
      }
      recipes: {
        Row: {
          id: string
          title: string
          slug: string
          category: 'soups' | 'rice-dishes' | 'street-food' | 'drinks' | 'snacks'
          description: string | null
          cover_image: string | null
          prep_time: number | null
          cook_time: number | null
          servings: number | null
          difficulty: 'easy' | 'medium' | 'hard' | null
          ingredients: string[] | null
          instructions: string[] | null
          tips: string | null
          status: 'draft' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category: 'soups' | 'rice-dishes' | 'street-food' | 'drinks' | 'snacks'
          description?: string | null
          cover_image?: string | null
          prep_time?: number | null
          cook_time?: number | null
          servings?: number | null
          difficulty?: 'easy' | 'medium' | 'hard' | null
          ingredients?: string[] | null
          instructions?: string[] | null
          tips?: string | null
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: 'soups' | 'rice-dishes' | 'street-food' | 'drinks' | 'snacks'
          description?: string | null
          cover_image?: string | null
          prep_time?: number | null
          cook_time?: number | null
          servings?: number | null
          difficulty?: 'easy' | 'medium' | 'hard' | null
          ingredients?: string[] | null
          instructions?: string[] | null
          tips?: string | null
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          article_id: string
          author_id: string | null
          guest_name: string | null
          guest_email: string | null
          body: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          author_id?: string | null
          guest_name?: string | null
          guest_email?: string | null
          body: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          author_id?: string | null
          guest_name?: string | null
          guest_email?: string | null
          body?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
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
  }
}

// Convenience row types
export type Author = Database['public']['Tables']['authors']['Row']
export type Article = Database['public']['Tables']['articles']['Row']
export type Itinerary = Database['public']['Tables']['itineraries']['Row']
export type ItineraryDay = Database['public']['Tables']['itinerary_days']['Row']
export type Recipe = Database['public']['Tables']['recipes']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
