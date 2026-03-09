import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus, Eye, MousePointer, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const adStats = [
  { label: "Active Ads", value: "0", icon: Megaphone, gradient: "gradient-admin" },
  { label: "Total Impressions", value: "0", icon: Eye, gradient: "gradient-primary" },
  { label: "Total Clicks", value: "0", icon: MousePointer, gradient: "gradient-seller" },
  { label: "Ad Revenue", value: "$0.00", icon: DollarSign, gradient: "gradient-buyer" },
];

export default function AdminAds() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Ad Management</h1>
            <p className="mt-1 text-muted-foreground">Manage platform-wide advertisements and revenue</p>
          </div>
          <Button className="gap-2 gradient-admin text-primary-foreground shadow-glow">
            <Plus className="h-4 w-4" /> Create Ad
          </Button>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adStats.map((stat, i) => (
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

      {/* Empty state */}
      <AnimatedSection variant="fade-up" delay={200}>
        <Card className="border-border/60">
          <CardHeader><CardTitle className="font-display">Active Ads</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <TrendingUp className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-foreground">No active ads</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Create platform-wide ad campaigns to generate revenue. Ads will be displayed across the marketplace.
              </p>
              <Button className="mt-6 gap-2 gradient-admin text-primary-foreground shadow-glow">
                <Plus className="h-4 w-4" /> Create First Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
