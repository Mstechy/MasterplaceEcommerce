import { Card, CardContent } from "@/components/ui/card";

export default function SellerChat() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Messages</h1>
        <p className="mt-1 text-muted-foreground">Chat with your buyers</p>
      </div>
      <Card className="border-border/60">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No conversations yet. Messages from buyers will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
