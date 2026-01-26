export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          family_member_id: string
          id: string
          last_message_at: string | null
          started_at: string | null
          title: string | null
        }
        Insert: {
          family_member_id: string
          id?: string
          last_message_at?: string | null
          started_at?: string | null
          title?: string | null
        }
        Update: {
          family_member_id?: string
          id?: string
          last_message_at?: string | null
          started_at?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      emotions: {
        Row: {
          color: string
          created_at: string | null
          emotion: Database["public"]["Enums"]["emotion_type"]
          family_member_id: string
          id: string
          intensity: number
          is_shared: boolean | null
          note: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          emotion: Database["public"]["Enums"]["emotion_type"]
          family_member_id: string
          id?: string
          intensity: number
          is_shared?: boolean | null
          note?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          emotion?: Database["public"]["Enums"]["emotion_type"]
          family_member_id?: string
          id?: string
          intensity?: number
          is_shared?: boolean | null
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emotions_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      family_groups: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          age_range: string | null
          created_at: string | null
          display_name: string
          family_id: string
          id: string
          is_account_holder: boolean | null
          profile_id: string | null
          role: Database["public"]["Enums"]["family_role"]
        }
        Insert: {
          age_range?: string | null
          created_at?: string | null
          display_name: string
          family_id: string
          id?: string
          is_account_holder?: boolean | null
          profile_id?: string | null
          role: Database["public"]["Enums"]["family_role"]
        }
        Update: {
          age_range?: string | null
          created_at?: string | null
          display_name?: string
          family_id?: string
          id?: string
          is_account_holder?: boolean | null
          profile_id?: string | null
          role?: Database["public"]["Enums"]["family_role"]
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_nudges: {
        Row: {
          content: string
          created_at: string | null
          from_member_id: string
          id: string
          media_url: string | null
          read_at: string | null
          to_member_id: string
          type: Database["public"]["Enums"]["nudge_type"]
        }
        Insert: {
          content: string
          created_at?: string | null
          from_member_id: string
          id?: string
          media_url?: string | null
          read_at?: string | null
          to_member_id: string
          type: Database["public"]["Enums"]["nudge_type"]
        }
        Update: {
          content?: string
          created_at?: string | null
          from_member_id?: string
          id?: string
          media_url?: string | null
          read_at?: string | null
          to_member_id?: string
          type?: Database["public"]["Enums"]["nudge_type"]
        }
        Relationships: [
          {
            foreignKeyName: "family_nudges_from_member_id_fkey"
            columns: ["from_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_nudges_to_member_id_fkey"
            columns: ["to_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          emotion_detected: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          emotion_detected?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          emotion_detected?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          platform: string | null
          push_token: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          platform?: string | null
          push_token?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          platform?: string | null
          push_token?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shared_journal: {
        Row: {
          content: string | null
          created_at: string | null
          family_id: string
          id: string
          member_id: string
          photo_url: string | null
          weather: Database["public"]["Enums"]["weather_type"]
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          family_id: string
          id?: string
          member_id: string
          photo_url?: string | null
          weather: Database["public"]["Enums"]["weather_type"]
        }
        Update: {
          content?: string | null
          created_at?: string | null
          family_id?: string
          id?: string
          member_id?: string
          photo_url?: string | null
          weather?: Database["public"]["Enums"]["weather_type"]
        }
        Relationships: [
          {
            foreignKeyName: "shared_journal_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_journal_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "parent" | "ado" | "admin"
      emotion_type:
        | "calme"
        | "fatigue"
        | "joie"
        | "stress"
        | "motivation"
        | "tristesse"
        | "colere"
        | "anxiete"
      family_role:
        | "parent"
        | "ado"
        | "enfant"
        | "parrain"
        | "tuteur"
        | "autre"
        | "admin"
      nudge_type: "message" | "drawing" | "sound"
      weather_type: "soleil" | "nuages" | "pluie" | "eclaircies"
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
  public: {
    Enums: {
      app_role: ["parent", "ado", "admin"],
      emotion_type: [
        "calme",
        "fatigue",
        "joie",
        "stress",
        "motivation",
        "tristesse",
        "colere",
        "anxiete",
      ],
      family_role: [
        "parent",
        "ado",
        "enfant",
        "parrain",
        "tuteur",
        "autre",
        "admin",
      ],
      nudge_type: ["message", "drawing", "sound"],
      weather_type: ["soleil", "nuages", "pluie", "eclaircies"],
    },
  },
} as const
