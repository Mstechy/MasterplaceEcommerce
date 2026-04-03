DROP POLICY IF EXISTS "Users read own role" ON user_roles;
CREATE POLICY "Users read own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage roles" ON user_roles;
CREATE POLICY "Admins manage roles" ON user_roles FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

SELECT * FROM user_roles WHERE user_id::text LIKE '9bc2b%';

