import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Filter, Store, Shield, Ban, Snowflake, CheckCircle2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const sellerTabs = [
  { label: "All Sellers", active: true },
  { label: "Active", active: false },
  { label: "Pending", active: false },
  { label: "Frozen", active: false },
  { label: "Banned", active: false },
];

const actionCards = [
  { icon: CheckCircle2, title: "Verify Seller", desc: "Approve seller accounts for marketplace access", gradient: "gradient-buyer" },
  { icon: Snowflake, title: "Freeze Account", desc: "Temporarily suspend seller during investigation", gradient: "gradient-primary" },
  { icon: Ban, title: "Ban Seller", desc: "Permanently remove a seller from the platform", gradient: "gradient-primary" },
];

export default function AdminSellers() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Manage Sellers</h1>
          <p className="mt-1 text-muted-foreground">View, approve, ban, or freeze seller accounts</p>
        </div>
      </AnimatedSection>

      {/* Search */}
      <AnimatedSection variant="fade-up" delay={50}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by seller name, email, ID..." className="pl-10 h-11" />
          </div>
          <Button variant="outline" className="gap-2 h-11">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </AnimatedSection>

      {/* Tabs */}
      <AnimatedSection variant="fade-up" delay={100}>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {sellerTabs.map((tab) => (
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

      {/* Quick action cards */}
      <AnimatedSection variant="fade-up" delay={120}>
        <div className="grid gap-4 sm:grid-cols-3">
          {actionCards.map((card) => (
            <button key={card.title} className="group rounded-2xl border border-border/60 bg-card p-5 text-left card-hover">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.gradient} mb-3 group-hover:scale-110 transition-transform`}>
                <card.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-sm font-semibold text-foreground">{card.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{card.desc}</p>
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Seller list */}
      <AnimatedSection variant="fade-up" delay={150}>
        <Card className="border-border/60">
          <CardHeader><CardTitle className="font-display">All Sellers</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <Store className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-foreground">No sellers registered yet</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Sellers will appear here once they register on the platform. You can then verify, freeze, or ban their accounts.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
