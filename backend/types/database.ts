// Database types - auto-generated from schema
export interface Profile {
  id: string;
  email: string;
  name: string;
  phone: string;
  college: string;
  role: 'participant' | 'admin' | 'coordinator';
  avatar_url: string | null;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sport {
  id: string;
  name: string;
  slug: string;
  category: 'indoor' | 'outdoor' | 'esports' | 'athletics';
  description: string | null;
  rules: string | null;
  image_url: string | null;
  is_team_event: boolean;
  team_size_min: number;
  team_size_max: number;
  fees: number;
  early_bird_fees: number | null;
  early_bird_deadline: string | null;
  schedule_start: string | null;
  schedule_end: string | null;
  venue: string | null;
  registration_start: string;
  registration_deadline: string;
  is_registration_open: boolean;
  max_participants: number | null;
  current_participants: number;
  waitlist_enabled: boolean;
  max_waitlist: number;
  created_by: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  registration_number: string;
  participant_id: string;
  sport_id: string;
  status: 'pending' | 'payment_pending' | 'confirmed' | 'waitlist' | 'cancelled' | 'withdrawn';
  is_team: boolean;
  team_name: string | null;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  amount_paid: number;
  waitlist_position: number | null;
  confirmed_at: string | null;
  withdrawal_reason: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  registered_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  registration_id: string;
  member_order: number;
  name: string;
  email: string | null;
  phone: string | null;
  is_captain: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  registration_id: string;
  user_id: string;
  amount: number;
  currency: string;
  convenience_fee: number;
  total_amount: number;
  method: 'online' | 'offline' | 'free';
  status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded' | 'partially_refunded';
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  gateway_response: Record<string, unknown> | null;
  receipt_number: string | null;
  receipt_url: string | null;
  offline_verified_by: string | null;
  offline_verification_note: string | null;
  offline_verified_at: string | null;
  refund_amount: number | null;
  refund_reason: string | null;
  refund_id: string | null;
  refund_processed_by: string | null;
  refund_processed_at: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface Notification {
  id: string;
  recipient_id: string;
  type: 'registration' | 'payment' | 'announcement' | 'reminder' | 'waitlist' | 'cancellation';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  title: string;
  message: string;
  action_url: string | null;
  is_read: boolean;
  read_at: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  related_sport_id: string | null;
  related_registration_id: string | null;
  metadata: Record<string, unknown> | null;
  expires_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  request_id: string | null;
  created_at: string;
}

export interface College {
  id: string;
  name: string;
  short_name: string | null;
  city: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Setting {
  key: string;
  value: unknown;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

// API Request/Response types
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  college: string;
}

export interface RegisterRequest {
  sport_id: string;
  is_team?: boolean;
  team_name?: string;
  team_members?: {
    name: string;
    email?: string;
    phone?: string;
    is_captain?: boolean;
  }[];
}

export interface CreateOrderRequest {
  registration_id: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CanRegisterResult {
  can_register: boolean;
  reason: string;
  waitlist_available: boolean;
}

export interface DashboardStats {
  total_registrations: number;
  confirmed_registrations: number;
  pending_payments: number;
  waitlisted: number;
  total_revenue: number;
  todays_revenue: number;
  active_sports: number;
  total_participants: number;
  colleges_count: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
