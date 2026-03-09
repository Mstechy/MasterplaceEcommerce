import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, ShoppingCart, Plus, Megaphone, Wallet, ArrowRight, BarChart3 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function SellerDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, totalRevenue: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("seller_id", user.id),
        supabase.from("orders").select("id, total_amount, status").eq("seller_id", user.id),
      ]);
      const orders = ordersRes.data || [];
      const pending = orders.filter(o => o.status === "pending" || o.status === "processing").length;
      const revenue = orders.filter(o => o.status === "delivered").reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      setStats({ products: productsRes.count || 0, pendingOrders: pending, totalRevenue: revenue });
    };
    fetchStats();
  }, [user]);

  const statCards = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, cardClass: "stat-card stat-card-seller" },
    { label: "Active Products", value: String(stats.products), icon: Package, cardClass: "stat-card" },
    { label: "Pending Orders", value: String(stats.pendingOrders), icon: ShoppingCart, cardClass: "stat-card-accent stat-card" },
  ];

  const quickActions = [
    { label: "Add Product", icon: Plus, href: "/seller/products", gradient: "gradient-seller", desc: "List new item" },
    { label: "View Orders", icon: ShoppingCart, href: "/seller/orders", gradient: "gradient-primary", desc: "Manage orders" },
    { label: "Run Ad", icon: Megaphone, href: "/seller/ads", gradient: "gradient-buyer", desc: "Boost visibility" },
    { label: "Withdraw", icon: Wallet, href: "/seller/wallet", gradient: "gradient-admin", desc: "Cash out earnings" },
  ];

  return (
    <div className="space-y-8">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {profile?.full_name ? `Welcome, ${profile.full_name.split(' ')[0]}` : 'Seller Dashboard'}
          </h1>
          <p className="mt-1 text-muted-foreground">Your store performance at a glance</p>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 sm:grid-cols-3">
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
              <CardTitle className="font-display">Revenue Overview</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground/40 mb-4" />
                <p className="text-sm text-muted-foreground">Revenue data will appear as you make sales</p>
              </div>
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
