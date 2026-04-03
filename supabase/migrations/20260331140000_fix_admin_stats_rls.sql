-- Fix RLS for admin dashboard stats queries
-- Allow admins to count roles without recursive lookup issues

-- 1. Create RPC functions for role counts (bypasses RLS recursion)
CREATE OR REPLACE FUNCTION public.count_roles_by_role(p_role app_role)
RETURNS BIGINT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)
  FROM public.user_roles
  WHERE role = p_role
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Grant to authenticated
GRANT EXECUTE ON FUNCTION public.count_roles_by_role(app_role) TO authenticated;

-- 2. Enhanced policy for direct admin access
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles (counts)" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 3. Ensure disputes/products queries work for admins
DROP POLICY IF EXISTS "Admins view all disputes" ON public.disputes;
CREATE POLICY "Admins view all disputes" ON public.disputes
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins view all products" ON public.products;
CREATE POLICY "Admins view all products" ON public.products
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Apply indexes for dashboard performance
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_products_status_approved ON public.products(status, is_approved);
