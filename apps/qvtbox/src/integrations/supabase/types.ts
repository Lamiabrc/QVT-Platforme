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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      active_subscriptions: {
        Row: {
          box_subscription: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string | null
          status: string
          stripe_subscription_id: string | null
          total_price: number
          updated_at: string | null
          user_count: number
          user_id: string | null
        }
        Insert: {
          box_subscription?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_subscription_id?: string | null
          total_price: number
          updated_at?: string | null
          user_count?: number
          user_id?: string | null
        }
        Update: {
          box_subscription?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_subscription_id?: string | null
          total_price?: number
          updated_at?: string | null
          user_count?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "active_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_activity_log: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_content: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          page: string | null
          section: string | null
          type: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          page?: string | null
          section?: string | null
          type: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          page?: string | null
          section?: string | null
          type?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      alerts: {
        Row: {
          anonymized_message: boolean | null
          category: string | null
          created_at: string | null
          created_by: string | null
          family_id: string | null
          id: string
          message: string | null
          notes: string | null
          primary_axis: string | null
          resolved_at: string | null
          risk_level: string | null
          severity: string | null
          status: string | null
          target_role: string | null
          user_consent: boolean | null
          user_id: string | null
        }
        Insert: {
          anonymized_message?: boolean | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          family_id?: string | null
          id?: string
          message?: string | null
          notes?: string | null
          primary_axis?: string | null
          resolved_at?: string | null
          risk_level?: string | null
          severity?: string | null
          status?: string | null
          target_role?: string | null
          user_consent?: boolean | null
          user_id?: string | null
        }
        Update: {
          anonymized_message?: boolean | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          family_id?: string | null
          id?: string
          message?: string | null
          notes?: string | null
          primary_axis?: string | null
          resolved_at?: string | null
          risk_level?: string | null
          severity?: string | null
          status?: string | null
          target_role?: string | null
          user_consent?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      box: {
        Row: {
          created_at: string | null
          description: string | null
          devise: string | null
          id: string
          image_couverture: string | null
          items: Json | null
          nom: string
          origine: Database["public"]["Enums"]["origin_enum"]
          piliers: Database["public"]["Enums"]["pillar_enum"][]
          prix_cents: number
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          statut: Database["public"]["Enums"]["content_status_enum"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          devise?: string | null
          id?: string
          image_couverture?: string | null
          items?: Json | null
          nom: string
          origine: Database["public"]["Enums"]["origin_enum"]
          piliers: Database["public"]["Enums"]["pillar_enum"][]
          prix_cents: number
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          statut?: Database["public"]["Enums"]["content_status_enum"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          devise?: string | null
          id?: string
          image_couverture?: string | null
          items?: Json | null
          nom?: string
          origine?: Database["public"]["Enums"]["origin_enum"]
          piliers?: Database["public"]["Enums"]["pillar_enum"][]
          prix_cents?: number
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          statut?: Database["public"]["Enums"]["content_status_enum"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bubble_rewards: {
        Row: {
          bubble_type: Database["public"]["Enums"]["bubble_type"]
          created_at: string
          giver_id: string | null
          id: string
          message: string | null
          post_id: string | null
          receiver_id: string | null
        }
        Insert: {
          bubble_type: Database["public"]["Enums"]["bubble_type"]
          created_at?: string
          giver_id?: string | null
          id?: string
          message?: string | null
          post_id?: string | null
          receiver_id?: string | null
        }
        Update: {
          bubble_type?: Database["public"]["Enums"]["bubble_type"]
          created_at?: string
          giver_id?: string | null
          id?: string
          message?: string | null
          post_id?: string | null
          receiver_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bubble_rewards_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "shared_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          box_id: string
          box_type: string
          created_at: string
          id: string
          price: number
          quantity: number
          user_id: string | null
        }
        Insert: {
          box_id: string
          box_type: string
          created_at?: string
          id?: string
          price: number
          quantity?: number
          user_id?: string | null
        }
        Update: {
          box_id?: string
          box_type?: string
          created_at?: string
          id?: string
          price?: number
          quantity?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          ordre: number | null
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          ordre?: number | null
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          ordre?: number | null
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_activity_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cms_menu_items: {
        Row: {
          created_at: string | null
          id: string
          label: string
          menu_id: string | null
          ordre: number | null
          url: string
          visible: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          menu_id?: string | null
          ordre?: number | null
          url: string
          visible?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          menu_id?: string | null
          ordre?: number | null
          url?: string
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "cms_menus"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_menus: {
        Row: {
          created_at: string | null
          id: string
          nom: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nom: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nom?: string
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          created_at: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          statut: Database["public"]["Enums"]["content_status_enum"] | null
          titre: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          statut?: Database["public"]["Enums"]["content_status_enum"] | null
          titre: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          statut?: Database["public"]["Enums"]["content_status_enum"] | null
          titre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_partners: {
        Row: {
          categories:
            | Database["public"]["Enums"]["category_product_enum"][]
            | null
          certifications: string | null
          contact_email: string
          contact_nom: string
          contact_tel: string | null
          created_at: string | null
          delais: string | null
          description_courte: string | null
          docs: string[] | null
          id: string
          logistique_echantillons: string | null
          moq: string | null
          origine: Database["public"]["Enums"]["origin_enum"]
          prix_b2b: string | null
          site_web: string | null
          societe: string
          status: Database["public"]["Enums"]["partner_status_enum"] | null
          type_offre: Database["public"]["Enums"]["partner_type_enum"]
          updated_at: string | null
        }
        Insert: {
          categories?:
            | Database["public"]["Enums"]["category_product_enum"][]
            | null
          certifications?: string | null
          contact_email: string
          contact_nom: string
          contact_tel?: string | null
          created_at?: string | null
          delais?: string | null
          description_courte?: string | null
          docs?: string[] | null
          id?: string
          logistique_echantillons?: string | null
          moq?: string | null
          origine: Database["public"]["Enums"]["origin_enum"]
          prix_b2b?: string | null
          site_web?: string | null
          societe: string
          status?: Database["public"]["Enums"]["partner_status_enum"] | null
          type_offre: Database["public"]["Enums"]["partner_type_enum"]
          updated_at?: string | null
        }
        Update: {
          categories?:
            | Database["public"]["Enums"]["category_product_enum"][]
            | null
          certifications?: string | null
          contact_email?: string
          contact_nom?: string
          contact_tel?: string | null
          created_at?: string | null
          delais?: string | null
          description_courte?: string | null
          docs?: string[] | null
          id?: string
          logistique_echantillons?: string | null
          moq?: string | null
          origine?: Database["public"]["Enums"]["origin_enum"]
          prix_b2b?: string | null
          site_web?: string | null
          societe?: string
          status?: Database["public"]["Enums"]["partner_status_enum"] | null
          type_offre?: Database["public"]["Enums"]["partner_type_enum"]
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_settings: {
        Row: {
          created_at: string | null
          description: string | null
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      cms_user_roles: {
        Row: {
          created_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role_cms_enum"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role_cms_enum"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_cms_enum"]
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          entreprise: string | null
          id: string
          message: string
          nom: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          entreprise?: string | null
          id?: string
          message: string
          nom: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          entreprise?: string | null
          id?: string
          message?: string
          nom?: string
          status?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          status: string
          updated_at: string
          visitor_email: string | null
          visitor_id: string
          visitor_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          visitor_email?: string | null
          visitor_id: string
          visitor_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          visitor_email?: string | null
          visitor_id?: string
          visitor_name?: string | null
        }
        Relationships: []
      }
      daily_bubbles: {
        Row: {
          bubble_type: Database["public"]["Enums"]["bubble_type"]
          created_at: string
          date: string
          id: string
          intensity: number | null
          message: string
          ritual_suggestion: string | null
          user_id: string
        }
        Insert: {
          bubble_type: Database["public"]["Enums"]["bubble_type"]
          created_at?: string
          date?: string
          id?: string
          intensity?: number | null
          message: string
          ritual_suggestion?: string | null
          user_id: string
        }
        Update: {
          bubble_type?: Database["public"]["Enums"]["bubble_type"]
          created_at?: string
          date?: string
          id?: string
          intensity?: number | null
          message?: string
          ritual_suggestion?: string | null
          user_id?: string
        }
        Relationships: []
      }
      editable_content: {
        Row: {
          content_key: string
          content_type: string
          content_value: Json
          created_at: string | null
          default_value: Json
          description: string | null
          id: string
          page_name: string
          section_name: string
          updated_at: string | null
        }
        Insert: {
          content_key: string
          content_type?: string
          content_value?: Json
          created_at?: string | null
          default_value?: Json
          description?: string | null
          id?: string
          page_name: string
          section_name: string
          updated_at?: string | null
        }
        Update: {
          content_key?: string
          content_type?: string
          content_value?: Json
          created_at?: string | null
          default_value?: Json
          description?: string | null
          id?: string
          page_name?: string
          section_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employee_events: {
        Row: {
          confidential: boolean | null
          created_at: string | null
          description: string | null
          event_date: string
          event_type: string
          id: string
          impact_level: number | null
          support_needed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidential?: boolean | null
          created_at?: string | null
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          impact_level?: number | null
          support_needed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidential?: boolean | null
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          impact_level?: number | null
          support_needed?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      employee_specificities: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          severity_level: number | null
          specificity_type: string
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          severity_level?: number | null
          specificity_type: string
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          severity_level?: number | null
          specificity_type?: string
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      employee_wellness_scores: {
        Row: {
          created_at: string | null
          engagement_level: number | null
          id: string
          period_end: string
          period_start: string
          satisfaction_level: number | null
          stress_level: number | null
          user_id: string | null
          wellbeing_score: number | null
        }
        Insert: {
          created_at?: string | null
          engagement_level?: number | null
          id?: string
          period_end?: string
          period_start?: string
          satisfaction_level?: number | null
          stress_level?: number | null
          user_id?: string | null
          wellbeing_score?: number | null
        }
        Update: {
          created_at?: string | null
          engagement_level?: number | null
          id?: string
          period_end?: string
          period_start?: string
          satisfaction_level?: number | null
          stress_level?: number | null
          user_id?: string | null
          wellbeing_score?: number | null
        }
        Relationships: []
      }
      enterprise_members: {
        Row: {
          created_at: string
          enterprise_id: string
          id: string
          is_approved: boolean
          role: Database["public"]["Enums"]["enterprise_role_enum"]
          user_id: string
        }
        Insert: {
          created_at?: string
          enterprise_id: string
          id?: string
          is_approved?: boolean
          role: Database["public"]["Enums"]["enterprise_role_enum"]
          user_id: string
        }
        Update: {
          created_at?: string
          enterprise_id?: string
          id?: string
          is_approved?: boolean
          role?: Database["public"]["Enums"]["enterprise_role_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_members_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_questionnaires: {
        Row: {
          autonomie: number | null
          comments: Json | null
          communication: number | null
          created_at: string | null
          equilibre: number | null
          global_feedback: string | null
          id: string
          recommandations: Json | null
          reconnaissance: number | null
          relations: number | null
          risque: string | null
          score: number | null
          sens: number | null
          stress_level: number | null
          updated_at: string | null
          user_id: string | null
          workload: number | null
        }
        Insert: {
          autonomie?: number | null
          comments?: Json | null
          communication?: number | null
          created_at?: string | null
          equilibre?: number | null
          global_feedback?: string | null
          id?: string
          recommandations?: Json | null
          reconnaissance?: number | null
          relations?: number | null
          risque?: string | null
          score?: number | null
          sens?: number | null
          stress_level?: number | null
          updated_at?: string | null
          user_id?: string | null
          workload?: number | null
        }
        Update: {
          autonomie?: number | null
          comments?: Json | null
          communication?: number | null
          created_at?: string | null
          equilibre?: number | null
          global_feedback?: string | null
          id?: string
          recommandations?: Json | null
          reconnaissance?: number | null
          relations?: number | null
          risque?: string | null
          score?: number | null
          sens?: number | null
          stress_level?: number | null
          updated_at?: string | null
          user_id?: string | null
          workload?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_questionnaires_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprises: {
        Row: {
          created_at: string
          created_by: string
          enterprise_code: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          enterprise_code: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          enterprise_code?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      event_questionnaires: {
        Row: {
          created_at: string | null
          event_id: string | null
          follow_up_required: boolean | null
          id: string
          questionnaire_type: string
          responses: Json
          support_needs: Json | null
          user_id: string
          wellbeing_score: number | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          follow_up_required?: boolean | null
          id?: string
          questionnaire_type: string
          responses?: Json
          support_needs?: Json | null
          user_id: string
          wellbeing_score?: number | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          follow_up_required?: boolean | null
          id?: string
          questionnaire_type?: string
          responses?: Json
          support_needs?: Json | null
          user_id?: string
          wellbeing_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_questionnaires_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "employee_events"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_access: {
        Row: {
          created_at: string | null
          current_usage: number | null
          feature_name: string
          id: string
          is_enabled: boolean | null
          subscription_id: string | null
          usage_limit: number | null
        }
        Insert: {
          created_at?: string | null
          current_usage?: number | null
          feature_name: string
          id?: string
          is_enabled?: boolean | null
          subscription_id?: string | null
          usage_limit?: number | null
        }
        Update: {
          created_at?: string | null
          current_usage?: number | null
          feature_name?: string
          id?: string
          is_enabled?: boolean | null
          subscription_id?: string | null
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_access_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "active_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_invitations: {
        Row: {
          created_at: string
          expires_at: string
          group_id: string | null
          id: string
          invitee_email: string
          invitee_id: string | null
          inviter_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          group_id?: string | null
          id?: string
          invitee_email: string
          invitee_id?: string | null
          inviter_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          group_id?: string | null
          id?: string
          invitee_email?: string
          invitee_id?: string | null
          inviter_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_invitations_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "social_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_demo: {
        Row: {
          created_at: string
          email: string
          entreprise: string | null
          id: string
          message: string
          nom: string
          source_page: string
        }
        Insert: {
          created_at?: string
          email: string
          entreprise?: string | null
          id?: string
          message: string
          nom: string
          source_page?: string
        }
        Update: {
          created_at?: string
          email?: string
          entreprise?: string | null
          id?: string
          message?: string
          nom?: string
          source_page?: string
        }
        Relationships: []
      }
      market_research_submissions: {
        Row: {
          budget_range: string | null
          company_name: string | null
          company_size: string | null
          consent_data: boolean | null
          consent_marketing: boolean | null
          created_at: string
          current_solutions: string | null
          email: string
          full_name: string | null
          id: string
          interest_level: number | null
          phone: string | null
          role: string | null
          source: string | null
          specific_needs: string | null
          target_audience: string[] | null
          timeline: string | null
          updated_at: string
        }
        Insert: {
          budget_range?: string | null
          company_name?: string | null
          company_size?: string | null
          consent_data?: boolean | null
          consent_marketing?: boolean | null
          created_at?: string
          current_solutions?: string | null
          email: string
          full_name?: string | null
          id?: string
          interest_level?: number | null
          phone?: string | null
          role?: string | null
          source?: string | null
          specific_needs?: string | null
          target_audience?: string[] | null
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          budget_range?: string | null
          company_name?: string | null
          company_size?: string | null
          consent_data?: boolean | null
          consent_marketing?: boolean | null
          created_at?: string
          current_solutions?: string | null
          email?: string
          full_name?: string | null
          id?: string
          interest_level?: number | null
          phone?: string | null
          role?: string | null
          source?: string | null
          specific_needs?: string | null
          target_audience?: string[] | null
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt: string
          created_at: string | null
          fichier_url: string
          height: number | null
          id: string
          type: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt: string
          created_at?: string | null
          fichier_url: string
          height?: number | null
          id?: string
          type: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt?: string
          created_at?: string | null
          fichier_url?: string
          height?: number | null
          id?: string
          type?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          admin_user_id: string | null
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          is_from_visitor: boolean
        }
        Insert: {
          admin_user_id?: string | null
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_from_visitor?: boolean
        }
        Update: {
          admin_user_id?: string | null
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_from_visitor?: boolean
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
      metrics: {
        Row: {
          event: string
          id: string
          timestamp: string | null
          user_id: string | null
          value: string | null
        }
        Insert: {
          event: string
          id?: string
          timestamp?: string | null
          user_id?: string | null
          value?: string | null
        }
        Update: {
          event?: string
          id?: string
          timestamp?: string | null
          user_id?: string | null
          value?: string | null
        }
        Relationships: []
      }
      mood_answers: {
        Row: {
          check_id: string
          created_at: string | null
          id: string
          question_id: string
          text_value: string | null
          value: number | null
        }
        Insert: {
          check_id: string
          created_at?: string | null
          id?: string
          question_id: string
          text_value?: string | null
          value?: number | null
        }
        Update: {
          check_id?: string
          created_at?: string | null
          id?: string
          question_id?: string
          text_value?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mood_answers_check_id_fkey"
            columns: ["check_id"]
            isOneToOne: false
            referencedRelation: "mood_checks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mood_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_checks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          period_end: string
          period_start: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          period_end: string
          period_start: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          period_end?: string
          period_start?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          comment: string | null
          created_at: string
          date: string
          energy_level: number | null
          id: string
          motivation: number | null
          social_connection: number | null
          stress_level: number | null
          user_id: string
          work_satisfaction: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          motivation?: number | null
          social_connection?: number | null
          stress_level?: number | null
          user_id: string
          work_satisfaction?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          motivation?: number | null
          social_connection?: number | null
          stress_level?: number | null
          user_id?: string
          work_satisfaction?: number | null
        }
        Relationships: []
      }
      needs_assessments: {
        Row: {
          box_recommandee: string
          created_at: string
          email: string | null
          entreprise: string | null
          id: string
          note_globale: number | null
          scores_cohesion: number | null
          scores_devperso: number | null
          scores_orga: number | null
          scores_sante: number | null
          source: string
        }
        Insert: {
          box_recommandee: string
          created_at?: string
          email?: string | null
          entreprise?: string | null
          id?: string
          note_globale?: number | null
          scores_cohesion?: number | null
          scores_devperso?: number | null
          scores_orga?: number | null
          scores_sante?: number | null
          source?: string
        }
        Update: {
          box_recommandee?: string
          created_at?: string
          email?: string | null
          entreprise?: string | null
          id?: string
          note_globale?: number | null
          scores_cohesion?: number | null
          scores_devperso?: number | null
          scores_orga?: number | null
          scores_sante?: number | null
          source?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          currency: string
          id: string
          items: Json
          shipping_address: Json | null
          status: string
          stripe_payment_intent_id: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          currency?: string
          id?: string
          items?: Json
          shipping_address?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          currency?: string
          id?: string
          items?: Json
          shipping_address?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      org_settings: {
        Row: {
          amber_threshold: number | null
          created_at: string | null
          evaluation_frequency_days: number | null
          id: string
          min_sample_size: number | null
          organization_id: string | null
          red_threshold: number | null
          updated_at: string | null
        }
        Insert: {
          amber_threshold?: number | null
          created_at?: string | null
          evaluation_frequency_days?: number | null
          id?: string
          min_sample_size?: number | null
          organization_id?: string | null
          red_threshold?: number | null
          updated_at?: string | null
        }
        Update: {
          amber_threshold?: number | null
          created_at?: string | null
          evaluation_frequency_days?: number | null
          id?: string
          min_sample_size?: number | null
          organization_id?: string | null
          red_threshold?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          ordre: number | null
          page_id: string | null
          type_section: Database["public"]["Enums"]["section_type_enum"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          ordre?: number | null
          page_id?: string | null
          type_section: Database["public"]["Enums"]["section_type_enum"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          ordre?: number | null
          page_id?: string | null
          type_section?: Database["public"]["Enums"]["section_type_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      partners_applications: {
        Row: {
          categorie: string | null
          certifications: string | null
          charte_acceptee: boolean
          contact_email: string
          contact_nom: string
          contact_tel: string | null
          created_at: string
          delais: string | null
          description_courte: string | null
          id: string
          logistique_echantillons: string | null
          moq: string | null
          origine: string
          prix_b2b: string | null
          site_web: string | null
          societe: string
          type_offre: string
        }
        Insert: {
          categorie?: string | null
          certifications?: string | null
          charte_acceptee?: boolean
          contact_email: string
          contact_nom: string
          contact_tel?: string | null
          created_at?: string
          delais?: string | null
          description_courte?: string | null
          id?: string
          logistique_echantillons?: string | null
          moq?: string | null
          origine: string
          prix_b2b?: string | null
          site_web?: string | null
          societe: string
          type_offre: string
        }
        Update: {
          categorie?: string | null
          certifications?: string | null
          charte_acceptee?: boolean
          contact_email?: string
          contact_nom?: string
          contact_tel?: string | null
          created_at?: string
          delais?: string | null
          description_courte?: string | null
          id?: string
          logistique_echantillons?: string | null
          moq?: string | null
          origine?: string
          prix_b2b?: string | null
          site_web?: string | null
          societe?: string
          type_offre?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string | null
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id?: string | null
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_recommendations: {
        Row: {
          created_at: string | null
          id: string
          priority: number | null
          product_id: string | null
          recommendation_type: string | null
          recommended_product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority?: number | null
          product_id?: string | null
          recommendation_type?: string | null
          recommended_product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: number | null
          product_id?: string | null
          recommendation_type?: string | null
          recommended_product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_recommendations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_recommendations_recommended_product_id_fkey"
            columns: ["recommended_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_approved: boolean | null
          is_verified_purchase: boolean | null
          product_id: string | null
          rating: number
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          product_id?: string | null
          rating: number
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          product_id?: string | null
          rating?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          tag: string
          tag_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          tag: string
          tag_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          tag?: string
          tag_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string | null
          id: string
          inventory_quantity: number | null
          is_active: boolean | null
          name: string
          price_modifier: number | null
          product_id: string | null
          sku: string | null
          sort_order: number | null
          updated_at: string | null
          value: string
          variant_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_quantity?: number | null
          is_active?: boolean | null
          name: string
          price_modifier?: number | null
          product_id?: string | null
          sku?: string | null
          sort_order?: number | null
          updated_at?: string | null
          value: string
          variant_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_quantity?: number | null
          is_active?: boolean | null
          name?: string
          price_modifier?: number | null
          product_id?: string | null
          sku?: string | null
          sort_order?: number | null
          updated_at?: string | null
          value?: string
          variant_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allow_backorder: boolean | null
          artisan_info: string | null
          average_rating: number | null
          barcode: string | null
          category_id: string | null
          compare_at_price: number | null
          cost_price: number | null
          created_at: string
          description: string | null
          devise: string | null
          id: string
          images: string[] | null
          inventory_quantity: number | null
          is_active: boolean | null
          is_digital: boolean | null
          is_featured: boolean | null
          name: string
          origin: string | null
          origine: Database["public"]["Enums"]["origin_enum"] | null
          price: number
          prix_cents: number | null
          published_at: string | null
          requires_shipping: boolean | null
          review_count: number | null
          search_vector: unknown | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          short_description: string | null
          sku: string | null
          slug: string
          statut: Database["public"]["Enums"]["content_status_enum"] | null
          stock: number | null
          tags: string[] | null
          track_inventory: boolean | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          allow_backorder?: boolean | null
          artisan_info?: string | null
          average_rating?: number | null
          barcode?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          devise?: string | null
          id?: string
          images?: string[] | null
          inventory_quantity?: number | null
          is_active?: boolean | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          name: string
          origin?: string | null
          origine?: Database["public"]["Enums"]["origin_enum"] | null
          price: number
          prix_cents?: number | null
          published_at?: string | null
          requires_shipping?: boolean | null
          review_count?: number | null
          search_vector?: unknown | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          short_description?: string | null
          sku?: string | null
          slug: string
          statut?: Database["public"]["Enums"]["content_status_enum"] | null
          stock?: number | null
          tags?: string[] | null
          track_inventory?: boolean | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          allow_backorder?: boolean | null
          artisan_info?: string | null
          average_rating?: number | null
          barcode?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          devise?: string | null
          id?: string
          images?: string[] | null
          inventory_quantity?: number | null
          is_active?: boolean | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          name?: string
          origin?: string | null
          origine?: Database["public"]["Enums"]["origin_enum"] | null
          price?: number
          prix_cents?: number | null
          published_at?: string | null
          requires_shipping?: boolean | null
          review_count?: number | null
          search_vector?: unknown | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          short_description?: string | null
          sku?: string | null
          slug?: string
          statut?: Database["public"]["Enums"]["content_status_enum"] | null
          stock?: number | null
          tags?: string[] | null
          track_inventory?: boolean | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string | null
          alert_threshold: number | null
          assigned_teen_id: string | null
          created_at: string | null
          department_or_school: string | null
          email: string
          enterprise_id: string | null
          enterprise_role:
            | Database["public"]["Enums"]["enterprise_role_enum"]
            | null
          family_id: string | null
          fonction: string | null
          full_name: string | null
          hr_access: boolean | null
          id: string
          last_mood_entry: string | null
          notifications_enabled: boolean | null
          onboarding_completed: boolean | null
          privacy_anonymized: boolean | null
          role: string
          teen_access: boolean | null
          type_poste: string | null
          updated_at: string | null
          user_journey: Database["public"]["Enums"]["user_journey"] | null
          user_role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          account_type?: string | null
          alert_threshold?: number | null
          assigned_teen_id?: string | null
          created_at?: string | null
          department_or_school?: string | null
          email: string
          enterprise_id?: string | null
          enterprise_role?:
            | Database["public"]["Enums"]["enterprise_role_enum"]
            | null
          family_id?: string | null
          fonction?: string | null
          full_name?: string | null
          hr_access?: boolean | null
          id: string
          last_mood_entry?: string | null
          notifications_enabled?: boolean | null
          onboarding_completed?: boolean | null
          privacy_anonymized?: boolean | null
          role: string
          teen_access?: boolean | null
          type_poste?: string | null
          updated_at?: string | null
          user_journey?: Database["public"]["Enums"]["user_journey"] | null
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          account_type?: string | null
          alert_threshold?: number | null
          assigned_teen_id?: string | null
          created_at?: string | null
          department_or_school?: string | null
          email?: string
          enterprise_id?: string | null
          enterprise_role?:
            | Database["public"]["Enums"]["enterprise_role_enum"]
            | null
          family_id?: string | null
          fonction?: string | null
          full_name?: string | null
          hr_access?: boolean | null
          id?: string
          last_mood_entry?: string | null
          notifications_enabled?: boolean | null
          onboarding_completed?: boolean | null
          privacy_anonymized?: boolean | null
          role?: string
          teen_access?: boolean | null
          type_poste?: string | null
          updated_at?: string | null
          user_journey?: Database["public"]["Enums"]["user_journey"] | null
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_assigned_teen_id_fkey"
            columns: ["assigned_teen_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
      question_bank: {
        Row: {
          axis: string
          created_at: string | null
          id: string
          is_active: boolean | null
          question_type: string
          text: string
          weight: number | null
        }
        Insert: {
          axis: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question_type: string
          text: string
          weight?: number | null
        }
        Update: {
          axis?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question_type?: string
          text?: string
          weight?: number | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          audience: string | null
          axis: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          resource_type: string | null
          title: string
          url: string | null
        }
        Insert: {
          audience?: string | null
          axis: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          resource_type?: string | null
          title: string
          url?: string | null
        }
        Update: {
          audience?: string | null
          axis?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          resource_type?: string | null
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      risk_scores: {
        Row: {
          charge_rythme_score: number | null
          climat_reconnaissance_score: number | null
          created_at: string | null
          deconnexion_tension_score: number | null
          humeur_energie_score: number | null
          id: string
          overall_score: number
          penibilite_ergonomie_score: number | null
          period_end: string
          period_start: string
          top_risk_axis: string | null
          trend_direction: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          charge_rythme_score?: number | null
          climat_reconnaissance_score?: number | null
          created_at?: string | null
          deconnexion_tension_score?: number | null
          humeur_energie_score?: number | null
          id?: string
          overall_score: number
          penibilite_ergonomie_score?: number | null
          period_end: string
          period_start: string
          top_risk_axis?: string | null
          trend_direction?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          charge_rythme_score?: number | null
          climat_reconnaissance_score?: number | null
          created_at?: string | null
          deconnexion_tension_score?: number | null
          humeur_energie_score?: number | null
          id?: string
          overall_score?: number
          penibilite_ergonomie_score?: number | null
          period_end?: string
          period_start?: string
          top_risk_axis?: string | null
          trend_direction?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      shared_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          group_id: string | null
          id: string
          media_urls: Json | null
          post_type: string
          privacy_level: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          group_id?: string | null
          id?: string
          media_urls?: Json | null
          post_type: string
          privacy_level?: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          group_id?: string | null
          id?: string
          media_urls?: Json | null
          post_type?: string
          privacy_level?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "social_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      simulator_responses: {
        Row: {
          answers: Json
          burnout_risk: string
          burnout_risk_percentage: number
          context: string
          created_at: string | null
          happiness_score: number | null
          id: string
          qvt_score: number
          user_id: string | null
        }
        Insert: {
          answers: Json
          burnout_risk: string
          burnout_risk_percentage: number
          context: string
          created_at?: string | null
          happiness_score?: number | null
          id?: string
          qvt_score: number
          user_id?: string | null
        }
        Update: {
          answers?: Json
          burnout_risk?: string
          burnout_risk_percentage?: number
          context?: string
          created_at?: string | null
          happiness_score?: number | null
          id?: string
          qvt_score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content_key: string
          content_type: string
          content_value: Json
          created_at: string
          id: string
          is_published: boolean
          page: string
          section: string
          updated_at: string
        }
        Insert: {
          content_key: string
          content_type?: string
          content_value: Json
          created_at?: string
          id?: string
          is_published?: boolean
          page: string
          section: string
          updated_at?: string
        }
        Update: {
          content_key?: string
          content_type?: string
          content_value?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          page?: string
          section?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_themes: {
        Row: {
          colors: Json
          created_at: string | null
          description: string | null
          fonts: Json
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          colors?: Json
          created_at?: string | null
          description?: string | null
          fonts?: Json
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          colors?: Json
          created_at?: string | null
          description?: string | null
          fonts?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      social_group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string
          role: string
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "social_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      social_groups: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          group_code: string
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          group_code: string
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          group_code?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      some_table: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          base_price: number
          box_included: boolean | null
          box_price: number | null
          created_at: string | null
          features: Json
          id: string
          max_users: number | null
          name: string
          price_per_user: number
          type: string
        }
        Insert: {
          base_price: number
          box_included?: boolean | null
          box_price?: number | null
          created_at?: string | null
          features?: Json
          id?: string
          max_users?: number | null
          name: string
          price_per_user?: number
          type: string
        }
        Update: {
          base_price?: number
          box_included?: boolean | null
          box_price?: number | null
          created_at?: string | null
          features?: Json
          id?: string
          max_users?: number | null
          name?: string
          price_per_user?: number
          type?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          price_per_month: number
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type: string
          price_per_month: number
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          price_per_month?: number
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_insights: {
        Row: {
          anonymous: boolean | null
          content: string
          created_at: string | null
          id: string
          priority: string
          team_id: string
          type: string
          user_id: string | null
        }
        Insert: {
          anonymous?: boolean | null
          content: string
          created_at?: string | null
          id?: string
          priority?: string
          team_id: string
          type: string
          user_id?: string | null
        }
        Update: {
          anonymous?: boolean | null
          content?: string
          created_at?: string | null
          id?: string
          priority?: string
          team_id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      team_managers: {
        Row: {
          assigned_at: string
          id: string
          manager_id: string | null
          team_id: string | null
        }
        Insert: {
          assigned_at?: string
          id?: string
          manager_id?: string | null
          team_id?: string | null
        }
        Update: {
          assigned_at?: string
          id?: string
          manager_id?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_managers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          employee_id: string | null
          id: string
          joined_at: string
          team_id: string | null
        }
        Insert: {
          employee_id?: string | null
          id?: string
          joined_at?: string
          team_id?: string | null
        }
        Update: {
          employee_id?: string | null
          id?: string
          joined_at?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_bubble_points: {
        Row: {
          connexion_points: number
          id: string
          inspiration_points: number
          soin_points: number
          total_points: number
          transformation_points: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          connexion_points?: number
          id?: string
          inspiration_points?: number
          soin_points?: number
          total_points?: number
          transformation_points?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          connexion_points?: number
          id?: string
          inspiration_points?: number
          soin_points?: number
          total_points?: number
          transformation_points?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          addressee_id: string | null
          connection_type: string
          created_at: string | null
          id: string
          requester_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          addressee_id?: string | null
          connection_type: string
          created_at?: string | null
          id?: string
          requester_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          addressee_id?: string | null
          connection_type?: string
          created_at?: string | null
          id?: string
          requester_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_emotional_states: {
        Row: {
          created_at: string | null
          energy_level: number | null
          id: string
          is_visible_to_connections: boolean | null
          mood: string
          notes: string | null
          stress_level: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          is_visible_to_connections?: boolean | null
          mood: string
          notes?: string | null
          stress_level?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          is_visible_to_connections?: boolean | null
          mood?: string
          notes?: string | null
          stress_level?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          burnout_risk: string | null
          created_at: string | null
          feedback_type: string
          id: string
          qvt_score: number | null
          user_id: string | null
        }
        Insert: {
          burnout_risk?: string | null
          created_at?: string | null
          feedback_type: string
          id?: string
          qvt_score?: number | null
          user_id?: string | null
        }
        Update: {
          burnout_risk?: string | null
          created_at?: string | null
          feedback_type?: string
          id?: string
          qvt_score?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      virtual_gifts: {
        Row: {
          created_at: string | null
          gift_image_url: string | null
          gift_name: string
          id: string
          message: string | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          gift_image_url?: string | null
          gift_name: string
          id?: string
          message?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          gift_image_url?: string | null
          gift_name?: string
          id?: string
          message?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
    }
      families: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      family_invitations: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          family_id: string
          id: string
          role: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          family_id: string
          id?: string
          role: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          family_id?: string
          id?: string
          role?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      family_members: {
        Row: {
          created_at: string | null
          family_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          family_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          family_id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_product_rating: {
        Args: { product_uuid: string }
        Returns: number
      }
      calculate_wellbeing_score: {
        Args: { p_engagement: number; p_satisfaction: number; p_stress: number }
        Returns: number
      }
      can_manager_access_team: {
        Args: { manager_id: string; target_team_id: string }
        Returns: boolean
      }
      current_user_has_role: {
        Args: { check_role: string }
        Returns: boolean
      }
      get_user_connections: {
        Args: { connection_type?: string; user_id?: string }
        Returns: {
          connected_user_email: string
          connected_user_id: string
          connected_user_name: string
          connection_id: string
          connection_status: string
          emotional_state: Json
        }[]
      }
      get_user_enterprise_role: {
        Args: { target_user_id: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
      has_cms_role: {
        Args: { check_role: Database["public"]["Enums"]["user_role_cms_enum"] }
        Returns: boolean
      }
      has_feature_access: {
        Args: { feature_name: string; user_id?: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { user_uuid: string }
        Returns: boolean
      }
      is_cms_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_user_hr: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      is_user_manager: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      is_user_responsable_qvt: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_user_rh: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      setup_qvt_database: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      user_confirm_password_reset: {
        Args: { email: string; password: string }
        Returns: undefined
      }
      validate_user_access: {
        Args: { target_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      account_type:
        | "abonne_salarie"
        | "administrateur_entreprise"
        | "particulier_travailleur"
      alert_type:
        | "party"
        | "drinking"
        | "danger"
        | "lost"
        | "happy"
        | "with_friends"
        | "need_help"
      bubble_type: "soin" | "inspiration" | "transformation" | "connexion"
      category_product_enum: "physique" | "virtuel" | "evenementiel"
      content_status_enum: "draft" | "published"
      enterprise_role_enum: "employee" | "manager" | "hr" | "admin"
      origin_enum: "FR" | "UE" | "OCDE"
      partner_status_enum: "pending" | "approved" | "rejected"
      partner_type_enum: "premium_fr_local" | "standard_ocde"
      pillar_enum: "SANTE" | "ORGA" | "COHESION" | "DEV"
      section_type_enum:
        | "hero"
        | "piliers"
        | "grid_box"
        | "grid_produits"
        | "partenaires"
        | "transparence_ocde"
        | "richtext"
        | "cta_band"
        | "faq"
        | "contact_form"
      subscription_plan: "basic" | "premium" | "family"
      user_journey: "physique_only" | "saas_box"
      user_role:
        | "admin"
        | "user"
        | "salarié"
        | "responsable_qvt"
        | "rh"
        | "parent"
        | "ado"
        | "enfant"
        | "grand_parent"
        | "tuteur"
        | "autre_referent"
        | "coach"
      user_role_cms_enum:
        | "admin"
        | "editor"
        | "catalog_manager"
        | "partners_manager"
        | "reader"
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
      account_type: [
        "abonne_salarie",
        "administrateur_entreprise",
        "particulier_travailleur",
      ],
      alert_type: [
        "party",
        "drinking",
        "danger",
        "lost",
        "happy",
        "with_friends",
        "need_help",
      ],
      bubble_type: ["soin", "inspiration", "transformation", "connexion"],
      category_product_enum: ["physique", "virtuel", "evenementiel"],
      content_status_enum: ["draft", "published"],
      enterprise_role_enum: ["employee", "manager", "hr", "admin"],
      origin_enum: ["FR", "UE", "OCDE"],
      partner_status_enum: ["pending", "approved", "rejected"],
      partner_type_enum: ["premium_fr_local", "standard_ocde"],
      pillar_enum: ["SANTE", "ORGA", "COHESION", "DEV"],
      section_type_enum: [
        "hero",
        "piliers",
        "grid_box",
        "grid_produits",
        "partenaires",
        "transparence_ocde",
        "richtext",
        "cta_band",
        "faq",
        "contact_form",
      ],
      subscription_plan: ["basic", "premium", "family"],
      user_journey: ["physique_only", "saas_box"],
      user_role: [
        "admin",
        "user",
        "salarié",
        "responsable_qvt",
        "rh",
        "parent",
        "ado",
        "enfant",
        "grand_parent",
        "tuteur",
        "autre_referent",
        "coach",
      ],
      user_role_cms_enum: [
        "admin",
        "editor",
        "catalog_manager",
        "partners_manager",
        "reader",
      ],
    },
  },
} as const
