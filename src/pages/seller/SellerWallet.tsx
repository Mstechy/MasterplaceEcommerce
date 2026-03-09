import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerWallet() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Wallet</h1>
        <p className="mt-1 text-muted-foreground">Your earnings and withdrawal management</p>
      </div>
      <Card className="border-border/60">
        <CardHeader><CardTitle className="font-display">Balance</CardTitle></CardHeader>
        <CardContent>
          <p className="font-display text-4xl font-bold text-foreground">$0.00</p>
          <p className="mt-2 text-sm text-muted-foreground">Available for withdrawal</p>
        </CardContent>
      </Card>
    </div>
  );
}
