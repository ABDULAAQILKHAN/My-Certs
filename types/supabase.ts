// types/supabase.ts
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string | null;
          created_at?: string;
        };
      };
      // Add other tables as needed
    };
    Views: {};
    Functions: {};
  };
}