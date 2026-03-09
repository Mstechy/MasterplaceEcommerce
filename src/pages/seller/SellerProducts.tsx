import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Package, Upload, Zap, ArrowRight, Grid3X3, List } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function SellerProducts() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Products</h1>
            <p className="mt-1 text-muted-foreground">Manage your product listings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" /> Import
            </Button>
            <Button className="gap-2 gradient-seller text-primary-foreground shadow-glow-seller">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Search & view toggles */}
      <AnimatedSection variant="fade-up" delay={50}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10 h-11" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 h-11">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button className="p-2.5 bg-primary/10 text-primary"><Grid3X3 className="h-4 w-4" /></button>
              <button className="p-2.5 text-muted-foreground hover:text-foreground"><List className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Empty state */}
      <AnimatedSection variant="fade-up" delay={100}>
        <Card className="border-border/60">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-5">
                <Package className="h-9 w-9 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">No products yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Start listing products to reach buyers worldwide. Use AI tools to auto-generate descriptions and pricing.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button className="gap-2 gradient-seller text-primary-foreground shadow-glow-seller">
                  <Plus className="h-4 w-4" /> Add Your First Product
                </Button>
                <Button variant="outline" className="gap-2">
                  <Zap className="h-4 w-4" /> AI Auto-Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
