import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Platform Analytics</h1>
        <p className="mt-1 text-muted-foreground">Visitors, click-through rates, and performance metrics</p>
      </div>
      <Card className="border-border/60">
        <CardHeader><CardTitle className="font-display">Traffic Overview</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Analytics data will appear once the marketplace receives traffic.</p>
        </CardContent>
      </Card>
    </div>
  );
}
