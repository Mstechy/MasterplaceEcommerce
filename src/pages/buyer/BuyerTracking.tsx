import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Search, MapPin, Package, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

export default function BuyerTracking() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Delivery Tracking</h1>
          <p className="mt-1 text-muted-foreground">Track your deliveries in real-time</p>
        </div>
      </AnimatedSection>

      {/* Track by ID */}
      <AnimatedSection variant="fade-up" delay={50}>
        <Card className="border-border/60">
          <CardContent className="p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Track a Package</h3>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Enter tracking number or order ID..." className="pl-10 h-11" />
              </div>
              <Button className="gap-2 gradient-primary text-primary-foreground h-11">
                <MapPin className="h-4 w-4" /> Track
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Active deliveries */}
      <AnimatedSection variant="fade-up" delay={100}>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Active Deliveries</h2>
        <Card className="border-border/60">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-5">
                <Truck className="h-9 w-9 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">No active deliveries</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                When your orders are shipped, real-time tracking will appear here with live status updates.
              </p>
              <Link to="/marketplace" className="mt-6">
                <Button variant="outline" className="gap-2">
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
