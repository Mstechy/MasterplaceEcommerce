import { Card, CardContent } from "@/components/ui/card";

export default function BuyerTracking() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Delivery Tracking</h1>
        <p className="mt-1 text-muted-foreground">Track your deliveries in real-time</p>
      </div>
      <Card className="border-border/60">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No active deliveries. Order tracking will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
