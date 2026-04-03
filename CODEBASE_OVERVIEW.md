# Marketplace-Masters: Comprehensive Codebase Overview

## 1. Project Type & Tech Stack

**Project Type**: Full-Stack Multi-Role Marketplace Application

**Primary Tech Stack**:
- **Frontend Framework**: React 18.3.1 with TypeScript 5.8
- **Build Tool**: Vite 5.4.19 (with React SWC plugin for fast compilation)
- **Node Version**: ES Module support (type: "module")
- **Package Manager**: Bun (indicated by bun.lockb)
- **Runtime**: Node.js environment with browser runtime

---

## 2. Page Structure

### Public Pages (Accessible to all users)
| Page | Route | File Path |
|------|-------|-----------|
| Landing Page | `/` | [src/pages/LandingPage.tsx](src/pages/LandingPage.tsx) |
| Marketplace | `/marketplace` | [src/pages/MarketplacePage.tsx](src/pages/MarketplacePage.tsx) |
| Product Detail | `/product/:id` | [src/pages/ProductDetailPage.tsx](src/pages/ProductDetailPage.tsx) |
| Seller Store | `/seller/:id` | [src/pages/SellerStorePage.tsx](src/pages/SellerStorePage.tsx) |
| Checkout | `/checkout` | [src/pages/CheckoutPage.tsx](src/pages/CheckoutPage.tsx) |
| Order Success | `/order-success/:id` | [src/pages/OrderSuccessPage.tsx](src/pages/OrderSuccessPage.tsx) |
| Login | `/auth/login` | [src/pages/auth/LoginPage.tsx](src/pages/auth/LoginPage.tsx) |
| Register | `/auth/register` | [src/pages/auth/RegisterPage.tsx](src/pages/auth/RegisterPage.tsx) |
| 404 Page | `*` (catch-all) | [src/pages/NotFound.tsx](src/pages/NotFound.tsx) |

### Admin Pages (Protected - admin role only)
| Page | Route | File Path |
|------|-------|-----------|
| Dashboard | `/admin/dashboard` | [src/pages/admin/AdminDashboard.tsx](src/pages/admin/AdminDashboard.tsx) |
| Sellers Management | `/admin/sellers` | [src/pages/admin/AdminSellers.tsx](src/pages/admin/AdminSellers.tsx) |
| Ads Management | `/admin/ads` | [src/pages/admin/AdminAds.tsx](src/pages/admin/AdminAds.tsx) |
| Analytics | `/admin/analytics` | [src/pages/admin/AdminAnalytics.tsx](src/pages/admin/AdminAnalytics.tsx) |
| Disputes | `/admin/disputes` | [src/pages/admin/AdminDisputes.tsx](src/pages/admin/AdminDisputes.tsx) |
| Products Management | `/admin/products` | [src/pages/admin/AdminProducts.tsx](src/pages/admin/AdminProducts.tsx) |
| Orders Management | `/admin/orders` | [src/pages/admin/AdminOrders.tsx](src/pages/admin/AdminOrders.tsx) |

### Seller Pages (Protected - seller role only)
| Page | Route | File Path |
|------|-------|-----------|
| Dashboard | `/seller/dashboard` | [src/pages/seller/SellerDashboard.tsx](src/pages/seller/SellerDashboard.tsx) |
| Products | `/seller/products` | [src/pages/seller/SellerProducts.tsx](src/pages/seller/SellerProducts.tsx) |
| Orders | `/seller/orders` | [src/pages/seller/SellerOrders.tsx](src/pages/seller/SellerOrders.tsx) |
| Ads | `/seller/ads` | [src/pages/seller/SellerAds.tsx](src/pages/seller/SellerAds.tsx) |
| Wallet | `/seller/wallet` | [src/pages/seller/SellerWallet.tsx](src/pages/seller/SellerWallet.tsx) |
| Chat | `/seller/chat` | [src/pages/seller/SellerChat.tsx](src/pages/seller/SellerChat.tsx) |

### Buyer Pages (Protected - buyer role only)
| Page | Route | File Path |
|------|-------|-----------|
| Dashboard | `/buyer/dashboard` | [src/pages/buyer/BuyerDashboard.tsx](src/pages/buyer/BuyerDashboard.tsx) |
| Orders | `/buyer/orders` | [src/pages/buyer/BuyerOrders.tsx](src/pages/buyer/BuyerOrders.tsx) |
| Wishlist | `/buyer/wishlist` | [src/pages/buyer/BuyerWishlist.tsx](src/pages/buyer/BuyerWishlist.tsx) |
| Tracking | `/buyer/tracking` | [src/pages/buyer/BuyerTracking.tsx](src/pages/buyer/BuyerTracking.tsx) |
| Chat | `/buyer/chat` | [src/pages/buyer/BuyerChat.tsx](src/pages/buyer/BuyerChat.tsx) |
| Reports | `/buyer/reports` | [src/pages/buyer/BuyerReports.tsx](src/pages/buyer/BuyerReports.tsx) |

### Special Routes
- **Role Redirect**: `/dashboard` - Routes users to their role-specific dashboard

---

## 3. Component Architecture

### Layout & Navigation Components
| Component | File Path | Purpose |
|-----------|-----------|---------|
| MarketplaceNavbar | [src/components/MarketplaceNavbar.tsx](src/components/MarketplaceNavbar.tsx) | Main navigation bar with marketplace features |
| NavLink | [src/components/NavLink.tsx](src/components/NavLink.tsx) | Reusable navigation link component |
| DashboardLayout | [src/components/DashboardLayout.tsx](src/components/DashboardLayout.tsx) | Wrapper layout for all admin/seller/buyer dashboards |
| CartDrawer | [src/components/CartDrawer.tsx](src/components/CartDrawer.tsx) | Slide-in shopping cart panel |
| PageTransition | [src/components/PageTransition.tsx](src/components/PageTransition.tsx) | Page transition animations |
| ProtectedRoute | [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx) | Route protection with role-based access control |
| RoleRedirect | [src/components/RoleRedirect.tsx](src/components/RoleRedirect.tsx) | Redirects users to appropriate role dashboard |

### UI Components & Features
| Component | File Path | Purpose |
|-----------|-----------|---------|
| ThemeToggle | [src/components/ThemeToggle.tsx](src/components/ThemeToggle.tsx) | Dark/light mode toggle |
| CurrencySelector | [src/components/CurrencySelector.tsx](src/components/CurrencySelector.tsx) | Multi-currency selector (USD, NGN, GBP) |
| HeroSlider | [src/components/HeroSlider.tsx](src/components/HeroSlider.tsx) | Hero section carousel component |
| GradientOrb | [src/components/GradientOrb.tsx](src/components/GradientOrb.tsx) | Animated gradient background element |
| AnimatedSection | [src/components/AnimatedSection.tsx](src/components/AnimatedSection.tsx) | Section animations (Framer Motion) |
| StatsCounter | [src/components/StatsCounter.tsx](src/components/StatsCounter.tsx) | Animated statistics display component |

### Shadcn/UI Component Library
**40+ Pre-built UI Components** located in [src/components/ui/](src/components/ui/):
- Form Components: `input`, `textarea`, `select`, `checkbox`, `radio-group`, `toggle`, `switch`
- Feedback: `alert`, `alert-dialog`, `toast`, `toaster` (sonner), `skeleton`
- Navigation: `navigation-menu`, `menubar`, `dropdown-menu`, `pagination`, `breadcrumb`, `tabs`
- Display: `card`, `badge`, `avatar`, `progress`, `slider`, `chart`, `carousel`, `table`
- Overlay: `dialog`, `drawer`, `popover`, `hover-card`, `context-menu`, `sheet`, `tooltip`
- Layout: `accordion`, `scroll-area`, `resizable`, `aspect-ratio`, `separator`
- Form Utilities: `form.tsx`, `label`
- Other: `calendar`, `command`, `date-picker`, `input-otp`, `collapsible`, `toggle-group`

---

## 4. Routing Configuration

**Framework**: React Router v6.30.1

**Routing Structure** (see [src/App.tsx](src/App.tsx)):

```
App (QueryClientProvider → TooltipProvider → BrowserRouter)
 └── AuthProvider (Global auth context)
     └── CurrencyProvider (Global currency context)
         └── CartProvider (Global cart context)
             └── AppRoutes
                 ├── Public Routes (no auth required)
                 ├── Admin Routes (protected, admin role only)
                 ├── Seller Routes (protected, seller role only)
                 ├── Buyer Routes (protected, buyer role only)
                 └── 404 Fallback
```

**Protection Mechanism**:
- `ProtectedRoute` component validates user role
- `RoleRedirect` intelligently routes users to role-specific dashboard
- Routes wrapped in `DashboardLayout` for consistent dashboard UI

---

## 5. State Management

### Global State (React Context API)

**AuthProvider** ([src/hooks/useAuth.tsx](src/hooks/useAuth.tsx))
- Manages user authentication state
- Stores: User object, Session, Profile, User Role
- Methods: `signUp()`, `signIn()`, `signOut()`
- Integrates with Supabase Authentication
- Auto-refreshes tokens on page load

**CartProvider** ([src/hooks/useCart.tsx](src/hooks/useCart.tsx))
- Manages shopping cart state
- Methods: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`
- Properties: `items[]`, `totalItems`, `totalPrice`, `isOpen`
- Cart state persists per session

**CurrencyProvider** ([src/hooks/useCurrency.tsx](src/hooks/useCurrency.tsx))
- Manages multi-currency support (USD, NGN, GBP)
- Auto-detects currency based on IP geolocation
- Stores preference in localStorage
- Methods: `setCurrencyCode()`, `formatPrice()`
- Countries: Nigeria (NGN), UK (GBP), Others (USD)

**WishlistProvider** ([src/hooks/useWishlist.tsx](src/hooks/useWishlist.tsx))
- Manages user wishlist items
- Methods: `toggleWishlist()`, `isWishlisted()`

### Server State Management

**TanStack React Query (v5.83.0)**
- Handles server state synchronization
- Provides caching, background refetching, mutations
- Query client configured globally in App

---

## 6. Authentication

**Provider**: Supabase Auth (PostgreSQL-based)

**Features**:
- Email/Password authentication
- Role-based access control (3 roles: admin, seller, buyer)
- User profiles with metadata (full_name, avatar_url, verification status)
- User status tracking (is_verified, is_banned, is_frozen)
- Auto-token refresh and session persistence
- localStorage-based session storage

**Tables Involved**:
- `auth.users` - Core authentication from Supabase Auth
- `profiles` - User profile information (email, full_name, avatar_url, verification status)
- `user_roles` - Role assignments (admin, seller, buyer)

**Implementation**:
- Supabase Client: [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts)
- Auth Hook: [src/hooks/useAuth.tsx](src/hooks/useAuth.tsx)
- Protected Routes: [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)

---

## 7. Key Features

### Customer-Facing Features
1. **Multi-Role Marketplace**: Different interfaces for buyers, sellers, and admins
2. **Product Browsing**: Browse products by category with search functionality
3. **Shopping Cart**: Add/remove products, manage quantities
4. **Wishlist**: Save favorite products for later
5. **Seller Stores**: View individual seller profiles and stores
6. **Checkout Process**: Complete purchase flow with order success page
7. **Multi-Currency Support**: USD, Nigerian Naira, British Pound with auto-detection
8. **Real-time Chat**: Communication between buyers and sellers
9. **Order Tracking**: Buyer order tracking system

### Admin Features
1. **Dashboard Analytics**: Monitor marketplace metrics
2. **Seller Management**: Approve/manage sellers and their accounts
3. **Product Management**: Monitor and manage all products
4. **Order Management**: Track all marketplace orders
5. **Dispute Resolution**: Handle buyer-seller disputes
6. **Ads Management**: Manage marketplace advertisements
7. **Analytics & Reporting**: Detailed marketplace insights

### Seller Features
1. **Product Management**: Add, edit, manage product listings
2. **Inventory Management**: Track stock quantities
3. **Order Fulfillment**: Manage and track orders
4. **Wallet/Payments**: Track earnings and withdrawals
5. **Ads Management**: Create promotional ads
6. **Customer Chat**: Direct messaging with buyers
7. **Seller Dashboard**: Performance metrics and analytics

### Buyer Features
1. **Order Management**: Track purchases and order status
2. **Order Tracking**: Real-time delivery tracking
3. **Wishlist**: Save products for later
4. **Chat**: Direct messaging with sellers
5. **Reports/Disputes**: File complaints and reports
6. **Buyer Dashboard**: Order history and account management

---

## 8. API Integration

### Primary Backend: Supabase
- **URL**: Configuration via `VITE_SUPABASE_URL` environment variable
- **Publishable Key**: `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Client Library**: @supabase/supabase-js v2.98.0
- **Database**: PostgreSQL
- **Real-time Features**: Supabase Real-time subscriptions (for chat, notifications)

### External Services
1. **IP Geolocation API**: https://ipapi.co/json/
   - Used for auto-detecting user's country
   - Automatically sets currency based on location

### Database Tables (inferred from code)
- `auth.users` - Authentication users
- `profiles` - User profiles
- `user_roles` - User role assignments
- `products` - Product listings
- `product_images` - Product images and galleries
- `categories` - Product categories
- `orders` - Order records
- `cart_items` - Shopping cart items
- `wishlist_items` - Wishlisted products
- `messages` - Chat messages between users

---

## 9. Database

**Platform**: Supabase PostgreSQL

**Configuration**:
- Project ID: `aakaygeewzrqlxsfuzjx`
- Config: [supabase/config.toml](supabase/config.toml)

**Migrations**: 4 migration files in [supabase/migrations/](supabase/migrations/):
1. `20260309014747_dde0f60e-b0f7-4bab-9d05-959fa3db93dd.sql` - Initial schema
2. `20260309162101_73e27742-78e9-4d11-b7e4-2c23990af715.sql` - Schema updates
3. `20260315030237_120be964-4cac-4ce8-bc33-077e895e7d42.sql` - Additional updates
4. `20260316001529_02e047e4-b4c2-4589-a80d-1f94351adf1b.sql` - Final updates

**Key Features**:
- Role-based access control (RLS) policies
- Real-time subscriptions enabled
- Authentication via Supabase Auth

---

## 10. UI/Styling

### CSS Framework
**Tailwind CSS v3.4.17**
- Utility-first CSS framework
- Dark mode support (`darkMode: ["class"]`)
- Custom configuration in [tailwind.config.ts](tailwind.config.ts)

### UI Component Library
**shadcn/ui** - Unstyled, accessible components built on Radix UI
- Radix UI Primitives (v1.x) - 22+ headless UI components
- Pre-built and customizable components
- Copy-paste component model

### Animations & Motion
**Framer Motion v12.35.1**
- Page transitions (PageTransition component)
- Component animations (AnimatedSection, GradientOrb)
- Smooth interaction animations

### Custom Styling
- **Fonts**: Space Grotesk (display), DM Sans (body)
- **Colors**: Custom HSL color system with CSS variables
- **Dark Mode**: Class-based dark mode toggle
- **Responsive**: Mobile-first responsive design
- **Animation Framework**: Tailwind CSS animations + Framer Motion

### Component State
**@radix-ui/** Packages (22 packages):
- Accordion, Alert Dialog, Avatar, Checkbox, Collapsible, Context Menu
- Dialog, Dropdown Menu, Hover Card, Label, Menubar, Navigation Menu
- Popover, Progress, Radio Group, Scroll Area, Select, Separator
- Slider, Switch, Tabs, Toast, Toggle, Toggle Group, Tooltip

### CSS-in-JS & Utilities
- **class-variance-authority** - Component variant management
- **clsx** - Conditional className utility
- **tailwind-merge** - Merge Tailwind classes intelligently
- **tailwindcss-animate** - Enhanced animation utilities

---

## 11. Build & Development

### Build System
- **Vite v5.4.19** - Lightning-fast build tool
- **React SWC Plugin** - ESBuild-based React transform for faster compilation
- **Environment Variables**: `.env` file support via `import.meta.env`

### Scripts
- `npm run dev` - Start development server (port 8080)
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run lint` - ESLint code quality checking
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests (Vitest)
- `npm run test:watch` - Watch mode testing

### Development Tools
- **Vite Server**: Host `::` (IPv6), Port `8080`
- **HMR**: Hot Module Replacement enabled
- **Path Alias**: `@` → `./src` (configured in vite.config.ts)
- **Component Tagger**: lovable-tagger for development (development mode only)

### Testing
- **Vitest v3.2.4** - Unit testing framework (Vite-native)
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - DOM assertions
- **JSDOM** - Browser API simulation

### Code Quality
- **ESLint v9.32.0** - JavaScript linting
- **TypeScript ESLint** - TypeScript linting
- **ESLint React Hooks Plugin** - React hooks best practices
- **ESLint React Refresh Plugin** - Fast refresh best practices

### Package Management
- **Bun** - Fast package manager and runtime
- **Dependency Count**: 28 production dependencies, 17 dev dependencies

---

## 12. Key Technologies Summary

| Category | Technology | Version |
|----------|-----------|---------|
| Frontend Framework | React | 18.3.1 |
| Language | TypeScript | 5.8 |
| Build Tool | Vite | 5.4.19 |
| Router | React Router | 6.30.1 |
| State Management | React Context + React Query | 5.83.0 |
| Backend/Database | Supabase | - |
| UI Components | shadcn/ui + Radix UI | - |
| Styling | Tailwind CSS | 3.4.17 |
| Animations | Framer Motion | 12.35.1 |
| Forms | React Hook Form | 7.61.1 |
| Charts | Recharts | 2.15.4 |
| Icons | Lucide React | 0.462.0 |
| Notifications | Sonner | 1.7.4 |
| Validation | Zod | 3.25.76 |

---

## 13. Project Statistics

- **Total Pages**: 23 (8 public + 7 admin + 6 seller + 6 buyer + 2 auth)
- **Total Components**: 50+ (13 layout/feature + 40+ UI components)
- **Production Dependencies**: 28
- **Dev Dependencies**: 17
- **Total Dependencies**: 45
- **Supported Currencies**: 3 (USD, NGN, GBP)
- **User Roles**: 3 (admin, seller, buyer)
- **Database Migrations**: 4

---

## 14. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / React App                       │
├─────────────────────────────────────────────────────────────┤
│  App.tsx (Router + Providers)                               │
│  ├── AuthProvider (User context)                            │
│  ├── CartProvider (Shopping cart context)                   │
│  ├── CurrencyProvider (Multi-currency support)              │
│  └── Routes                                                 │
│      ├── Public Routes (Landing, Marketplace, etc.)         │
│      ├── Protected Admin Routes (DashboardLayout)           │
│      ├── Protected Seller Routes (DashboardLayout)          │
│      └── Protected Buyer Routes (DashboardLayout)           │
├─────────────────────────────────────────────────────────────┤
│  React Components                                           │
│  ├── Layout Components (NavBar, DashboardLayout, etc.)      │
│  ├── UI Components (shadcn/ui components)                   │
│  ├── Feature Components (ProductCard, Cart, etc.)           │
│  └── Page Components (MarketplacePage, etc.)                │
├─────────────────────────────────────────────────────────────┤
│  State Management                                           │
│  ├── React Context (Auth, Cart, Currency, Wishlist)         │
│  ├── React Query (Server state caching)                     │
│  └── LocalStorage (Preferences, session)                    │
├─────────────────────────────────────────────────────────────┤
│  Styling & UI                                               │
│  ├── Tailwind CSS (Utility styles)                          │
│  ├── Framer Motion (Animations)                             │
│  └── Custom CSS (App.css, etc.)                             │
├─────────────────────────────────────────────────────────────┤
│  Integrations                                               │
│  ├── Supabase Client (src/integrations/supabase/)           │
│  ├── IP Geolocation API (Currency auto-detection)           │
│  └── External Services (Third-party APIs)                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Supabase)                        │
├─────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL)                                      │
│  ├── Authentication (auth.users)                            │
│  ├── Profiles (User metadata)                               │
│  ├── Roles (User role assignments)                          │
│  ├── Products (Product listings)                            │
│  ├── Orders (Order records)                                 │
│  ├── Messages (Chat), Cart, Wishlist, etc.                  │
│  └── RLS Policies (Row-level security)                      │
│                                                             │
│  Auth (Supabase Auth)                                       │
│  ├── Email/Password login                                   │
│  ├── Session management                                     │
│  └── JWT tokens                                             │
│                                                             │
│  Real-time (Supabase Realtime)                              │
│  ├── Database subscriptions                                 │
│  └── Live updates                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 15. Development Workflow

1. **Setup**: Install dependencies with `bun install`
2. **Development**: Run `bun dev` (or `npm run dev`) to start dev server
3. **Development URL**: http://localhost:8080
4. **Testing**: Run `npm run test` or `npm run test:watch`
5. **Linting**: Run `npm run lint` for code quality
6. **Building**: Run `npm run build` for production build
7. **Preview**: Run `npm run preview` to test built version

---

This comprehensive overview provides a complete understanding of the marketplace-masters application architecture, features, and technology stack.
