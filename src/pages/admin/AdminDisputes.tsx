import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Search, Filter, Shield, Clock, CheckCircle2, XCircle, FileText } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const disputeTabs = [
  { label: "All", active: true },
  { label: "Open", icon: Clock },
  { label: "Under Review", icon: FileText },
  { label: "Resolved", icon: CheckCircle2 },
  { label: "Dismissed", icon: XCircle },
];

const disputeStats = [
  { label: "Open Disputes", value: "0", gradient: "gradient-primary" },
  { label: "Under Review", value: "0", gradient: "gradient-seller" },
  { label: "Resolved (30d)", value: "0", gradient: "gradient-buyer" },
  { label: "Avg Resolution", value: "0h", gradient: "gradient-admin" },
];

export default function AdminDisputes() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Disputes</h1>
          <p className="mt-1 text-muted-foreground">Manage buyer complaints and fraud reports</p>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {disputeStats.map((stat, i) => (
          <AnimatedSection key={stat.label} variant="fade-up" delay={i * 60}>
            <div className="stat-card">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <p className="font-display text-2xl font-bold text-foreground mt-2">{stat.value}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Search */}
      <AnimatedSection variant="fade-up" delay={100}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by dispute ID, buyer name, seller name..." className="pl-10 h-11" />
          </div>
          <Button variant="outline" className="gap-2 h-11">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </AnimatedSection>

      {/* Tabs */}
      <AnimatedSection variant="fade-up" delay={120}>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {disputeTabs.map((tab) => (
            <button
              key={tab.label}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Empty state */}
      <AnimatedSection variant="fade-up" delay={150}>
        <Card className="border-border/60">
          <CardHeader><CardTitle className="font-display">Open Disputes</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <Shield className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-foreground">No disputes filed</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                When buyers report issues with sellers, disputes will appear here for review and resolution.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Info note */}
      <AnimatedSection variant="fade-up" delay={200}>
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-seller mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Dispute Resolution Policy</p>
            <p className="text-xs text-muted-foreground mt-1">
              Seller accounts are automatically frozen when a buyer submits verified payment proof. The AI fraud detection system scans for suspicious patterns monthly.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
