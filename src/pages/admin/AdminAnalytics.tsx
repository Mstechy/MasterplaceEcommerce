import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Eye, MousePointer, TrendingUp, Globe, Clock, ArrowUpRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const analyticsStats = [
  { label: "Total Visitors", value: "0", icon: Users, change: "+0% this week", gradient: "gradient-primary" },
  { label: "Page Views", value: "0", icon: Eye, change: "+0% this week", gradient: "gradient-seller" },
  { label: "Click Rate", value: "0%", icon: MousePointer, change: "vs last week", gradient: "gradient-buyer" },
  { label: "Conversion Rate", value: "0%", icon: TrendingUp, change: "vs last week", gradient: "gradient-admin" },
];

const metricCards = [
  { title: "Traffic Sources", icon: Globe, desc: "Breakdown of where your visitors come from" },
  { title: "User Behavior", icon: MousePointer, desc: "Click heatmaps and scroll depth analysis" },
  { title: "Session Duration", icon: Clock, desc: "Average time users spend on the platform" },
  { title: "Growth Trends", icon: ArrowUpRight, desc: "Month-over-month growth metrics" },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Platform Analytics</h1>
            <p className="mt-1 text-muted-foreground">Visitors, click-through rates, and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Last 7 Days</Button>
            <Button variant="outline" size="sm">Last 30 Days</Button>
            <Button variant="outline" size="sm">All Time</Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats */}
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
              <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Metric overview cards */}
      <AnimatedSection variant="fade-up" delay={200}>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Detailed Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {metricCards.map((card, i) => (
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

      {/* Chart placeholder */}
      <AnimatedSection variant="fade-up" delay={300}>
        <Card className="border-border/60">
          <CardHeader><CardTitle className="font-display">Traffic Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <BarChart3 className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-foreground">No analytics data yet</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Analytics data will appear once the marketplace receives traffic. All visitor interactions are tracked automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
