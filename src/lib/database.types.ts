export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          date: string
          location: string
          description: string
          max_participants: number
          images: string[]
          videos: string[]
          status: 'upcoming' | 'ongoing' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          location: string
          description: string
          max_participants?: number
          images?: string[]
          videos?: string[]
          status?: 'upcoming' | 'ongoing' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          location?: string
          description?: string
          max_participants?: number
          images?: string[]
          videos?: string[]
          status?: 'upcoming' | 'ongoing' | 'completed'
          created_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
          read: boolean
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
          read?: boolean
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
          read?: boolean
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
          active: boolean
        }
        Insert: {
          id?: string
          email: string
          subscribed_at?: string
          active?: boolean
        }
        Update: {
          id?: string
          email?: string
          subscribed_at?: string
          active?: boolean
        }
        Relationships: []
      }
      membership_applications: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          location: string
          experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          climbing_history: string | null
          motivation: string
          status: 'pending' | 'reviewing' | 'approved' | 'rejected'
          notes: string | null
          payment_method: 'jazzcash' | 'easypaisa' | 'nayapay' | null
          payment_phone: string | null
          payment_status: 'pending' | 'confirmed' | 'failed'
          payment_reference: string | null
          membership_fee: number
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          location: string
          experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          climbing_history?: string | null
          motivation: string
          status?: 'pending' | 'reviewing' | 'approved' | 'rejected'
          notes?: string | null
          payment_method?: 'jazzcash' | 'easypaisa' | 'nayapay' | null
          payment_phone?: string | null
          payment_status?: 'pending' | 'confirmed' | 'failed'
          payment_reference?: string | null
          membership_fee?: number
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          location?: string
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          climbing_history?: string | null
          motivation?: string
          status?: 'pending' | 'reviewing' | 'approved' | 'rejected'
          notes?: string | null
          payment_method?: 'jazzcash' | 'easypaisa' | 'nayapay' | null
          payment_phone?: string | null
          payment_status?: 'pending' | 'confirmed' | 'failed'
          payment_reference?: string | null
          membership_fee?: number
          created_at?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          id: string
          title: string
          category: string
          excerpt: string
          content: string
          image: string
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          excerpt: string
          content?: string
          image?: string
          published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          excerpt?: string
          content?: string
          image?: string
          published?: boolean
          created_at?: string
        }
        Relationships: []
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
