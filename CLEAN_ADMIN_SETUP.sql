-- CLEAN ADMIN SETUP - Delete all old data, create fresh admin
-- Run in Supabase SQL Editor

-- 1. DELETE OLD DATA
DELETE FROM public.user_roles WHERE role = 'admin';
DELETE FROM public.profiles WHERE email LIKE '%musiliuadekanbi14%';

-- 2. VERIFY CLEAN (should be 0 rows)
SELECT * FROM public.profiles WHERE email LIKE '%musiliuadekanbi14%';
SELECT * FROM public.user_roles WHERE role = 'admin';

-- 3. NEW ADMIN - Register first in app OR create manually below
-- (Manual assumes user exists in auth.users)

-- Final verification template (run after register + this SQL)
-- SELECT p.user_id, p.email, ur.role FROM public.profiles p LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id WHERE p.email = 'musiliuadekanbi14@mail.com';
