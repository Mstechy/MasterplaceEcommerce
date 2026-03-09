import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, ShoppingCart, AlertTriangle, TrendingUp, Store } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "$0.00", icon: DollarSign, change: "+0%", color: "text-accent" },
  { label: "Active Sellers", value: "0", icon: Store, change: "+0", color: "text-seller" },
  { label: "Total Orders", value: "0", icon: ShoppingCart, change: "+0", color: "text-primary" },
  { label: "Active Disputes", value: "0", icon: AlertTriangle, change: "0", color: "text-destructive" },
  { label: "Total Buyers", value: "0", icon: Users, change: "+0", color: "text-buyer" },
  { label: "Growth", value: "0%", icon: TrendingUp, change: "—", color: "text-primary" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Platform overview and management</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-display">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity yet. Once sellers and buyers join, you'll see platform activity here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
