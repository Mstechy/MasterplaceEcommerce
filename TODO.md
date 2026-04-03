# Fix Admin Dashboard Routing (buyer/dashboard instead of admin/dashboard)

Status: In Progress

## Information Gathered
- Admin user_id: fb8a9a43-c2b7-4668-8cd9-fb385e5eeae8 has role='admin' in DB
- Email: musiliuadekanbi14@gmail.com 
- Issue: useAuth fa
s null → RoleRedirect fallback → wrong dashboard

## Steps (Approved Plan)
- [x] Create this TODO.md
- [ ] 1. Verify DB role fetch (RPC/direct query test)

- [ ] 3. Edit src/components/RoleRedirect.tsx: Remove force button, auto-retry
- [ ] 4. Test: bun run dev, login admin, visit localhost:8083/dashboard → should go /admin/dashboard
- [ ] 5. Check console logs, complete

## Current: Step 1 - DB verify

