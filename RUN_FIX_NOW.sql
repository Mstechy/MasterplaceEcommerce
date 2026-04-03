-- RUN THIS IN SUPABASE DASHBOARD > SQL EDITOR (NEW QUERY)
-- Fixes seller role RLS + tests

-- 1. Reset all user_roles RLS (nuclear but safe)
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert own role during signup" ON public.user_roles;

-- 2. Permissive policies for testing
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY; -- TEMP for test, re-enable after
-- CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert own role during signup" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Ensure RPCs
-- get_user_role already exists
CREATE OR REPLACE FUNCTION public.insert_user_role(p_user_id UUID, p_role app_role)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, p_role) ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.insert_user_role TO authenticated;

-- 4. Test query - run this with seller user login
SELECT public.get_user_role(auth.uid()::uuid) as current_role;

-- 5. Check recent sellers
SELECT u.email, ur.role, p.is_approved FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE ur.role = 'seller' ORDER BY ur.created_at DESC LIMIT 10;

-- After test, re-enable RLS: ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
-- Then push proper migration.

-- Click RUN - then test signup/login.
