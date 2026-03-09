import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingBag, CheckCircle2, Package } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  category_id: string | null;
  stock_quantity: number;
  seller_id: string;
  product_images: { image_url: string; is_primary: boolean }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerProfiles, setSellerProfiles] = useState<Record<string, { full_name: string | null; is_verified: boolean }>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from("products").select("*, product_images(*)").eq("status", "active").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("sort_order"),
    ]);

    if (productsRes.data) {
      setProducts(productsRes.data as unknown as Product[]);
      const sellerIds = [...new Set(productsRes.data.map(p => p.seller_id))];
      if (sellerIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, is_verified").in("user_id", sellerIds);
        if (profiles) {
          const map: Record<string, { full_name: string | null; is_verified: boolean }> = {};
          profiles.forEach(p => { map[p.user_id] = { full_name: p.full_name, is_verified: p.is_verified }; });
          setSellerProfiles(map);
        }
      }
    }
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  const filtered = products.filter(p => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <Link to="/auth/login"><Button variant="outline" size="sm">Sign In</Button></Link>
            <Link to="/auth/register"><Button size="sm" className="gradient-primary text-primary-foreground">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <AnimatedSection variant="fade-up">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground">Marketplace</h1>
            <p className="mt-2 text-muted-foreground">Discover products from verified sellers worldwide</p>
          </div>
        </AnimatedSection>

        <AnimatedSection variant="fade-up" delay={50}>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-10 h-11" />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            <button onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${!selectedCategory ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              All
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${selectedCategory === cat.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection variant="fade-up" delay={100}>
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-5">
                <Package className="h-9 w-9 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {search || selectedCategory ? "No products match your filters" : "No products listed yet"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                {search || selectedCategory ? "Try different search terms or categories" : "Products will appear here as sellers list them."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(product => {
                const primaryImage = product.product_images?.find(i => i.is_primary) || product.product_images?.[0];
                const seller = sellerProfiles[product.seller_id];
                return (
                  <Link key={product.id} to={`/product/${product.id}`} className="group">
                    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                      <div className="aspect-square bg-muted relative">
                        {primaryImage ? (
                          <img src={primaryImage.image_url} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full"><Package className="h-12 w-12 text-muted-foreground/30" /></div>
                        )}
                        {product.compare_at_price && product.compare_at_price > product.price && (
                          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                            -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{product.title}</h3>
                        {seller && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">{seller.full_name || "Seller"}</span>
                            {seller.is_verified && <CheckCircle2 className="h-3 w-3 text-accent" />}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-display text-lg font-bold text-foreground">${product.price}</span>
                          {product.compare_at_price && (
                            <span className="text-sm text-muted-foreground line-through">${product.compare_at_price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
