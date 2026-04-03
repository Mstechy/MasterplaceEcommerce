-- Fix RLS on user_roles table for signup flow
-- Use SECURITY DEFINER function to handle role insertion safely

-- Create secure function for inserting user role during signup
CREATE OR REPLACE FUNCTION public.insert_user_role(p_user_id UUID, p_role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_role);
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.insert_user_role(UUID, app_role) TO authenticated;

-- Update RLS policies for user_roles table
-- Drop old policies that may be blocking signup
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role during signup" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;

-- Create new permissive policies
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Add professional product fields for Amazon-standard marketplace
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'new' CHECK (condition IN ('new', 'refurbished', 'used')),
ADD COLUMN IF NOT EXISTS warranty_period TEXT,
ADD COLUMN IF NOT EXISTS seo_tags TEXT;

-- Ensure seller approval gate is enforced
-- Update RLS: sellers can only upload if approved
DROP POLICY IF EXISTS "Sellers can insert own products" ON public.products;
DROP POLICY IF EXISTS "Sellers can insert own products if approved" ON public.products;
CREATE POLICY "Sellers can insert own products if approved" ON public.products
  FOR INSERT WITH CHECK (
    auth.uid() = seller_id 
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND is_approved = true
    )
  );

-- Update RLS: only active AND approved products visible to public
DROP POLICY IF EXISTS "Anyone can read active products" ON public.products;
DROP POLICY IF EXISTS "Anyone can read active and approved products" ON public.products;
CREATE POLICY "Anyone can read active and approved products" ON public.products
  FOR SELECT USING (status = 'active' AND is_approved = true);

-- Create index for faster SEO tag searches
CREATE INDEX IF NOT EXISTS idx_products_seo_tags ON public.products USING gin(to_tsvector('english', seo_tags));

-- Create index for brand searches
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products (brand);

-- Create index for condition searches
CREATE INDEX IF NOT EXISTS idx_products_condition ON public.products (condition);

-- Ensure primary image is set
ALTER TABLE public.product_images 
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

-- Ensure only one primary image per product
CREATE OR REPLACE FUNCTION set_product_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary THEN
    UPDATE public.product_images 
    SET is_primary = false 
    WHERE product_id = NEW.product_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for setting primary image
DROP TRIGGER IF EXISTS trigger_set_product_primary_image ON public.product_images;
DROP TRIGGER IF EXISTS ensure_primary_image ON public.product_images;
CREATE TRIGGER trigger_set_product_primary_image
AFTER INSERT OR UPDATE ON public.product_images
FOR EACH ROW
EXECUTE FUNCTION set_product_primary_image();
