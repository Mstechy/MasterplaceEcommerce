import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerAds() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">My Ads</h1>
        <p className="mt-1 text-muted-foreground">Boost your products with advertising</p>
      </div>
      <Card className="border-border/60">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No ad campaigns yet. Create one to increase your product visibility.</p>
        </CardContent>
      </Card>
    </div>
  );
}
