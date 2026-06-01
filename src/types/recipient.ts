export interface Recipient {
  id: string;
  user_id: string;
  name: string;
  relationship: string | null;
  description: string | null;
  interests: string[];
  important_dates: ImportantDate[];
  notes: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImportantDate {
  label: string;
  date: string;
}
