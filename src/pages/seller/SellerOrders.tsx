import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Filter, Package, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const orderTabs = [
  { label: "All", count: 0, active: true },
  { label: "Pending", count: 0, icon: Clock },
  { label: "Processing", count: 0, icon: Package },
  { label: "Shipped", count: 0, icon: Truck },
  { label: "Delivered", count: 0, icon: CheckCircle2 },
  { label: "Cancelled", count: 0, icon: XCircle },
];

export default function SellerOrders() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Orders</h1>
          <p className="mt-1 text-muted-foreground">Track and manage incoming orders</p>
        </div>
      </AnimatedSection>

      {/* Search */}
      <AnimatedSection variant="fade-up" delay={50}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by order ID, buyer name..." className="pl-10 h-11" />
          </div>
          <Button variant="outline" className="gap-2 h-11">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </AnimatedSection>

      {/* Order status tabs */}
      <AnimatedSection variant="fade-up" delay={100}>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {orderTabs.map((tab) => (
            <button
              key={tab.label}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{tab.count}</span>
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
                <ShoppingCart className="h-9 w-9 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">No orders yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Orders will appear here once buyers purchase your products. Make sure your listings are active and visible.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
