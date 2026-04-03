-- Copy to Supabase Dashboard → SQL Editor → Run ALL
-- Admin dashboard fix - Image 9 verified admin exists

-- 1. RLS Policy: Users read own role (fixes blank screen)
DROP POLICY IF EXISTS "Users read own role" ON user_roles;
CREATE POLICY "Users read own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);

-- 2. Admin full access
DROP POLICY IF EXISTS "Admins manage roles" ON user_roles;
CREATE POLICY "Admins manage roles" ON user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 3. Verify your admin (Image 9)
SELECT * FROM user_roles WHERE user_id LIKE '9bc2b%' AND role = 'admin';

-- 4. Test query as logged-in user
-- SELECT * FROM user_roles WHERE user_id = auth.uid(); (should return admin row)

-- Run migrations if not done
-- supabase migration up

