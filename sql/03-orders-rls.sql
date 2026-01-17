-- RLS Policies for Orders Table

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  total numeric(10,2) NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create order_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Staff can read all orders" ON orders;
DROP POLICY IF EXISTS "Staff can update orders" ON orders;

-- Customers: Can read and create their own orders
CREATE POLICY "Customers can read own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Customers can create own orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Staff: Can read all orders and update status
CREATE POLICY "Staff can read all orders" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

CREATE POLICY "Staff can update order status" ON orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Admin: Can delete orders if needed
CREATE POLICY "Admin can delete orders" ON orders
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- ORDER ITEMS TABLE POLICIES
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create own order items" ON order_items;
DROP POLICY IF EXISTS "Staff can read all order items" ON order_items;

-- Customers: Can read/create items for their own orders
CREATE POLICY "Customers can read own order items" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create own order items" ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Staff: Can read all order items
CREATE POLICY "Staff can read all order items" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );

-- Staff: Can update order items (for modifications)
CREATE POLICY "Staff can update order items" ON order_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'superadmin')
    )
  );