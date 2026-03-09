import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAds() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Ad Management</h1>
        <p className="mt-1 text-muted-foreground">Manage platform-wide advertisements and revenue</p>
      </div>
      <Card className="border-border/60">
        <CardHeader><CardTitle className="font-display">Active Ads</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No active ads. Create your first ad campaign to start generating revenue.</p>
        </CardContent>
      </Card>
    </div>
  );
}
