export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      resumes: {
        Row: {
          created_at: string;
          file_name: string;
          file_path: string;
          file_size: number | null;
          id: string;
          is_primary: boolean;
          mime_type: string | null;
          parsed_data: Json | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          file_name: string;
          file_path: string;
          file_size?: number | null;
          id?: string;
          is_primary?: boolean;
          mime_type?: string | null;
          parsed_data?: Json | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          file_name?: string;
          file_path?: string;
          file_size?: number | null;
          id?: string;
          is_primary?: boolean;
          mime_type?: string | null;
          parsed_data?: Json | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          additional_details: string[];
          certifications: Json;
          created_at: string;
          education: Json;
          headline: string | null;
          links: Json;
          location: string | null;
          onboarding_completed_at: string | null;
          phone: string | null;
          professional_summary: string | null;
          projects: Json;
          skills: string[];
          updated_at: string;
          user_id: string;
          work_experience: Json;
        };
        Insert: {
          additional_details?: string[];
          certifications?: Json;
          created_at?: string;
          education?: Json;
          headline?: string | null;
          links?: Json;
          location?: string | null;
          onboarding_completed_at?: string | null;
          phone?: string | null;
          professional_summary?: string | null;
          projects?: Json;
          skills?: string[];
          updated_at?: string;
          user_id: string;
          work_experience?: Json;
        };
        Update: {
          additional_details?: string[];
          certifications?: Json;
          created_at?: string;
          education?: Json;
          headline?: string | null;
          links?: Json;
          location?: string | null;
          onboarding_completed_at?: string | null;
          phone?: string | null;
          professional_summary?: string | null;
          projects?: Json;
          skills?: string[];
          updated_at?: string;
          user_id?: string;
          work_experience?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
