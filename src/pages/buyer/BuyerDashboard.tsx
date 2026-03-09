import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Truck, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { label: "Active Orders", value: "0", icon: ShoppingCart, color: "text-buyer" },
  { label: "In Transit", value: "0", icon: Truck, color: "text-seller" },
  { label: "Total Spent", value: "$0.00", icon: DollarSign, color: "text-primary" },
  { label: "Reviews Given", value: "0", icon: Star, color: "text-seller" },
];

export default function BuyerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Your shopping overview</p>
        </div>
        <Link to="/marketplace">
          <Button className="gap-2 gradient-buyer text-primary-foreground">Browse Marketplace</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="font-display">Recent Orders</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No orders yet. Start shopping in the marketplace!</p>
        </CardContent>
      </Card>
    </div>
  );
}
