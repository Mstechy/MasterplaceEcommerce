import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, ShoppingCart, AlertTriangle, TrendingUp, Store, Megaphone, BarChart3, Shield, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const stats = [
  { label: "Total Revenue", value: "$0.00", icon: DollarSign, change: "+0% from last month", cardClass: "stat-card" },
  { label: "Active Sellers", value: "0", icon: Store, change: "+0 this month", cardClass: "stat-card stat-card-seller" },
  { label: "Total Orders", value: "0", icon: ShoppingCart, change: "+0 this month", cardClass: "stat-card" },
  { label: "Active Disputes", value: "0", icon: AlertTriangle, change: "0 pending", cardClass: "stat-card stat-card-destructive" },
  { label: "Total Buyers", value: "0", icon: Users, change: "+0 this month", cardClass: "stat-card stat-card-buyer" },
  { label: "Growth", value: "0%", icon: TrendingUp, change: "vs last month", cardClass: "stat-card" },
];

const revenueData = [
  { name: "Jan", revenue: 0 },
  { name: "Feb", revenue: 0 },
  { name: "Mar", revenue: 0 },
  { name: "Apr", revenue: 0 },
  { name: "May", revenue: 0 },
  { name: "Jun", revenue: 0 },
];

const quickActions = [
  { label: "Manage Sellers", icon: Users, href: "/admin/sellers", gradient: "gradient-seller", desc: "View & moderate" },
  { label: "View Disputes", icon: AlertTriangle, href: "/admin/disputes", gradient: "gradient-primary", desc: "Resolve issues" },
  { label: "Manage Ads", icon: Megaphone, href: "/admin/ads", gradient: "gradient-buyer", desc: "Platform revenue" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics", gradient: "gradient-admin", desc: "Full insights" },
];

export default function AdminDashboard() {
  const { profile } = useAuth();

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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <AnimatedSection key={stat.label} variant="fade-up" delay={i * 60}>
            <div className={stat.cardClass}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <AnimatedSection variant="fade-up" delay={100} className="lg:col-span-2">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display">Platform Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <defs>
                      <linearGradient id="adminBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(250, 84%, 54%)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(250, 84%, 54%)" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Bar dataKey="revenue" fill="url(#adminBarGradient)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">Revenue data will populate as transactions occur</p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Quick actions */}
        <AnimatedSection variant="fade-up" delay={200}>
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

      {/* Activity feed */}
      <AnimatedSection variant="fade-up" delay={300}>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <Shield className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-foreground">No recent activity</p>
              <p className="mt-1 text-sm text-muted-foreground">Platform activity will appear here as sellers and buyers join</p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
