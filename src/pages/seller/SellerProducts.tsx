import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SellerProducts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">My Products</h1>
          <p className="mt-1 text-muted-foreground">Manage your product listings</p>
        </div>
        <Button className="gap-2 gradient-seller text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>
      <Card className="border-border/60">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No products yet. Click "Add Product" to create your first listing.</p>
        </CardContent>
      </Card>
    </div>
  );
}
