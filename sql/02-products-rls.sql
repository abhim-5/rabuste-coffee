-- RLS Policies for Products Table

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
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

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Staff can manage products" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;

-- Public read access for products (everyone can view products)
CREATE POLICY "Public read access for products" ON products
  FOR SELECT
  USING (true);

-- Staff: Can create and update products (but not delete)
CREATE POLICY "Staff can create products" ON products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

CREATE POLICY "Staff can update products" ON products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Admin: Can delete products (staff cannot)
CREATE POLICY "Admin can delete products" ON products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );