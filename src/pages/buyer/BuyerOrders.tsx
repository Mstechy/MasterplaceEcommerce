import { Card, CardContent } from "@/components/ui/card";

export default function BuyerOrders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">My Orders</h1>
        <p className="mt-1 text-muted-foreground">View and track your purchases</p>
      </div>
      <Card className="border-border/60">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No orders yet. Visit the marketplace to start shopping!</p>
        </CardContent>
      </Card>
    </div>
  );
}
