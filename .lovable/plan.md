

# Plan: Role-Differentiated Dashboards + Admin Approval Flow + End-to-End Polish

## What's Being Fixed

The user wants three distinct, professional experiences for Admin, Seller, and Buyer — modeled after Amazon/eBay/1688. Currently all dashboards work but feel generic. Key gaps:

1. **Seller product management** exists but isn't prominent or intuitive enough
2. **Admin approval** is missing — sellers should need admin approval before products go live
3. **Buyer flow** needs clearer purchase-to-tracking journey
4. **Admin** needs to see and control everything (all orders, all products, approve sellers)
5. **No admin product approval** workflow exists

## Database Changes

### Migration: Add `is_approved` to profiles + `admin_notes` to products

```sql
-- Add seller approval flag
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT false;

-- Add admin_approved flag to products (admin must approve before public visibility)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT false;

-- Update RLS: "Anyone can read active products" should also require is_approved = true
DROP POLICY IF EXISTS "Anyone can read active products" ON public.products;
CREATE POLICY "Anyone can read active products" ON public.products
  FOR SELECT USING (status = 'active' AND is_approved = true);

-- Admin can read all products (already exists via "Admins can manage all products")
```

This means:
- Seller creates product → status = "active", is_approved = false → invisible to buyers
- Admin approves product → is_approved = true → visible on marketplace
- Admin approves seller → is_approved = true on profile → can be shown as "Approved Seller"

### Data update: Set existing seeded products to is_approved = true
```sql
UPDATE public.products SET is_approved = true WHERE status = 'active';
```

## File Changes

### 1. Admin Dashboard — `/admin/dashboard` (AdminDashboard.tsx)
- Add "Pending Approvals" stat card (products where is_approved = false)
- Add "Recent Orders" section showing latest orders across all sellers
- Add quick action for "Approve Products"

### 2. New: Admin Products Page — `/admin/products` (AdminProducts.tsx)
- Table of ALL products across all sellers
- Filter tabs: All, Pending Approval, Active, Archived
- Approve/Reject buttons per product
- View product details inline
- Add route to App.tsx, add nav item to DashboardLayout

### 3. New: Admin Orders Page — `/admin/orders` (AdminOrders.tsx)  
- Table of ALL orders across all buyers/sellers
- Filter by status
- View order details (items, shipping address, buyer/seller info)
- Add route to App.tsx, add nav item to DashboardLayout

### 4. Admin Sellers (AdminSellers.tsx) — Enhance
- Add "Approve" button for unapproved sellers (set is_approved = true)
- Show approval status badge
- When seller is approved, their products can go live

### 5. Seller Products (SellerProducts.tsx) — Enhance
- Show approval status on each product card ("Pending Approval" / "Approved" / "Rejected")
- When seller creates product, show toast: "Product submitted for admin approval"
- Make the "Add Product" form more prominent — full page or large modal with clear sections (like Amazon Seller Central)
- Add multiple image upload support (currently only 1 image)

### 6. Seller Dashboard (SellerDashboard.tsx) — Enhance
- Show "Products Pending Approval" count
- Show recent orders with buyer names
- Add "Store Preview" link to their public store page

### 7. Buyer Dashboard (BuyerDashboard.tsx) — Enhance
- Show recent orders with product images and status
- Fetch actual recent orders from DB instead of showing empty state
- Add "Continue Shopping" prominent CTA

### 8. Buyer Orders (BuyerOrders.tsx) — Enhance
- Show order items (product name, image, quantity) not just order ID
- Add "Track" button linking to tracking page
- Add "Report Issue" button per order

### 9. DashboardLayout.tsx — Update nav
- Admin: Add "Products" and "Orders" nav items
- Keep seller and buyer navs as-is

### 10. App.tsx — Add routes
- `/admin/products` → AdminProducts
- `/admin/orders` → AdminOrders

## Files Summary

| Action | File |
|--------|------|
| Migration | Add `is_approved` to profiles + products, update RLS |
| Data update | Set existing products is_approved = true |
| Create | `src/pages/admin/AdminProducts.tsx` |
| Create | `src/pages/admin/AdminOrders.tsx` |
| Edit | `src/pages/admin/AdminDashboard.tsx` |
| Edit | `src/pages/admin/AdminSellers.tsx` |
| Edit | `src/pages/seller/SellerProducts.tsx` |
| Edit | `src/pages/seller/SellerDashboard.tsx` |
| Edit | `src/pages/buyer/BuyerDashboard.tsx` |
| Edit | `src/pages/buyer/BuyerOrders.tsx` |
| Edit | `src/components/DashboardLayout.tsx` |
| Edit | `src/App.tsx` |

