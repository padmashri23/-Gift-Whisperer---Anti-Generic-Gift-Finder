export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          default_budget_min: number;
          default_budget_max: number;
          preferred_currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          default_budget_min?: number;
          default_budget_max?: number;
          preferred_currency?: string;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          default_budget_min?: number;
          default_budget_max?: number;
          preferred_currency?: string;
        };
        Relationships: [];
      };
      recipients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          relationship: string | null;
          description: string | null;
          interests: string[];
          important_dates: Record<string, unknown>[];
          notes: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          relationship?: string | null;
          description?: string | null;
          interests?: string[];
          important_dates?: Record<string, unknown>[];
          notes?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          name?: string;
          relationship?: string | null;
          description?: string | null;
          interests?: string[];
          important_dates?: Record<string, unknown>[];
          notes?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      gift_sessions: {
        Row: {
          id: string;
          user_id: string;
          recipient_id: string | null;
          description_input: string;
          occasion: string | null;
          budget_min: number | null;
          budget_max: number | null;
          ai_provider: string;
          ai_model: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipient_id?: string | null;
          description_input: string;
          occasion?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          ai_provider: string;
          ai_model: string;
        };
        Update: {
          recipient_id?: string | null;
          description_input?: string;
          occasion?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
        };
        Relationships: [];
      };
      gift_ideas: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          title: string;
          description: string;
          estimated_price_min: number;
          estimated_price_max: number;
          why_its_perfect: string;
          category: string;
          purchase_keywords: string[];
          is_saved: boolean;
          is_given: boolean;
          given_date: string | null;
          rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          title: string;
          description: string;
          estimated_price_min: number;
          estimated_price_max: number;
          why_its_perfect: string;
          category: string;
          purchase_keywords?: string[];
          is_saved?: boolean;
          is_given?: boolean;
          given_date?: string | null;
          rating?: number | null;
        };
        Update: {
          title?: string;
          description?: string;
          estimated_price_min?: number;
          estimated_price_max?: number;
          why_its_perfect?: string;
          category?: string;
          purchase_keywords?: string[];
          is_saved?: boolean;
          is_given?: boolean;
          given_date?: string | null;
          rating?: number | null;
        };
        Relationships: [];
      };
      occasion_presets: {
        Row: {
          id: string;
          label: string;
          emoji: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          label: string;
          emoji: string;
          sort_order?: number;
        };
        Update: {
          label?: string;
          emoji?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
