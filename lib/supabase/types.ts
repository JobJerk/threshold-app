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
      profiles: {
        Row: {
          id: string
          username: string | null
          points: number
          energy: number
          last_energy_reset: string
          created_at: string
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
        }
        Insert: {
          id: string
          username?: string | null
          points?: number
          energy?: number
          last_energy_reset?: string
          created_at?: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          points?: number
          energy?: number
          last_energy_reset?: string
          created_at?: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
        }
        Relationships: []
      }
      thresholds: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          target_count: number
          current_count: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          target_count: number
          current_count?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          target_count?: number
          current_count?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      commitments: {
        Row: {
          id: string
          user_id: string
          threshold_id: string
          points_earned: number
          committed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          threshold_id: string
          points_earned?: number
          committed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          threshold_id?: string
          points_earned?: number
          committed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'commitments_threshold_id_fkey'
            columns: ['threshold_id']
            isOneToOne: false
            referencedRelation: 'thresholds'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'commitments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string
          requirement_type: string
          requirement_value: number
          points_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon: string
          requirement_type: string
          requirement_value: number
          points_reward?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string
          requirement_type?: string
          requirement_value?: number
          points_reward?: number
          created_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_badges_badge_id_fkey'
            columns: ['badge_id']
            isOneToOne: false
            referencedRelation: 'badges'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_badges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          id: string
          username: string | null
          points: number
          current_streak: number
          longest_streak: number
          total_commits: number
          badge_count: number
          rank: number
        }
      }
    }
    Functions: {
      increment_points: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: undefined
      }
      increment_threshold_count: {
        Args: {
          threshold_id: string
        }
        Returns: undefined
      }
      update_user_streak: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
      check_and_award_badges: {
        Args: {
          p_user_id: string
        }
        Returns: {
          badge_name: string
          badge_icon: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Threshold = Database['public']['Tables']['thresholds']['Row']
export type Commitment = Database['public']['Tables']['commitments']['Row']
export type Badge = Database['public']['Tables']['badges']['Row']
export type UserBadge = Database['public']['Tables']['user_badges']['Row']
export type LeaderboardEntry = Database['public']['Views']['leaderboard']['Row']
