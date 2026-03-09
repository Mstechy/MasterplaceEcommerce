import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, MousePointer, TrendingUp, Globe, Clock, ArrowUpRight, BarChart3, Package, ShoppingCart } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, sellers: 0 });

  useEffect(() => {
    const fetch = async () => {
      const [usersRes, productsRes, ordersRes, sellersRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "seller"),
      ]);
      setStats({
        users: usersRes.count || 0,
        products: productsRes.count || 0,
        orders: ordersRes.count || 0,
        sellers: sellersRes.count || 0,
      });
    };
    fetch();
  }, []);

  const analyticsStats = [
    { label: "Total Users", value: String(stats.users), icon: Users, gradient: "gradient-primary" },
    { label: "Active Sellers", value: String(stats.sellers), icon: TrendingUp, gradient: "gradient-seller" },
    { label: "Products Listed", value: String(stats.products), icon: Package, gradient: "gradient-buyer" },
    { label: "Total Orders", value: String(stats.orders), icon: ShoppingCart, gradient: "gradient-admin" },
  ];

  const metricCards = [
    { title: "Traffic Sources", icon: Globe, desc: "Breakdown of where your visitors come from" },
    { title: "User Behavior", icon: MousePointer, desc: "Click heatmaps and scroll depth analysis" },
    { title: "Session Duration", icon: Clock, desc: "Average time users spend on the platform" },
    { title: "Growth Trends", icon: ArrowUpRight, desc: "Month-over-month growth metrics" },
  ];

  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Platform Analytics</h1>
          <p className="mt-1 text-muted-foreground">Platform performance and growth metrics</p>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsStats.map((stat, i) => (
          <AnimatedSection key={stat.label} variant="fade-up" delay={i * 60}>
            <div className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.gradient}`}>
                  <stat.icon className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection variant="fade-up" delay={200}>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Detailed Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {metricCards.map(card => (
            <Card key={card.title} className="border-border/60 card-hover cursor-pointer">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{card.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={300}>
        <Card className="border-border/60">
          <CardHeader><CardTitle className="font-display">Traffic Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BarChart3 className="h-10 w-10 text-muted-foreground/40 mb-4" />
              <p className="font-display font-semibold text-foreground">Analytics data populating</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">Detailed analytics will appear as the marketplace receives traffic.</p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
