import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CheckCircle2, Package, Flame, Heart } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import MarketplaceNavbar from "@/components/MarketplaceNavbar";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
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

interface Category { id: string; name: string; slug: string; icon: string; }

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerProfiles, setSellerProfiles] = useState<Record<string, { full_name: string | null; is_verified: boolean }>>({});
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => { fetchData(); }, []);

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

  const handleAddToCart = (product: Product) => {
    const primaryImage = product.product_images?.find(i => i.is_primary) || product.product_images?.[0];
    const seller = sellerProfiles[product.seller_id];
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: primaryImage?.image_url || null,
      seller_id: product.seller_id,
      seller_name: seller?.full_name || "Seller",
      stock_quantity: product.stock_quantity,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceNavbar search={search} onSearchChange={setSearch} />
      <CartDrawer />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <AnimatedSection variant="fade-up">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Marketplace</h1>
          <p className="text-muted-foreground mb-6">Discover products from verified sellers worldwide</p>
        </AnimatedSection>

        {/* Category pills */}
        <AnimatedSection variant="fade-up" delay={50}>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            <button onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all ${!selectedCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
              All
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all ${selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection variant="fade-up" delay={100}>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-5 bg-muted rounded w-1/3" /></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground">
                {search || selectedCategory ? "No products match your filters" : "No products listed yet"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                {search || selectedCategory ? "Try different search terms or categories" : "Products will appear here as sellers list them."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(product => {
                const primaryImage = product.product_images?.find(i => i.is_primary) || product.product_images?.[0];
                const seller = sellerProfiles[product.seller_id];
                const discount = product.compare_at_price && product.compare_at_price > product.price
                  ? Math.round((1 - product.price / product.compare_at_price) * 100) : null;

                return (
                  <div key={product.id} className="group rounded-xl border border-border/60 bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                    <Link to={`/product/${product.id}`}>
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        {primaryImage ? (
                          <img src={primaryImage.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        ) : (
                          <div className="flex items-center justify-center h-full"><Package className="h-12 w-12 text-muted-foreground/20" /></div>
                        )}
                        {discount && <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground font-bold">-{discount}%</Badge>}
                        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs"><Flame className="h-3 w-3 mr-0.5" /> Hot</Badge>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{product.title}</h3>
                      </Link>
                      {seller && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">{seller.full_name || "Seller"}</span>
                          {seller.is_verified && <CheckCircle2 className="h-3 w-3 text-accent" />}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-lg font-bold text-foreground">${product.price}</span>
                          {product.compare_at_price && product.compare_at_price > product.price && (
                            <span className="text-sm text-muted-foreground line-through">${product.compare_at_price}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {user && (
                            <button
                              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                              className={`h-9 w-9 flex items-center justify-center rounded-lg border border-border transition-colors ${isWishlisted(product.id) ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-destructive hover:bg-muted"}`}
                            >
                              <Heart className={`h-4 w-4 ${isWishlisted(product.id) ? "fill-current" : ""}`} />
                            </button>
                          )}
                          <Button size="sm" onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                            className="h-9 w-9 p-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                            disabled={product.stock_quantity === 0}>
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
