// types/supabase.ts
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          email: string | null
          avatar_url: string | null
          phone_number: string | null
          address: string | null
          designation: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          address?: string | null
          designation?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          address?: string | null
          designation?: string | null
        }
      }
      // Add other tables as needed
    };
    Views: {};
    Functions: {};
  };
}