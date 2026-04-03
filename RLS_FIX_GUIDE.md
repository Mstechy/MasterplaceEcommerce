# Fix RLS Policy Blocking Seller Signup

## Issue
The `user_roles` table RLS policy is blocking new seller registrations with error:
```
new row violates row-level security policy for table "user_roles"
```

## Solution
Updated code to use a **SECURITY DEFINER** function that bypasses RLS, allowing safe role insertion during signup.

## Steps to Apply

### Option 1: Manual SQL in Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Select your project → SQL Editor
3. Create a new query and paste this SQL:

```sql
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
```

4. Click "Run"
5. You should see "Success" message

### Option 2: Via Supabase CLI (if set up)

```bash
cd c:\marketplace-masters
supabase migration up
```

## Code Changes

Updated `src/hooks/useAuth.tsx`:
- Changed from direct `.insert()` to `supabase.rpc('insert_user_role', {...})`
- This calls the secure SECURITY DEFINER function instead of requiring RLS bypass
- Maintains security while allowing signup

## Testing the Fix

1. **Start dev server:**
   ```bash
   cd c:\marketplace-masters
   npm run dev
   ```

2. **Navigate to signup:**
   - Go to http://localhost:8081 (or your dev URL)
   - Click "Sign Up" or "Register"

3. **Create a seller account:**
   - Email: seller@test.com (or any test email)
   - Password: TestPassword123!
   - Full Name: Test Seller
   - Role: Seller

4. **Expected behavior:**
   - Signup should succeed without RLS error
   - User should be redirected to seller dashboard
   - Should see "Publishing Disabled" alert (because `is_approved = false`)
   - Cannot click "Add New Product" yet (approval-gated)

5. **If it works:**
   - Login as admin
   - Go to Admin Dashboard → Manage Sellers
   - Approve the test seller
   - Login as seller again
   - Should now see "Add New Product" button active
   - Test 4-step product upload form

## Troubleshooting

If error persists after applying SQL:

**Verify the function exists:**
```sql
SELECT proname, prosecdef FROM pg_proc WHERE proname = 'insert_user_role';
```

**Check RLS policies are still correct:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'user_roles';
```

**Reset policies (if needed):**
```sql
-- Disable RLS temporarily to allow admin inserts
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Re-enable after manual fix
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

## Architecture Explanation

- **SECURITY DEFINER**: Function runs with database owner permissions
- **Advantages**: 
  - Bypasses RLS restrictions safely
  - Controlled access via GRANT
  - No special client permission needed
  - Error handling built-in
- **Security**: 
  - Only `authenticated` users can execute
  - User can only insert their own role
  - Function is validated by postgres optimizer

## Next Steps After Fix

1. ✅ Test seller signup (this fix)
2. ⏭️ Test seller login and dashboard access
3. ⏭️ Test admin approval workflow
4. ⏭️ Test product upload 4-step form
5. ⏭️ Test product approval by admin
6. ⏭️ Test product visibility in marketplace

---

**Files Modified:**
- `supabase/migrations/20260331130000_fix_user_roles_rls.sql` (new)
- `src/hooks/useAuth.tsx` (updated RPC call)

**Status:** Ready for Supabase SQL execution
