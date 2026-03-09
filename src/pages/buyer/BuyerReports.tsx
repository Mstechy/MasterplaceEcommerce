import { Card, CardContent } from "@/components/ui/card";

export default function BuyerReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Reports</h1>
        <p className="mt-1 text-muted-foreground">Report sellers and track complaint status</p>
      </div>
      <Card className="border-border/60">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No reports filed. You can report a seller if you experience any issues.</p>
        </CardContent>
      </Card>
    </div>
  );
}
