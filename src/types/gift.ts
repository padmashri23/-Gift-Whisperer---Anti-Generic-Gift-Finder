export interface GiftIdea {
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
}

export interface GiftSession {
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
}

export interface OccasionPreset {
  id: string;
  label: string;
  emoji: string;
  sort_order: number;
}
