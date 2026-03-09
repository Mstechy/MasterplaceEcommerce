import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Store, CheckCircle2, Package, Calendar, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";

interface SellerProfile {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  compare_at_price: number | null;
  product_images: { image_url: string; is_primary: boolean }[];
}

export default function SellerStorePage() {
  const { id } = useParams<{ id: string }>();
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const [sellerRes, productsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", id).single(),
        supabase.from("products").select("*, product_images(*)").eq("seller_id", id).eq("status", "active").order("created_at", { ascending: false }),
      ]);
      if (sellerRes.data) setSeller(sellerRes.data as SellerProfile);
      if (productsRes.data) setProducts(productsRes.data as unknown as Product[]);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!seller) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Store className="h-16 w-16 text-muted-foreground" />
      <h2 className="font-display text-2xl font-bold text-foreground">Seller not found</h2>
      <Link to="/marketplace"><Button variant="outline">Back to Marketplace</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary transition-transform group-hover:scale-110">
              <ShoppingBag className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">MarketHub</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/marketplace"><Button variant="outline" size="sm">Marketplace</Button></Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <Link to="/marketplace" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>

        {/* Seller header */}
        <div className="rounded-2xl border border-border/60 bg-card p-8 mb-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
              {seller.avatar_url ? (
                <img src={seller.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Store className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-foreground">{seller.full_name || "Seller Store"}</h1>
                {seller.is_verified && (
                  <Badge className="bg-accent/10 text-accent border-accent/20 gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{products.length} products</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {new Date(seller.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground">No products listed</h3>
            <p className="mt-2 text-sm text-muted-foreground">This seller hasn't listed any products yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(product => {
              const img = product.product_images?.find(i => i.is_primary) || product.product_images?.[0];
              return (
                <Link key={product.id} to={`/product/${product.id}`} className="group">
                  <div className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="aspect-square bg-muted">
                      {img ? (
                        <img src={img.image_url} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full"><Package className="h-12 w-12 text-muted-foreground/30" /></div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{product.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-display text-lg font-bold text-foreground">${product.price}</span>
                        {product.compare_at_price && <span className="text-sm text-muted-foreground line-through">${product.compare_at_price}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
