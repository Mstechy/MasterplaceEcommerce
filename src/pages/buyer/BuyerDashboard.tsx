import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Truck, DollarSign, Star, Search, MessageSquare, Package } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

const stats = [
  { label: "Active Orders", value: "0", icon: ShoppingCart, cardClass: "stat-card stat-card-buyer" },
  { label: "In Transit", value: "0", icon: Truck, cardClass: "stat-card stat-card-seller" },
  { label: "Total Spent", value: "$0.00", icon: DollarSign, cardClass: "stat-card" },
  { label: "Reviews Given", value: "0", icon: Star, cardClass: "stat-card stat-card-accent" },
];

const quickActions = [
  { label: "Browse Marketplace", icon: Search, href: "/marketplace", gradient: "gradient-buyer" },
  { label: "Track Orders", icon: Truck, href: "/buyer/tracking", gradient: "gradient-seller" },
  { label: "My Orders", icon: Package, href: "/buyer/orders", gradient: "gradient-primary" },
  { label: "Chat", icon: MessageSquare, href: "/buyer/chat", gradient: "gradient-admin" },
];

export default function BuyerDashboard() {
  return (
    <div className="space-y-8">
      <AnimatedSection variant="fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Your shopping overview</p>
          </div>
          <Link to="/marketplace">
            <Button className="gap-2 gradient-buyer text-primary-foreground shadow-glow-buyer">Browse Marketplace</Button>
          </Link>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
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
        {/* Recent orders */}
        <AnimatedSection variant="fade-up" delay={100} className="lg:col-span-2">
          <Card className="border-border/60 h-full">
            <CardHeader><CardTitle className="font-display">Recent Orders</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                  <ShoppingCart className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-display font-semibold text-foreground">No orders yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Start shopping in the marketplace!</p>
                <Link to="/marketplace" className="mt-4">
                  <Button variant="outline" className="gap-2">
                    <Search className="h-4 w-4" /> Browse Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Quick actions */}
        <AnimatedSection variant="fade-up" delay={200}>
          <Card className="border-border/60 h-full">
            <CardHeader><CardTitle className="font-display">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.href}>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 hover:bg-muted/50 mb-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.gradient}`}>
                      <action.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-medium">{action.label}</span>
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
