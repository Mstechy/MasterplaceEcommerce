import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDisputes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Disputes</h1>
        <p className="mt-1 text-muted-foreground">Manage buyer complaints and fraud reports</p>
      </div>
      <Card className="border-border/60">
        <CardHeader><CardTitle className="font-display">Open Disputes</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No disputes filed. Reports will appear here when buyers flag issues.</p>
        </CardContent>
      </Card>
    </div>
  );
}
