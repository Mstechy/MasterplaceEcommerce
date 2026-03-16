import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, ShoppingCart, Plus, Megaphone, Wallet, ArrowRight, BarChart3, Clock, Store, Eye } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function SellerDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ products: 0, pendingApproval: 0, pendingOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const [productsRes, pendingRes, ordersRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("seller_id", user.id),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("seller_id", user.id).eq("status", "active").eq("is_approved" as any, false),
        supabase.from("orders").select("id, total_amount, status").eq("seller_id", user.id),
      ]);
      const orders = ordersRes.data || [];
      const pending = orders.filter(o => o.status === "pending" || o.status === "processing").length;
      const revenue = orders.filter(o => o.status === "delivered").reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      setStats({ products: productsRes.count || 0, pendingApproval: pendingRes.count || 0, pendingOrders: pending, totalRevenue: revenue });
    };

    const fetchRecentOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, status, total_amount, created_at, buyer_id")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (data && data.length > 0) {
        const buyerIds = [...new Set(data.map(o => o.buyer_id))];
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", buyerIds);
        const map: Record<string, string> = {};
        profiles?.forEach(p => { map[p.user_id] = p.full_name || "Unknown"; });
        setRecentOrders(data.map(o => ({ ...o, buyer_name: map[o.buyer_id] || "Unknown" })));
      }
    };

    fetchStats();
    fetchRecentOrders();
  }, [user]);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    delivered: "bg-accent/10 text-accent border-accent/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const statCards = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, cardClass: "stat-card stat-card-seller" },
    { label: "Active Products", value: String(stats.products), icon: Package, cardClass: "stat-card" },
    { label: "Pending Approval", value: String(stats.pendingApproval), icon: Clock, cardClass: stats.pendingApproval > 0 ? "stat-card stat-card-destructive" : "stat-card" },
    { label: "Pending Orders", value: String(stats.pendingOrders), icon: ShoppingCart, cardClass: "stat-card stat-card-buyer" },
  ];

  const quickActions = [
    { label: "Add Product", icon: Plus, href: "/seller/products", gradient: "gradient-seller", desc: "List new item" },
    { label: "View Orders", icon: ShoppingCart, href: "/seller/orders", gradient: "gradient-primary", desc: "Manage orders" },
    { label: "My Store", icon: Store, href: `/seller/${user?.id}`, gradient: "gradient-buyer", desc: "Preview storefront" },
    { label: "Run Ad", icon: Megaphone, href: "/seller/ads", gradient: "gradient-admin", desc: "Boost visibility" },
    { label: "Withdraw", icon: Wallet, href: "/seller/wallet", gradient: "gradient-primary", desc: "Cash out earnings" },
  ];

  return (
    <div className="space-y-8">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {profile?.full_name ? `Welcome, ${profile.full_name.split(' ')[0]}` : 'Seller Dashboard'}
            </h1>
            <p className="mt-1 text-muted-foreground">Your store performance at a glance</p>
          </div>
          <Link to="/seller/products">
            <Button className="gap-2 gradient-seller text-primary-foreground shadow-glow-seller">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      {stats.pendingApproval > 0 && (
        <AnimatedSection variant="fade-up" delay={30}>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-600 shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">{stats.pendingApproval} product{stats.pendingApproval > 1 ? "s" : ""} pending admin approval</p>
              <p className="text-xs text-muted-foreground">Products will be visible on the marketplace once approved</p>
            </div>
          </div>
        </AnimatedSection>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <AnimatedSection key={stat.label} variant="fade-up" delay={i * 80}>
            <div className={stat.cardClass}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AnimatedSection variant="fade-up" delay={200} className="lg:col-span-2">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display">Recent Orders</CardTitle>
              <Link to="/seller/orders">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">View All <ArrowRight className="h-3 w-3" /></Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground/40 mb-4" />
                  <p className="text-sm text-muted-foreground">No orders yet. Orders will appear as buyers purchase your products.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                      <div>
                        <p className="font-medium text-sm text-foreground">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">from {order.buyer_name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm text-foreground">${order.total_amount}</span>
                        <Badge className={`${statusColors[order.status] || ""} capitalize text-xs`}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection variant="fade-up" delay={300}>
          <Card className="border-border/60 h-full">
            <CardHeader><CardTitle className="font-display">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.href}>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 hover:bg-muted/50 mb-1">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.gradient}`}>
                      <action.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium text-sm">{action.label}</span>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
