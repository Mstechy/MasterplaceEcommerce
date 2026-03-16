import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, ShoppingCart, AlertTriangle, Store, Megaphone, BarChart3, Package, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ sellers: 0, buyers: 0, products: 0, orders: 0, disputes: 0, revenue: 0, pendingProducts: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [sellersRes, buyersRes, productsRes, ordersRes, disputesRes, pendingRes] = await Promise.all([
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "seller"),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "buyer"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id, total_amount", { count: "exact" }),
        supabase.from("disputes").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "active").eq("is_approved" as any, false),
      ]);
      const revenue = ordersRes.data?.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0) || 0;
      setStats({
        sellers: sellersRes.count || 0,
        buyers: buyersRes.count || 0,
        products: productsRes.count || 0,
        orders: ordersRes.count || 0,
        disputes: disputesRes.count || 0,
        revenue,
        pendingProducts: pendingRes.count || 0,
      });
    };

    const fetchRecentOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, status, total_amount, created_at, buyer_id, seller_id")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data && data.length > 0) {
        const userIds = [...new Set([...data.map(o => o.buyer_id), ...data.map(o => o.seller_id)])];
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
        const map: Record<string, string> = {};
        profiles?.forEach(p => { map[p.user_id] = p.full_name || "Unknown"; });
        setRecentOrders(data.map(o => ({ ...o, buyer_name: map[o.buyer_id] || "Unknown", seller_name: map[o.seller_id] || "Unknown" })));
      }
    };

    fetchStats();
    fetchRecentOrders();
  }, []);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    delivered: "bg-accent/10 text-accent border-accent/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const statCards = [
    { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, cardClass: "stat-card" },
    { label: "Pending Approvals", value: String(stats.pendingProducts), icon: Clock, cardClass: stats.pendingProducts > 0 ? "stat-card stat-card-destructive" : "stat-card" },
    { label: "Active Sellers", value: String(stats.sellers), icon: Store, cardClass: "stat-card stat-card-seller" },
    { label: "Total Buyers", value: String(stats.buyers), icon: Users, cardClass: "stat-card stat-card-buyer" },
    { label: "Total Orders", value: String(stats.orders), icon: ShoppingCart, cardClass: "stat-card" },
    { label: "Open Disputes", value: String(stats.disputes), icon: AlertTriangle, cardClass: "stat-card stat-card-destructive" },
  ];

  const quickActions = [
    { label: "Approve Products", icon: CheckCircle2, href: "/admin/products", gradient: "gradient-seller", desc: `${stats.pendingProducts} pending` },
    { label: "View All Orders", icon: ShoppingCart, href: "/admin/orders", gradient: "gradient-primary", desc: "Monitor transactions" },
    { label: "Manage Sellers", icon: Users, href: "/admin/sellers", gradient: "gradient-buyer", desc: "View & moderate" },
    { label: "View Disputes", icon: AlertTriangle, href: "/admin/disputes", gradient: "gradient-admin", desc: "Resolve issues" },
    { label: "Manage Ads", icon: Megaphone, href: "/admin/ads", gradient: "gradient-primary", desc: "Platform revenue" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics", gradient: "gradient-buyer", desc: "Full insights" },
  ];

  return (
    <div className="space-y-8">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {profile?.full_name ? `Welcome, ${profile.full_name.split(' ')[0]}` : 'Admin Dashboard'}
          </h1>
          <p className="mt-1 text-muted-foreground">Platform overview and management</p>
        </div>
      </AnimatedSection>

      {stats.pendingProducts > 0 && (
        <AnimatedSection variant="fade-up" delay={30}>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-600 shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">{stats.pendingProducts} product{stats.pendingProducts > 1 ? "s" : ""} awaiting your approval</p>
              <p className="text-xs text-muted-foreground">Sellers are waiting for their products to go live</p>
            </div>
            <Link to="/admin/products" className="ml-auto shrink-0">
              <Button size="sm" className="gap-1 gradient-seller text-primary-foreground">Review Now <ArrowRight className="h-3 w-3" /></Button>
            </Link>
          </div>
        </AnimatedSection>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, i) => (
          <AnimatedSection key={stat.label} variant="fade-up" delay={i * 60}>
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
              <Link to="/admin/orders">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">View All <ArrowRight className="h-3 w-3" /></Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground/40 mb-4" />
                  <p className="text-sm text-muted-foreground">No orders yet. Orders will appear as buyers make purchases.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                      <div>
                        <p className="font-medium text-sm text-foreground">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">{order.buyer_name} → {order.seller_name}</p>
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
