-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admin_activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action character varying NOT NULL,
  resource_type character varying NOT NULL,
  resource_id character varying,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_activity_log_pkey PRIMARY KEY (id),
  CONSTRAINT admin_activity_log_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id)
);
CREATE TABLE public.ai_analytics_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question text NOT NULL,
  sql_executed text,
  insights jsonb NOT NULL,
  raw_results jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ai_analytics_history_pkey PRIMARY KEY (id),
  CONSTRAINT ai_analytics_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.art_pieces (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0::numeric),
  artist text NOT NULL,
  artist_pov text,
  image_url text NOT NULL,
  available boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  artist_id uuid,
  CONSTRAINT art_pieces_pkey PRIMARY KEY (id),
  CONSTRAINT art_pieces_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id)
);
CREATE TABLE public.art_purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  art_piece_id uuid NOT NULL,
  user_id uuid NOT NULL,
  purchase_price numeric NOT NULL,
  purchase_date timestamp with time zone DEFAULT now(),
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT art_purchases_pkey PRIMARY KEY (id),
  CONSTRAINT art_purchases_art_piece_id_fkey FOREIGN KEY (art_piece_id) REFERENCES public.art_pieces(id),
  CONSTRAINT art_purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.artists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT artists_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cafe_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'featured'::text])),
  admin_response text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cafe_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT cafe_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.franchise_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  message text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'contacted'::text, 'rejected'::text, 'closed'::text])),
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT franchise_inquiries_pkey PRIMARY KEY (id)
);
CREATE TABLE public.menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT menu_items_pkey PRIMARY KEY (id)
);
CREATE TABLE public.newsletter_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  subscribed_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'unsubscribed'::text])),
  unsubscribed_at timestamp with time zone,
  CONSTRAINT newsletter_subscriptions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['order'::text, 'art_purchase'::text, 'workshop_request'::text, 'system'::text])),
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  menu_item_id character varying NOT NULL,
  menu_item_name character varying NOT NULL,
  menu_item_image text,
  variation_name character varying,
  unit_price numeric NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  subtotal numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_number character varying NOT NULL UNIQUE,
  order_type character varying NOT NULL CHECK (order_type::text = ANY (ARRAY['dine-in'::character varying, 'takeaway-now'::character varying, 'takeaway-scheduled'::character varying]::text[])),
  scheduled_time character varying,
  subtotal numeric NOT NULL,
  tax numeric DEFAULT 0,
  total numeric NOT NULL,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'confirmed'::character varying, 'ready'::character varying, 'completed'::character varying]::text[])),
  payment_status character varying DEFAULT 'pending'::character varying CHECK (payment_status::text = ANY (ARRAY['pending'::character varying, 'paid'::character varying, 'failed'::character varying]::text[])),
  customer_name character varying,
  customer_email character varying,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  points_applied integer DEFAULT 0,
  points_discount numeric DEFAULT 0.00,
  original_total numeric,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.points_admin_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action_type text NOT NULL CHECK (action_type = ANY (ARRAY['config_change'::text, 'earning_rule_create'::text, 'earning_rule_update'::text, 'earning_rule_delete'::text, 'redemption_rule_create'::text, 'redemption_rule_update'::text, 'redemption_rule_delete'::text, 'manual_grant'::text, 'manual_deduct'::text, 'freeze_user'::text, 'unfreeze_user'::text, 'reverse_transaction'::text])),
  target_user_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT points_admin_actions_pkey PRIMARY KEY (id),
  CONSTRAINT points_admin_actions_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id),
  CONSTRAINT points_admin_actions_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.points_config (
  id integer NOT NULL DEFAULT 1 CHECK (id = 1),
  system_enabled boolean DEFAULT true,
  earning_enabled boolean DEFAULT true,
  redemption_enabled boolean DEFAULT true,
  points_to_rupee_ratio integer DEFAULT 10,
  max_discount_percent integer DEFAULT 50,
  min_payable_amount numeric DEFAULT 10.00,
  order_confirmation_delay_minutes integer DEFAULT 15,
  max_points_per_order integer DEFAULT 1000,
  daily_earning_limit integer DEFAULT 500,
  updated_by uuid,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT points_config_pkey PRIMARY KEY (id),
  CONSTRAINT points_config_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.points_earning_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rule_name text NOT NULL,
  item_type text NOT NULL CHECK (item_type = ANY (ARRAY['menu_item'::text, 'workshop'::text, 'art_piece'::text, 'global'::text])),
  item_id uuid,
  points_awarded integer NOT NULL CHECK (points_awarded >= 0),
  earn_per_rupee boolean DEFAULT false,
  enabled boolean DEFAULT true,
  valid_from timestamp with time zone DEFAULT now(),
  valid_until timestamp with time zone,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT points_earning_rules_pkey PRIMARY KEY (id),
  CONSTRAINT points_earning_rules_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.points_redemption_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rule_name text NOT NULL,
  item_type text NOT NULL CHECK (item_type = ANY (ARRAY['menu_item'::text, 'workshop'::text, 'art_piece'::text, 'global'::text])),
  item_id uuid,
  redemption_allowed boolean DEFAULT false,
  max_discount_amount numeric,
  max_discount_percent integer CHECK (max_discount_percent >= 0 AND max_discount_percent <= 100),
  enabled boolean DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT points_redemption_rules_pkey PRIMARY KEY (id),
  CONSTRAINT points_redemption_rules_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.points_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  points integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type = ANY (ARRAY['earned'::text, 'redeemed'::text])),
  source text NOT NULL CHECK (source = ANY (ARRAY['order'::text, 'workshop'::text, 'art_purchase'::text, 'referral'::text, 'bonus'::text, 'redemption'::text, 'admin_grant'::text, 'admin_deduct'::text, 'reversal'::text])),
  description text DEFAULT ''::text,
  order_id uuid,
  workshop_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'confirmed'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'reversed'::text, 'locked'::text])),
  locked boolean DEFAULT false,
  admin_id uuid,
  reversal_reason text,
  reversed_transaction_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT points_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT points_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT points_transactions_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id),
  CONSTRAINT points_transactions_reversed_transaction_id_fkey FOREIGN KEY (reversed_transaction_id) REFERENCES public.points_transactions(id)
);
CREATE TABLE public.product_ratings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_id uuid NOT NULL,
  order_item_id text NOT NULL,
  menu_item_id text NOT NULL,
  menu_item_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_ratings_pkey PRIMARY KEY (id),
  CONSTRAINT product_ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT product_ratings_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT ''::text,
  price numeric NOT NULL DEFAULT 0,
  category text DEFAULT 'coffee'::text CHECK (category = ANY (ARRAY['robusta-cold'::text, 'robusta-hot'::text, 'blend-cold'::text, 'blend-hot'::text, 'manual-brew'::text, 'shakes-tea'::text, 'food'::text])),
  image_url text,
  available boolean DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  variations jsonb DEFAULT '[]'::jsonb,
  rating numeric DEFAULT 4.5 CHECK (rating >= 0::numeric AND rating <= 5::numeric),
  review_count integer DEFAULT 0 CHECK (review_count >= 0),
  original_price numeric CHECK (original_price >= 0::numeric),
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  discount_price numeric,
  crossed_price numeric,
  is_deal_of_day boolean DEFAULT false,
  deal_expiry timestamp with time zone,
  display_order integer DEFAULT 0,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  full_name text,
  age integer,
  avatar_url text,
  role text DEFAULT 'customer'::text CHECK (role = ANY (ARRAY['customer'::text, 'staff'::text, 'admin'::text, 'superadmin'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  credits numeric DEFAULT 0,
  phone character varying,
  is_banned boolean DEFAULT false,
  banned_reason text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_points (
  user_id uuid NOT NULL,
  total_points integer DEFAULT 0,
  total_earned integer DEFAULT 0,
  total_redeemed integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_points_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_points_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.workshop_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  workshop_id uuid,
  user_id uuid,
  enrolled_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'enrolled'::text CHECK (status = ANY (ARRAY['enrolled'::text, 'cancelled'::text, 'completed'::text])),
  CONSTRAINT workshop_enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT workshop_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.workshop_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  workshop_id uuid NOT NULL,
  user_id uuid NOT NULL,
  booking_number text NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text, 'attended'::text])),
  created_at timestamp with time zone DEFAULT now(),
  payment_status text DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text])),
  payment_id text,
  razorpay_order_id text,
  amount_paid numeric,
  CONSTRAINT workshop_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT workshop_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT workshop_registrations_workshop_id_fkey FOREIGN KEY (workshop_id) REFERENCES public.workshops(id)
);
CREATE TABLE public.workshop_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  workshop_theme text NOT NULL,
  additional_details text,
  instagram_handle text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'completed'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT workshop_requests_pkey PRIMARY KEY (id),
  CONSTRAINT workshop_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.workshop_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  workshop_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT workshop_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT workshop_reviews_workshop_id_fkey FOREIGN KEY (workshop_id) REFERENCES public.workshops(id),
  CONSTRAINT workshop_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.workshops (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  full_description text,
  start_date date NOT NULL,
  start_time text NOT NULL,
  duration text,
  price numeric NOT NULL CHECK (price >= 0::numeric),
  max_spots integer DEFAULT 20,
  available_spots integer DEFAULT 20,
  image_url text,
  instructor text,
  level text,
  includes jsonb DEFAULT '[]'::jsonb,
  available boolean DEFAULT true,
  is_upcoming boolean DEFAULT true,
  reviews jsonb DEFAULT '[]'::jsonb,
  attendees integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT workshops_pkey PRIMARY KEY (id)
);