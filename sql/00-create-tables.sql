-- Complete Database Setup for Rabuste Coffee
-- Run this script first to create all required tables

-- 1. PROFILES TABLE
-- Drop and recreate profiles table to ensure proper schema
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text,
  full_name text,
  age integer,
  avatar_url text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin', 'superadmin')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. PRODUCTS TABLE
-- Drop and recreate products table to ensure proper schema
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text DEFAULT 'coffee',
  image_url text,
  available boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. ORDERS TABLE
-- Drop and recreate orders table to ensure proper schema
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  total numeric(10,2) NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. ORDER ITEMS TABLE
CREATE TABLE order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. WORKSHOPS TABLE
-- Drop and recreate workshops table to ensure proper schema  
DROP TABLE IF EXISTS workshop_enrollments CASCADE;
DROP TABLE IF EXISTS workshops CASCADE;
CREATE TABLE workshops (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text DEFAULT '',
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  price numeric(10,2) NOT NULL DEFAULT 0,
  max_participants integer,
  enrolled_count integer DEFAULT 0,
  image_url text,
  instructor text DEFAULT '',
  location text DEFAULT '',
  available boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 6. WORKSHOP ENROLLMENTS TABLE
CREATE TABLE workshop_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id uuid REFERENCES workshops(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'cancelled', 'completed')),
  UNIQUE(workshop_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_workshops_start_date ON workshops(start_date);
CREATE INDEX IF NOT EXISTS idx_workshops_available ON workshops(available);
CREATE INDEX IF NOT EXISTS idx_workshop_enrollments_user_id ON workshop_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_enrollments_workshop_id ON workshop_enrollments(workshop_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();