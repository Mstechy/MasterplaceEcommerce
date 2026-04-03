import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Search, Package, Pencil, Trash2, Eye, EyeOff, Archive, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ProductUploadForm from "@/components/ProductUploadForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  category_id: string | null;
  status: "draft" | "active" | "archived";
  is_approved: boolean;
  stock_quantity: number;
  sku: string | null;
  created_at: string;
  product_images: { id: string; image_url: string; is_primary: boolean }[];
}

export default function SellerProducts() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setProducts(data.map(p => ({ ...p, is_approved: true })) as Product[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === "active" ? "draft" : "active";
    await supabase.from("products").update({ status: newStatus }).eq("id", product.id);
    fetchProducts();
  };

  const archiveProduct = async (id: string) => {
    await supabase.from("products").update({ status: "archived" }).eq("id", id);
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const getApprovalBadge = (product: Product) => {
    if (product.status !== "active") return null;
    if (product.is_approved) {
      return <Badge className="bg-accent/10 text-accent border-accent/20 gap-1 text-xs"><CheckCircle2 className="h-3 w-3" /> Approved</Badge>;
    }
    return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 gap-1 text-xs"><Clock className="h-3 w-3" /> Pending Approval</Badge>;
  };

  const statusColors: Record<string, string> = {
    active: "bg-accent/10 text-accent border-accent/20",
    draft: "bg-muted text-muted-foreground border-border",
    archived: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Products</h1>
            <p className="mt-1 text-muted-foreground">Manage your product listings ({products.length} total)</p>
          </div>
          <Button 
            onClick={() => setShowUploadForm(true)}
            className="gap-2 gradient-seller text-primary-foreground shadow-glow-seller"
          >
            <Plus className="h-4 w-4" /> Add New Product
          </Button>
        </div>
      </AnimatedSection>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Seller features unlocked only for approved sellers.
          </AlertDescription>
        </Alert>
      )}

      {showUploadForm && (
        <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <ProductUploadForm
              userId={user!.id}
              onSuccess={() => {
                setShowUploadForm(false);
                fetchProducts();
              }}
              onCancel={() => setShowUploadForm(false)}
              isSellerApproved={true}
            />
          </DialogContent>
        </Dialog>
      )}

      <AnimatedSection variant="fade-up" delay={50}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search products..." 
            className="pl-10 h-11" 
          />
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={100}>
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading products...</div>
        ) : filtered.length === 0 ? (
          <Card className="border-border/60">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-5">
                  <Package className="h-9 w-9 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {search ? "No products match your search" : "No products yet"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  {search ? "Try a different search term" : "Start listing products to reach buyers worldwide. Products will be reviewed by admin before going live."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => {
              const primaryImage = product.product_images?.find(i => i.is_primary) || product.product_images?.[0];
              return (
                <Card key={product.id} className="border-border/60 overflow-hidden group">
                  <div className="aspect-video bg-muted relative">
                    {primaryImage ? (
                      <img src={primaryImage.image_url} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1">
                      <Badge className={statusColors[product.status]}>
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display font-semibold text-foreground truncate">{product.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-display text-lg font-bold text-foreground">${product.price}</span>
                      {product.compare_at_price && (
                        <span className="text-sm text-muted-foreground line-through">${product.compare_at_price}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-muted-foreground">Stock: {product.stock_quantity}</p>
                      {getApprovalBadge(product)}
                    </div>
                    <div className="flex gap-1 mt-3">
                      <Button variant="outline" size="sm" onClick={() => {}} className="flex-1 gap-1">
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toggleStatus(product)}>
                        {product.status === "active" ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => archiveProduct(product.id)}>
                        <Archive className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteProduct(product.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </AnimatedSection>
    </div>
  );
}
