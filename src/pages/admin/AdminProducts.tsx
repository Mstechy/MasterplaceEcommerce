import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Search, Package, CheckCircle2, XCircle, Eye, Clock } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  price: number;
  status: string;
  is_approved: boolean;
  stock_quantity: number;
  created_at: string;
  seller_id: string;
  seller_name?: string;
  seller_email?: string;
  primary_image?: string;
}

type Tab = "all" | "pending" | "approved" | "archived";

export default function AdminProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  const fetchProducts = async () => {
    setLoading(true);
    const { data: productsData } = await supabase
      .from("products")
      .select("*, product_images(image_url, is_primary)")
      .order("created_at", { ascending: false });

    if (!productsData) { setLoading(false); return; }

    // Get unique seller IDs and fetch profiles
    const sellerIds = [...new Set(productsData.map(p => p.seller_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .in("user_id", sellerIds);

    const profileMap: Record<string, { name: string; email: string }> = {};
    profiles?.forEach(p => { profileMap[p.user_id] = { name: p.full_name || "Unknown", email: p.email }; });

    const mapped: Product[] = productsData.map(p => {
      const imgs = (p as any).product_images || [];
      const primary = imgs.find((i: any) => i.is_primary) || imgs[0];
      return {
        id: p.id,
        title: p.title,
        price: p.price,
        status: p.status,
        is_approved: (p as any).is_approved ?? false,
        stock_quantity: p.stock_quantity,
        created_at: p.created_at,
        seller_id: p.seller_id,
        seller_name: profileMap[p.seller_id]?.name,
        seller_email: profileMap[p.seller_id]?.email,
        primary_image: primary?.image_url,
      };
    });

    setProducts(mapped);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const approveProduct = async (id: string) => {
    const { error } = await supabase.from("products").update({ is_approved: true } as any).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Product approved", description: "Product is now visible on the marketplace." });
    fetchProducts();
  };

  const rejectProduct = async (id: string) => {
    const { error } = await supabase.from("products").update({ is_approved: false, status: "draft" } as any).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Product rejected", description: "Product has been moved to draft." });
    fetchProducts();
  };

  const filtered = products.filter(p => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.seller_name?.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      tab === "all" ||
      (tab === "pending" && p.status === "active" && !p.is_approved) ||
      (tab === "approved" && p.is_approved) ||
      (tab === "archived" && p.status === "archived");
    return matchesSearch && matchesTab;
  });

  const pendingCount = products.filter(p => p.status === "active" && !p.is_approved).length;

  const tabs: { label: string; value: Tab; count: number }[] = [
    { label: "All Products", value: "all", count: products.length },
    { label: "Pending Approval", value: "pending", count: pendingCount },
    { label: "Approved", value: "approved", count: products.filter(p => p.is_approved).length },
    { label: "Archived", value: "archived", count: products.filter(p => p.status === "archived").length },
  ];

  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Product Management</h1>
          <p className="mt-1 text-muted-foreground">Review, approve, or reject product listings across all sellers</p>
        </div>
      </AnimatedSection>

      {pendingCount > 0 && (
        <AnimatedSection variant="fade-up" delay={30}>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-600 shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">{pendingCount} product{pendingCount > 1 ? "s" : ""} awaiting approval</p>
              <p className="text-xs text-muted-foreground">Review and approve to make them visible on the marketplace</p>
            </div>
            <Button size="sm" variant="outline" className="ml-auto shrink-0" onClick={() => setTab("pending")}>
              Review Now
            </Button>
          </div>
        </AnimatedSection>
      )}

      <AnimatedSection variant="fade-up" delay={50}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product name or seller..." className="pl-10 h-11" />
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={80}>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === t.value ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {t.label} <span className="ml-1 text-xs opacity-70">({t.count})</span>
            </button>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={100}>
        <Card className="border-border/60">
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Loading products...</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                  <Package className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-display font-semibold text-foreground">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">Products will appear here as sellers list them.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0">
                              {product.primary_image ? (
                                <img src={product.primary_image} alt={product.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex items-center justify-center h-full"><Package className="h-4 w-4 text-muted-foreground" /></div>
                              )}
                            </div>
                            <span className="font-medium text-foreground text-sm truncate max-w-[200px]">{product.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="text-sm text-foreground">{product.seller_name}</span>
                            <p className="text-xs text-muted-foreground">{product.seller_email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${product.price}</TableCell>
                        <TableCell>{product.stock_quantity}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            <Badge variant={product.status === "active" ? "default" : "secondary"} className="capitalize text-xs">
                              {product.status}
                            </Badge>
                            {product.is_approved ? (
                              <Badge className="bg-accent/10 text-accent border-accent/20 gap-1 text-xs">
                                <CheckCircle2 className="h-3 w-3" /> Approved
                              </Badge>
                            ) : product.status === "active" ? (
                              <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 gap-1 text-xs">
                                <Clock className="h-3 w-3" /> Pending
                              </Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-end">
                            {product.status === "active" && !product.is_approved && (
                              <>
                                <Button size="sm" onClick={() => approveProduct(product.id)} className="gap-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                                  <CheckCircle2 className="h-3 w-3" /> Approve
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => rejectProduct(product.id)} className="gap-1 text-destructive">
                                  <XCircle className="h-3 w-3" /> Reject
                                </Button>
                              </>
                            )}
                            {product.is_approved && (
                              <Button size="sm" variant="outline" onClick={() => rejectProduct(product.id)} className="gap-1 text-destructive">
                                <XCircle className="h-3 w-3" /> Revoke
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
