

## Design Overhaul Plan

This plan upgrades the entire UI from "functional but minimal" to "premium, Framer-inspired" as originally requested. Work is split into 5 batches.

---

### Batch 1: Animation Infrastructure + Global Styles

**New files:**
- `src/components/AnimatedSection.tsx` — Reusable Intersection Observer wrapper for scroll-triggered reveal animations (fade-up, fade-left, fade-right, scale-in, stagger children)
- `src/components/StatsCounter.tsx` — Animated number counter that counts up when scrolled into view
- `src/components/GradientOrb.tsx` — Floating animated gradient blob for background decoration

**Modified files:**
- `tailwind.config.ts` — Add keyframes: `float`, `blob`, `shimmer`, `slide-up-stagger`, `pulse-glow`, `spin-slow`; add animation utilities
- `src/index.css` — Add glassmorphism utility (`.glass`), gradient text utility, floating animation, shimmer skeleton, improved dark mode polish

---

### Batch 2: Landing Page Redesign

**Rewrite `src/pages/LandingPage.tsx`** with:
- **Hero**: Large gradient text headline, animated gradient orbs in background, floating badge, dual CTA buttons with glow effects
- **Stats bar**: Animated counters (10K+ Sellers, 100K+ Products, $1M+ Transactions, 4.9 Rating) using `StatsCounter`
- **How it Works**: 3-step visual flow (Create Account → List/Browse → Secure Transaction) with connecting lines and step animations
- **Features grid**: 6 cards with icon hover effects, staggered scroll reveal via `AnimatedSection`
- **Role showcase**: Side-by-side Seller vs Buyer value props with gradient accent cards
- **Trust signals section**: SSL, Escrow, Verified Sellers, 24/7 Support badges with shield icons
- **Testimonials**: 3 quote cards with avatar, name, role
- **CTA section**: Gradient background with glow, prominent sign-up button
- **Footer**: Multi-column with links, social icons, copyright

---

### Batch 3: Auth Pages Redesign

**Rewrite `src/pages/auth/LoginPage.tsx`**:
- Split-screen layout: left = form, right = animated gradient panel with floating stats/testimonials
- Form side: Logo, heading, email/password fields, show/hide password toggle, submit button, register link
- Gradient side: Animated orbs, floating stat cards ("10K+ Sellers", "Secure Escrow"), testimonial quote

**Rewrite `src/pages/auth/RegisterPage.tsx`**:
- Same split-screen layout matching login
- Role selector cards (Buyer/Seller) with icons and gradient highlights
- Gradient panel shows different content based on selected role

---

### Batch 4: Dashboard Upgrades (All 3 Roles)

**Modify `src/components/DashboardLayout.tsx`**:
- Add subtle gradient accent line at top of sidebar
- Micro-interactions on nav items (scale on hover, active indicator bar)
- Glassmorphism on top bar

**Rewrite `src/pages/seller/SellerDashboard.tsx`**:
- Stat cards with gradient left border, animated number values
- Revenue chart using Recharts (AreaChart with gradient fill, placeholder data)
- Recent orders table (placeholder rows)
- Quick actions grid (Add Product, View Orders, Run Ad, Withdraw)

**Rewrite `src/pages/buyer/BuyerDashboard.tsx`**:
- Stat cards with gradient accents
- Recent purchases timeline (placeholder)
- Recommended products section (placeholder cards with hover effects)
- Quick actions (Browse, Track Order, Chat)

**Rewrite `src/pages/admin/AdminDashboard.tsx`**:
- 6 stat cards in 3-column grid with gradient icons
- Platform revenue chart (Recharts BarChart, placeholder data)
- Recent activity feed with timeline dots
- Quick actions (Manage Sellers, View Disputes, Run Ads, Analytics)

---

### Batch 5: Marketplace + Polish

**Rewrite `src/pages/MarketplacePage.tsx`**:
- Category pills row with horizontal scroll
- Featured banner with gradient background
- Product grid with placeholder cards (image area, title, price, seller badge, hover zoom effect)
- Filter sidebar placeholder (categories, price range, rating)

**Global polish across all pages:**
- Consistent use of `AnimatedSection` for scroll reveals
- Loading skeletons on dashboard cards
- Hover-scale on all interactive cards
- Smooth page transitions via `animate-fade-in`

---

### Files Summary

| Action | File |
|--------|------|
| Create | `src/components/AnimatedSection.tsx` |
| Create | `src/components/StatsCounter.tsx` |
| Create | `src/components/GradientOrb.tsx` |
| Modify | `tailwind.config.ts` |
| Modify | `src/index.css` |
| Rewrite | `src/pages/LandingPage.tsx` |
| Rewrite | `src/pages/auth/LoginPage.tsx` |
| Rewrite | `src/pages/auth/RegisterPage.tsx` |
| Rewrite | `src/pages/seller/SellerDashboard.tsx` |
| Rewrite | `src/pages/buyer/BuyerDashboard.tsx` |
| Rewrite | `src/pages/admin/AdminDashboard.tsx` |
| Rewrite | `src/pages/MarketplacePage.tsx` |
| Modify | `src/components/DashboardLayout.tsx` |

No new dependencies needed — Recharts is already installed.

