

# MVP Foundation Plan — Real Working Marketplace

## Current State (The Problem)

The database only has `profiles` and `user_roles`. Every page is a static shell with hardcoded data. Nothing works — no products, no orders, no chat, no seller management. The marketplace shows fake placeholder products.

## What This Plan Builds

A fully functional Phase 1 MVP where sellers can list real products, buyers can browse and see them on the marketplace, admin can manage sellers, and all pages pull from the real database.

---

## Part 1: Database Tables (Migration)

Create these tables with RLS policies:

**categories** — id, name, slug, icon, sort_order

**products** — id, seller_id (ref profiles.user_id), title, description, price, compare_at_price, currency, category_id, status (draft/active/archived), stock_quantity, sku, created_at, updated_at

**product_images** — id, product_id, image_url, sort_order, is_primary

**orders** — id, buyer_id, seller_id, status (pending/processing/shipped/delivered/cancelled/disputed), total_amount, currency, shipping_address (jsonb), tracking_number, created_at, updated_at

**order_items** — id, order_id, product_id, quantity, unit_price, total_price

**messages** — id, sender_id, receiver_id, content, is_read, created_at (enable realtime)

**disputes** — id, order_id, buyer_id, seller_id, reason, description, proof_url, status (open/investigating/resolved/dismissed), admin_notes, created_at, resolved_at

**ads** — id, seller_id (nullable for admin ads), title, image_url, target_url, placement (banner/sidebar/featured), status (active/paused/ended), impressions, clicks, budget, spent, start_date, end_date

**seller_wallets** — id, seller_id, balance, currency, created_at, updated_at

**wallet_transactions** — id, wallet_id, type (sale/withdrawal/fee/refund), amount, description, reference_id, created_at

**Storage bucket:** `product-images` for file uploads

RLS summary:
- Products: sellers CRUD own, everyone reads active
- Orders: buyers read own, sellers read own, admin reads all
- Messages: sender/receiver read own, insert if authenticated
- Disputes: buyer creates, admin manages, seller reads own
- Ads: seller manages own, admin manages all
- Wallets: seller reads own, admin reads all

Seed `categories` with: Electronics, Fashion, Jewelry, Books, Sports, Home & Garden, Food & Drink, Health & Beauty

---

## Part 2: Seller Product Management (Real CRUD)

**SellerProducts.tsx** — Full rewrite:
- Fetch products from DB for current seller
- "Add Product" opens a dialog/form: title, description, price, category (from DB), stock, image upload to storage bucket
- Product cards show real data with edit/delete actions
- Status toggle (draft/active/archived)
- Search and filter actually work against DB

**Product image upload:** Use storage bucket, store URLs in product_images table

---

## Part 3: Marketplace Connected to Real Data

**MarketplacePage.tsx** — Rewrite to:
- Fetch active products from DB with seller profile info
- Categories fetched from DB, filter works
- Search queries product titles/descriptions
- Product cards show real images, prices, seller name, verified badge
- Link to product detail page

**New: ProductDetailPage.tsx** (`/product/:id`):
- Full product view with images, description, price, seller info
- "Add to Cart" / "Buy Now" button (for future checkout)
- Seller profile link

**New: SellerStorePage.tsx** (`/seller/:id`):
- Public seller profile with their products
- Seller rating, verified status, product count

Add both routes to App.tsx.

---

## Part 4: Admin Seller Management (Real Data)

**AdminSellers.tsx** — Rewrite to:
- Fetch all sellers from profiles + user_roles
- Display in a table: name, email, verified, frozen, banned, product count, joined date
- Working action buttons: Verify, Freeze, Unfreeze, Ban, Unban (update profiles table)
- Tabs filter by status (active/frozen/banned)
- Search works against DB

**AdminDashboard.tsx** — Wire stats:
- Count sellers, buyers, products, orders from DB
- Revenue chart placeholder (will be real when orders exist)

---

## Part 5: Buyer & Order Flow (Foundation)

**BuyerDashboard.tsx** — Fetch real order counts, recent orders from DB

**BuyerOrders.tsx** — Fetch orders for current buyer, show status, link to tracking

**BuyerTracking.tsx** — Show shipped/processing orders with tracking info

**SellerOrders.tsx** — Fetch orders for current seller, update status (processing → shipped → delivered)

**SellerDashboard.tsx** — Real stats from DB (product count, order count, revenue)

---

## Part 6: Chat Foundation

**BuyerChat.tsx / SellerChat.tsx** — Real messaging:
- Fetch conversations (distinct message partners)
- Message thread view
- Send messages (insert to messages table)
- Enable realtime on messages table for live updates
- Unread message indicators

---

## Part 7: Missing Routes + Navigation

Add to App.tsx:
- `/product/:id` → ProductDetailPage
- `/seller/:id` → SellerStorePage

Ensure all navigation links across pages point to correct routes and work.

---

## Files Summary

| Action | File |
|--------|------|
| Migration | ~12 tables + storage bucket + RLS + seed categories |
| Create | `src/pages/ProductDetailPage.tsx` |
| Create | `src/pages/SellerStorePage.tsx` |
| Rewrite | `src/pages/seller/SellerProducts.tsx` (real CRUD) |
| Rewrite | `src/pages/seller/SellerOrders.tsx` (real data) |
| Rewrite | `src/pages/seller/SellerDashboard.tsx` (real stats) |
| Rewrite | `src/pages/seller/SellerChat.tsx` (real messaging) |
| Rewrite | `src/pages/buyer/BuyerDashboard.tsx` (real stats) |
| Rewrite | `src/pages/buyer/BuyerOrders.tsx` (real data) |
| Rewrite | `src/pages/buyer/BuyerTracking.tsx` (real data) |
| Rewrite | `src/pages/buyer/BuyerChat.tsx` (real messaging) |
| Rewrite | `src/pages/admin/AdminSellers.tsx` (real management) |
| Rewrite | `src/pages/admin/AdminDashboard.tsx` (real stats) |
| Rewrite | `src/pages/MarketplacePage.tsx` (real products) |
| Modify | `src/App.tsx` (add new routes) |

This is a large plan. Due to the scope, implementation will be split across multiple messages — starting with the database migration and core product CRUD, then connecting each page.

