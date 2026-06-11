import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserType = 'advertiser' | 'influencer';

export interface Profile {
  id: string;
  email: string;
  name: string;
  user_type: UserType;
  company?: string;
  phone?: string;
  channel_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  advertiser_id: string;
  influencer_id: string;
  platform: string;
  ad_type: string;
  budget: number;
  status: string;
  target: string;
  keyword: string;
  product_info: string;
  release_date: string;
  created_at: string;
}

export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_flagged: boolean;
  created_at: string;
}
