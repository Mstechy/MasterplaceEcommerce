import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Filter, Package, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

const orderTabs = [
  { label: "All Orders", active: true },
  { label: "Processing", active: false },
  { label: "Shipped", active: false },
  { label: "Delivered", active: false },
  { label: "Cancelled", active: false },
];

export default function BuyerOrders() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Orders</h1>
            <p className="mt-1 text-muted-foreground">View and track your purchases</p>
          </div>
          <Link to="/marketplace">
            <Button className="gap-2 gradient-buyer text-primary-foreground">
              <Search className="h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      {/* Search & filters */}
      <AnimatedSection variant="fade-up" delay={50}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by order ID, product name..." className="pl-10 h-11" />
          </div>
          <Button variant="outline" className="gap-2 h-11">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </AnimatedSection>

      {/* Tabs */}
      <AnimatedSection variant="fade-up" delay={100}>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {orderTabs.map((tab) => (
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
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-5">
                <Package className="h-9 w-9 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">No orders yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                When you purchase products from the marketplace, your orders will appear here for easy tracking.
              </p>
              <Link to="/marketplace" className="mt-6">
                <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
                  Browse Marketplace <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
