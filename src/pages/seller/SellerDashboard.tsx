import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp, Eye, Star } from "lucide-react";

const stats = [
  { label: "Today's Sales", value: "$0.00", icon: DollarSign, change: "+0%", color: "text-seller" },
  { label: "Active Products", value: "0", icon: Package, change: "+0", color: "text-primary" },
  { label: "Pending Orders", value: "0", icon: ShoppingCart, change: "0", color: "text-accent" },
  { label: "Page Views", value: "0", icon: Eye, change: "+0%", color: "text-muted-foreground" },
];

export default function SellerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Seller Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Your store performance at a glance</p>
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
              <p className="mt-1 text-xs text-muted-foreground">{stat.change} from yesterday</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="font-display">Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Start by adding your first product to get your store up and running.</p>
        </CardContent>
      </Card>
    </div>
  );
}
