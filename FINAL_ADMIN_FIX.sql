-- FINAL_ADMIN_FIX.sql - Run this in Supabase SQL Editor (Studio Dashboard)
-- Fixes RLS + Admin role for marketplace-masters admin login

-- 1. RESET RLS POLICIES on user_roles (most common blocker)
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role during signup" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- 2. RECREATE PERMISSIVE POLICIES (allows own role read, admin all)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own role" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "Users can insert own role" ON public.user_roles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- 3. SECURITY DEFINER FUNCTIONS (avoid RLS recursion)
DROP FUNCTION IF EXISTS public.is_admin(uuid);
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = p_user_id AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;

-- Update other tables to use is_admin()
-- Products example (admin full access)
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products 
FOR ALL USING (public.is_admin(auth.uid()));

-- 4. CREATE/VERIFY ADMIN USER ROLE
-- Replace YOUR_ADMIN_EMAIL@example.com with your admin email
-- First find user_id:
-- SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'admin@example.com';

-- Insert admin role (idempotent)
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'admin@example.com'  -- CHANGE THIS
ON CONFLICT (user_id, role) DO NOTHING;

-- 5. VERIFY
SELECT u.email, ur.role 
FROM auth.users u 
LEFT JOIN public.user_roles ur ON u.id = ur.user_id 
WHERE u.email = 'admin@example.com';  -- CHANGE THIS

-- 6. Test policy
SELECT public.is_admin((SELECT id FROM auth.users WHERE email = 'admin@example.com'));

-- Success: Run `bun run dev`, login → /buyer/dashboard → admin dashboard loads!

-- If still issues: Check Supabase logs for RLS violations

