import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, ShoppingCart, AlertTriangle, Store, Megaphone, BarChart3, Shield, ArrowRight, Package } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ sellers: 0, buyers: 0, products: 0, orders: 0, disputes: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [sellersRes, buyersRes, productsRes, ordersRes, disputesRes] = await Promise.all([
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "seller"),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "buyer"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id, total_amount", { count: "exact" }),
        supabase.from("disputes").select("id", { count: "exact", head: true }).eq("status", "open"),
      ]);
      const revenue = ordersRes.data?.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0) || 0;
      setStats({
        sellers: sellersRes.count || 0,
        buyers: buyersRes.count || 0,
        products: productsRes.count || 0,
        orders: ordersRes.count || 0,
        disputes: disputesRes.count || 0,
        revenue,
      });
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, cardClass: "stat-card" },
    { label: "Active Sellers", value: String(stats.sellers), icon: Store, cardClass: "stat-card stat-card-seller" },
    { label: "Total Buyers", value: String(stats.buyers), icon: Users, cardClass: "stat-card stat-card-buyer" },
    { label: "Products", value: String(stats.products), icon: Package, cardClass: "stat-card" },
    { label: "Total Orders", value: String(stats.orders), icon: ShoppingCart, cardClass: "stat-card" },
    { label: "Open Disputes", value: String(stats.disputes), icon: AlertTriangle, cardClass: "stat-card stat-card-destructive" },
  ];

  const quickActions = [
    { label: "Manage Sellers", icon: Users, href: "/admin/sellers", gradient: "gradient-seller", desc: "View & moderate" },
    { label: "View Disputes", icon: AlertTriangle, href: "/admin/disputes", gradient: "gradient-primary", desc: "Resolve issues" },
    { label: "Manage Ads", icon: Megaphone, href: "/admin/ads", gradient: "gradient-buyer", desc: "Platform revenue" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics", gradient: "gradient-admin", desc: "Full insights" },
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
              <CardTitle className="font-display">Platform Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground/40 mb-4" />
                <p className="text-sm text-muted-foreground">Revenue chart will populate as transactions occur</p>
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
