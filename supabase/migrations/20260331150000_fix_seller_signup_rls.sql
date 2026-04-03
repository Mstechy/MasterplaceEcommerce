-- Fix seller signup: Add missing INSERT RLS policy on user_roles
-- After 20260331130000_fix_user_roles_rls.sql dropped it without recreate

-- Ensure insert_user_role SECURITY DEFINER function exists (from prev migration)
CREATE OR REPLACE FUNCTION public.insert_user_role(p_user_id UUID, p_role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.insert_user_role(UUID, app_role) TO authenticated;

-- Critical: Add back INSERT policy for direct inserts (fallback/best practice)
DROP POLICY IF EXISTS "Users can insert own role during signup" ON public.user_roles;
CREATE POLICY "Users can insert own role during signup" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ensure SELECT policy exists (self-view)
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Safety: Index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

COMMENT ON POLICY "Users can insert own role during signup" ON public.user_roles IS 'Allows users to self-assign role during signup (used by frontend or RPC fallback)';

