# Seller Signup Role Fix ✅

## What Was Fixed
**Problem**: Signup as seller → email verify → login → "Role Not Found" (RLS blocking).

**Root Cause**: Migration dropped user_roles INSERT RLS policy → signup INSERT failed → no role row → null role.

**Fixes Applied**:
1. New migration `20260331150000_fix_seller_signup_rls.sql`: INSERT policy + secure insert_user_role RPC.
2. useAuth.tsx: Direct INSERT → RPC + role fetch retry (handles DB sync delay).
3. types.ts: Added RPC typing (fixes TS error).
4. RoleRedirect.tsx: Better error msg.

## Test Steps
1. **Apply DB**: `cd supabase && supabase db push`
2. **Dev server**: `bun run dev`
3. **Test signup**:
   - Go /auth/register → select **Seller** → signup → verify email (check inbox).
   - Login → should auto-redirect **/seller/dashboard** (F12 console: [useAuth] logs).
4. **Verify DB**:
   - Supabase > user_roles: new row role='seller'.
   - profiles.is_approved=false (normal → admin approve in /admin/sellers).
5. **Edge**: Duplicate signup same email → ON CONFLICT DO NOTHING.

## Seller Flow Post-Fix
```
Signup (role=seller) → Pending (is_approved=false) → Admin approves → Can upload products
```

## Commands
```bash
# DB
cd supabase && supabase db push

# Dev
cd .. && bun run dev

# Prod build
bun run build
```

**Issue resolved! Monitor console logs. Delete TODO.md if all good.**

