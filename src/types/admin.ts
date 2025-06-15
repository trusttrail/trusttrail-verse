
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  company_name: string;
  category: string;
  wallet_address: string;
  status: ReviewStatus;
  created_at: string;
  proof_file_url?: string;
  proof_file_name?: string;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface AdminUser {
  id: string;
  email?: string;
  wallet_address?: string;
  is_admin: boolean;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  auth_created_at?: string;
  created_at: string;
}
