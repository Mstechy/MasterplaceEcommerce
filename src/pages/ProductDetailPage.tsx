import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Package, Store, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import MarketplaceNavbar from "@/components/MarketplaceNavbar";
import CartDrawer from "@/components/CartDrawer";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  stock_quantity: number;
  seller_id: string;
  category_id: string | null;
  product_images: { id: string; image_url: string; is_primary: boolean }[];
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<{ full_name: string | null; is_verified: boolean; user_id: string } | null>(null);
  const [category, setCategory] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const { data, error } = await supabase.from("products").select("*, product_images(*)").eq("id", id).single();
      if (error || !data) { setLoading(false); return; }
      setProduct(data as unknown as Product);
      const [sellerRes, catRes] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name, is_verified").eq("user_id", data.seller_id).single(),
        data.category_id ? supabase.from("categories").select("name").eq("id", data.category_id).single() : Promise.resolve({ data: null }),
      ]);
      if (sellerRes.data) setSeller(sellerRes.data);
      if (catRes.data) setCategory(catRes.data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const primaryImage = product.product_images?.find(i => i.is_primary) || product.product_images?.[0];
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Package className="h-16 w-16 text-muted-foreground" />
      <h2 className="font-display text-2xl font-bold text-foreground">Product not found</h2>
      <Link to="/marketplace"><Button variant="outline">Back to Marketplace</Button></Link>
    </div>
  );

  const images = product.product_images || [];
  const currentImage = images[selectedImage];

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceNavbar showSearch={false} />
      <CartDrawer />

      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-xl bg-muted overflow-hidden border border-border/60">
              {currentImage ? (
                <img src={currentImage.image_url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full"><Package className="h-16 w-16 text-muted-foreground/30" /></div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={img.id} onClick={() => setSelectedImage(i)}
                    className={`w-18 h-18 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${i === selectedImage ? "border-primary" : "border-border/60"}`}>
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            {category && <Badge variant="secondary">{category.name}</Badge>}
            <h1 className="font-display text-3xl font-bold text-foreground">{product.title}</h1>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-foreground">${product.price}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">${product.compare_at_price}</span>
                  <Badge className="bg-destructive text-destructive-foreground">Save {Math.round((1 - product.price / product.compare_at_price) * 100)}%</Badge>
                </>
              )}
            </div>

            {product.description && <p className="text-muted-foreground leading-relaxed">{product.description}</p>}

            <div className="text-sm">
              {product.stock_quantity > 0 ? (
                <span className="text-accent font-medium">✓ In Stock ({product.stock_quantity} available)</span>
              ) : (
                <span className="text-destructive font-medium">Out of Stock</span>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddToCart} disabled={product.stock_quantity === 0}
                className="flex-1 gap-2 gradient-primary text-primary-foreground shadow-glow h-12 font-semibold">
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
              <Link to="/checkout">
                <Button variant="outline" className="h-12 px-6 font-semibold" onClick={handleAddToCart} disabled={product.stock_quantity === 0}>
                  Buy Now
                </Button>
              </Link>
            </div>

            {seller && (
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Store className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-foreground">{seller.full_name || "Seller"}</span>
                        {seller.is_verified && <CheckCircle2 className="h-4 w-4 text-accent" />}
                      </div>
                      <span className="text-xs text-muted-foreground">Verified Seller</span>
                    </div>
                  </div>
                  <Link to={`/seller/${seller.user_id}`}>
                    <Button variant="outline" size="sm">Visit Store</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
