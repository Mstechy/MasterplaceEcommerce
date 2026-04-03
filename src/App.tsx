import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { CurrencyProvider } from "@/hooks/useCurrency";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import RoleRedirect from "@/components/RoleRedirect";
import PageTransition from "@/components/PageTransition";
import Loader from "@/components/Loader";

// Public pages (eager)
import LandingPage from "@/pages/LandingPage";
import MarketplacePage from "@/pages/MarketplacePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import SellerStorePage from "@/pages/SellerStorePage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import NotFound from "@/pages/NotFound";



// Dashboard pages (lazy loaded)
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminSellers = lazy(() => import("@/pages/admin/AdminSellers"));
const AdminAds = lazy(() => import("@/pages/admin/AdminAds"));
const AdminAnalytics = lazy(() => import("@/pages/admin/AdminAnalytics"));
const AdminDisputes = lazy(() => import("@/pages/admin/AdminDisputes"));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("@/pages/admin/AdminOrders"));

const SellerDashboard = lazy(() => import("@/pages/seller/SellerDashboard"));
const SellerProducts = lazy(() => import("@/pages/seller/SellerProducts"));
const SellerOrders = lazy(() => import("@/pages/seller/SellerOrders"));
const SellerAds = lazy(() => import("@/pages/seller/SellerAds"));
const SellerWallet = lazy(() => import("@/pages/seller/SellerWallet"));
const SellerChat = lazy(() => import("@/pages/seller/SellerChat"));

const BuyerDashboard = lazy(() => import("@/pages/buyer/BuyerDashboard"));
const BuyerOrders = lazy(() => import("@/pages/buyer/BuyerOrders"));
const BuyerWishlist = lazy(() => import("@/pages/buyer/BuyerWishlist"));
const BuyerTracking = lazy(() => import("@/pages/buyer/BuyerTracking"));
const BuyerChat = lazy(() => import("@/pages/buyer/BuyerChat"));
const BuyerReports = lazy(() => import("@/pages/buyer/BuyerReports"));

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { role, loading } = useAuth();
  
  // If still loading, show nothing or a spinner so it doesn't redirect to 404/Buyer
  if (loading) return <div className="h-screen w-screen flex items-center justify-center">Loading Admin...</div>;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function SellerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function BuyerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return (
    <PageTransition>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/seller/:id" element={<SellerStorePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:id" element={<OrderSuccessPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Role redirect */}
        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <Suspense fallback={<Loader />}>
              <AdminDashboard />
            </Suspense>
          </AdminRoute>
        } />
        <Route path="/admin/sellers" element={
          <AdminRoute>
            <Suspense fallback={<Loader />}>
              <AdminSellers />
            </Suspense>
          </AdminRoute>
        } />
        <Route path="/admin/ads" element={
          <AdminRoute>
            <Suspense fallback={<Loader />}>
              <AdminAds />
            </Suspense>
          </AdminRoute>
        } />
        <Route path="/admin/analytics" element={
          <AdminRoute>
            <Suspense fallback={<Loader />}>
              <AdminAnalytics />
            </Suspense>
          </AdminRoute>
        } />
        <Route path="/admin/disputes" element={
          <AdminRoute>
            <Suspense fallback={<Loader />}>
              <AdminDisputes />
            </Suspense>
          </AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute>
            <Suspense fallback={<Loader />}>
              <AdminProducts />
            </Suspense>
          </AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute>
            <Suspense fallback={<Loader />}>
              <AdminOrders />
            </Suspense>
          </AdminRoute>
        } />

        {/* Seller */}
        <Route path="/seller/dashboard" element={
          <SellerRoute>
            <Suspense fallback={<Loader />}>
              <SellerDashboard />
            </Suspense>
          </SellerRoute>
        } />
        <Route path="/seller/products" element={
          <SellerRoute>
            <Suspense fallback={<Loader />}>
              <SellerProducts />
            </Suspense>
          </SellerRoute>
        } />
        <Route path="/seller/orders" element={
          <SellerRoute>
            <Suspense fallback={<Loader />}>
              <SellerOrders />
            </Suspense>
          </SellerRoute>
        } />
        <Route path="/seller/ads" element={
          <SellerRoute>
            <Suspense fallback={<Loader />}>
              <SellerAds />
            </Suspense>
          </SellerRoute>
        } />
        <Route path="/seller/wallet" element={
          <SellerRoute>
            <Suspense fallback={<Loader />}>
              <SellerWallet />
            </Suspense>
          </SellerRoute>
        } />
        <Route path="/seller/chat" element={
          <SellerRoute>
            <Suspense fallback={<Loader />}>
              <SellerChat />
            </Suspense>
          </SellerRoute>
        } />

        {/* Buyer */}
        <Route path="/buyer/dashboard" element={
          <BuyerRoute>
            <Suspense fallback={<Loader />}>
              <BuyerDashboard />
            </Suspense>
          </BuyerRoute>
        } />
        <Route path="/buyer/orders" element={
          <BuyerRoute>
            <Suspense fallback={<Loader />}>
              <BuyerOrders />
            </Suspense>
          </BuyerRoute>
        } />
        <Route path="/buyer/wishlist" element={
          <BuyerRoute>
            <Suspense fallback={<Loader />}>
              <BuyerWishlist />
            </Suspense>
          </BuyerRoute>
        } />
        <Route path="/buyer/tracking" element={
          <BuyerRoute>
            <Suspense fallback={<Loader />}>
              <BuyerTracking />
            </Suspense>
          </BuyerRoute>
        } />
        <Route path="/buyer/chat" element={
          <BuyerRoute>
            <Suspense fallback={<Loader />}>
              <BuyerChat />
            </Suspense>
          </BuyerRoute>
        } />



        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
