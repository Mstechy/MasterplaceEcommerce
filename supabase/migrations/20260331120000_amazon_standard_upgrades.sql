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

DROP TRIGGER IF EXISTS ensure_primary_image ON public.product_images;
CREATE TRIGGER ensure_primary_image
BEFORE UPDATE ON public.product_images
FOR EACH ROW
EXECUTE FUNCTION set_product_primary_image();
