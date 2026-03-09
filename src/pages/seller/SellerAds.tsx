import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus, BarChart3, Eye, MousePointer, DollarSign, TrendingUp } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const adStats = [
  { label: "Active Campaigns", value: "0", icon: Megaphone, gradient: "gradient-seller" },
  { label: "Total Impressions", value: "0", icon: Eye, gradient: "gradient-primary" },
  { label: "Total Clicks", value: "0", icon: MousePointer, gradient: "gradient-buyer" },
  { label: "Ad Spend", value: "$0.00", icon: DollarSign, gradient: "gradient-admin" },
];

export default function SellerAds() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Ads</h1>
            <p className="mt-1 text-muted-foreground">Boost your products with advertising</p>
          </div>
          <Button className="gap-2 gradient-seller text-primary-foreground shadow-glow-seller">
            <Plus className="h-4 w-4" /> Create Campaign
          </Button>
        </div>
      </AnimatedSection>

      {/* Ad stats */}
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
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-5">
                <TrendingUp className="h-9 w-9 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">No ad campaigns yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Create your first ad campaign to increase product visibility and drive more sales. Target buyers based on interests and browsing history.
              </p>
              <Button className="mt-6 gap-2 gradient-seller text-primary-foreground shadow-glow-seller">
                <Plus className="h-4 w-4" /> Create Your First Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
