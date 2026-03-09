import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerOrders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Orders</h1>
        <p className="mt-1 text-muted-foreground">Track and manage incoming orders</p>
      </div>
      <Card className="border-border/60">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No orders yet. Orders will appear here once buyers purchase your products.</p>
        </CardContent>
      </Card>
    </div>
  );
}
