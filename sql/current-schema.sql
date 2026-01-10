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
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'confirmed'::character varying, 'preparing'::character varying, 'ready'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[])),
  payment_status character varying DEFAULT 'pending'::character varying CHECK (payment_status::text = ANY (ARRAY['pending'::character varying, 'paid'::character varying, 'failed'::character varying]::text[])),
  customer_name character varying,
  customer_email character varying,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.points_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  points integer NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['earned'::text, 'redeemed'::text])),
  source text NOT NULL CHECK (source = ANY (ARRAY['order'::text, 'workshop'::text, 'referral'::text, 'bonus'::text, 'redemption'::text])),
  description text DEFAULT ''::text,
  order_id uuid,
  workshop_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT points_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT points_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
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
  CONSTRAINT workshop_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT workshop_registrations_workshop_id_fkey FOREIGN KEY (workshop_id) REFERENCES public.workshops(id),
  CONSTRAINT workshop_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
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