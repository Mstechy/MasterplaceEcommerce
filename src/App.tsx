import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import RoleRedirect from "@/components/RoleRedirect";
import PageTransition from "@/components/PageTransition";

// Pages
import LandingPage from "@/pages/LandingPage";
import MarketplacePage from "@/pages/MarketplacePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import SellerStorePage from "@/pages/SellerStorePage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import NotFound from "@/pages/NotFound";

// Admin
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminSellers from "@/pages/admin/AdminSellers";
import AdminAds from "@/pages/admin/AdminAds";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminDisputes from "@/pages/admin/AdminDisputes";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";

// Seller
import SellerDashboard from "@/pages/seller/SellerDashboard";
import SellerProducts from "@/pages/seller/SellerProducts";
import SellerOrders from "@/pages/seller/SellerOrders";
import SellerAds from "@/pages/seller/SellerAds";
import SellerWallet from "@/pages/seller/SellerWallet";
import SellerChat from "@/pages/seller/SellerChat";

// Buyer
import BuyerDashboard from "@/pages/buyer/BuyerDashboard";
import BuyerOrders from "@/pages/buyer/BuyerOrders";
import BuyerTracking from "@/pages/buyer/BuyerTracking";
import BuyerChat from "@/pages/buyer/BuyerChat";
import BuyerReports from "@/pages/buyer/BuyerReports";
import BuyerWishlist from "@/pages/buyer/BuyerWishlist";

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
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
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Role redirect */}
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/sellers" element={<AdminRoute><AdminSellers /></AdminRoute>} />
        <Route path="/admin/ads" element={<AdminRoute><AdminAds /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
        <Route path="/admin/disputes" element={<AdminRoute><AdminDisputes /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />

        {/* Seller */}
        <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
        <Route path="/seller/products" element={<SellerRoute><SellerProducts /></SellerRoute>} />
        <Route path="/seller/orders" element={<SellerRoute><SellerOrders /></SellerRoute>} />
        <Route path="/seller/ads" element={<SellerRoute><SellerAds /></SellerRoute>} />
        <Route path="/seller/wallet" element={<SellerRoute><SellerWallet /></SellerRoute>} />
        <Route path="/seller/chat" element={<SellerRoute><SellerChat /></SellerRoute>} />

        {/* Buyer */}
        <Route path="/buyer/dashboard" element={<BuyerRoute><BuyerDashboard /></BuyerRoute>} />
        <Route path="/buyer/orders" element={<BuyerRoute><BuyerOrders /></BuyerRoute>} />
        <Route path="/buyer/wishlist" element={<BuyerRoute><BuyerWishlist /></BuyerRoute>} />
        <Route path="/buyer/tracking" element={<BuyerRoute><BuyerTracking /></BuyerRoute>} />
        <Route path="/buyer/chat" element={<BuyerRoute><BuyerChat /></BuyerRoute>} />
        <Route path="/buyer/reports" element={<BuyerRoute><BuyerReports /></BuyerRoute>} />

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
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
