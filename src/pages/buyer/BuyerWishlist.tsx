import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Package, Trash2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    title: string;
    price: number;
    compare_at_price: number | null;
    stock_quantity: number;
    seller_id: string;
    status: string;
    product_images: { image_url: string; is_primary: boolean }[];
  };
}

export default function BuyerWishlist() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("wishlists" as any)
      .select("id, product_id, created_at, product:products(id, title, price, compare_at_price, stock_quantity, seller_id, status, product_images(image_url, is_primary))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setItems(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchWishlist(); }, [user]);

  const removeItem = async (wishlistId: string) => {
    await supabase.from("wishlists" as any).delete().eq("id", wishlistId);
    setItems(prev => prev.filter(i => i.id !== wishlistId));
    toast({ title: "Removed from wishlist" });
  };

  const handleAddToCart = (item: WishlistItem) => {
    const img = item.product.product_images?.find(i => i.is_primary) || item.product.product_images?.[0];
    addItem({
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      image_url: img?.image_url || null,
      seller_id: item.product.seller_id,
      seller_name: "Seller",
      stock_quantity: item.product.stock_quantity,
    });
    toast({ title: "Added to cart" });
  };

  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">My Wishlist</h1>
          <p className="mt-1 text-muted-foreground">Products you've saved for later ({items.length} items)</p>
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={100}>
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading wishlist...</div>
        ) : items.length === 0 ? (
          <Card className="border-border/60">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-5">
                  <Heart className="h-9 w-9 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">Your wishlist is empty</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">Browse the marketplace and tap the heart icon to save products you love.</p>
                <Link to="/marketplace">
                  <Button className="mt-4 bg-primary text-primary-foreground">Browse Products</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(item => {
              const img = item.product.product_images?.find(i => i.is_primary) || item.product.product_images?.[0];
              const discount = item.product.compare_at_price && item.product.compare_at_price > item.product.price
                ? Math.round((1 - item.product.price / item.product.compare_at_price) * 100) : null;

              return (
                <Card key={item.id} className="border-border/60 overflow-hidden group">
                  <Link to={`/product/${item.product.id}`}>
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {img ? (
                        <img src={img.image_url} alt={item.product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="flex items-center justify-center h-full"><Package className="h-10 w-10 text-muted-foreground/20" /></div>
                      )}
                      {discount && <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground font-bold">-{discount}%</Badge>}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{item.product.title}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-display text-lg font-bold text-foreground">${item.product.price}</span>
                      {item.product.compare_at_price && item.product.compare_at_price > item.product.price && (
                        <span className="text-sm text-muted-foreground line-through">${item.product.compare_at_price}</span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => handleAddToCart(item)} disabled={item.product.stock_quantity === 0}
                        className="flex-1 gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
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
