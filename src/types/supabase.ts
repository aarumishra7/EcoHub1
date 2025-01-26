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
      materials: {
        Row: {
          id: string
          name: string
          category: string
          quantity: string
          location: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          quantity: string
          location: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          quantity?: string
          location?: string
          user_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_type: 'business' | 'financial'
          business_name: string | null
          gst_number: string | null
          gst_verified: boolean
          phone: string | null
          phone_verified: boolean
          verification_status: 'pending' | 'approved' | 'rejected'
          documents: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_type: 'business' | 'financial'
          business_name?: string | null
          gst_number?: string | null
          gst_verified?: boolean
          phone?: string | null
          phone_verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          documents?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_type?: 'business' | 'financial'
          business_name?: string | null
          gst_number?: string | null
          gst_verified?: boolean
          phone?: string | null
          phone_verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          documents?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}