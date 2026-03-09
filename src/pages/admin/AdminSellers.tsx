import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSellers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Manage Sellers</h1>
        <p className="mt-1 text-muted-foreground">View, approve, ban, or freeze seller accounts</p>
      </div>
      <Card className="border-border/60">
        <CardHeader><CardTitle className="font-display">All Sellers</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No sellers registered yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
