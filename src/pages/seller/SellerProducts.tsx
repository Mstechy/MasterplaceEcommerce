import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package, Pencil, Trash2, ImagePlus, Eye, EyeOff, Archive } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
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
  stock_quantity: number;
  sku: string | null;
  created_at: string;
  product_images: { id: string; image_url: string; is_primary: boolean }[];
}

const statusColors: Record<string, string> = {
  active: "bg-accent/10 text-accent border-accent/20",
  draft: "bg-muted text-muted-foreground border-border",
  archived: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function SellerProducts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [sku, setSku] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setProducts(data as unknown as Product[]);
    setLoading(false);
  }, [user]);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    if (data) setCategories(data);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const resetForm = () => {
    setTitle(""); setDescription(""); setPrice(""); setCompareAtPrice("");
    setCategoryId(""); setStockQuantity(""); setSku(""); setImageFile(null);
    setEditingProduct(null);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setDescription(product.description || "");
    setPrice(String(product.price));
    setCompareAtPrice(product.compare_at_price ? String(product.compare_at_price) : "");
    setCategoryId(product.category_id || "");
    setStockQuantity(String(product.stock_quantity));
    setSku(product.sku || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !title.trim() || !price) return;
    setSaving(true);

    const productData = {
      seller_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      price: parseFloat(price),
      compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
      category_id: categoryId || null,
      stock_quantity: parseInt(stockQuantity) || 0,
      sku: sku.trim() || null,
    };

    let productId = editingProduct?.id;

    if (editingProduct) {
      const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("products").insert(productData).select("id").single();
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
      productId = data.id;
    }

    // Upload image if selected
    if (imageFile && productId) {
      const ext = imageFile.name.split(".").pop();
      const filePath = `${user.id}/${productId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, imageFile);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
        await supabase.from("product_images").insert({
          product_id: productId,
          image_url: urlData.publicUrl,
          is_primary: true,
        });
      }
    }

    toast({ title: editingProduct ? "Product updated" : "Product created" });
    resetForm();
    setDialogOpen(false);
    setSaving(false);
    fetchProducts();
  };

  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === "active" ? "draft" : "active";
    await supabase.from("products").update({ status: newStatus }).eq("id", product.id);
    fetchProducts();
  };

  const archiveProduct = async (id: string) => {
    await supabase.from("products").update({ status: "archived" as any }).eq("id", id);
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

  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Products</h1>
            <p className="mt-1 text-muted-foreground">Manage your product listings ({products.length} total)</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-seller text-primary-foreground shadow-glow-seller">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Title *</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product name" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product..." className="mt-1" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Price *</label>
                    <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Compare at price</label>
                    <Input type="number" step="0.01" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} placeholder="0.00" className="mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Stock</label>
                    <Input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} placeholder="0" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">SKU</label>
                    <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Optional" className="mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Product Image</label>
                  <div className="mt-1 flex items-center gap-3">
                    <label className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors w-full">
                      <ImagePlus className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : "Choose image..."}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving || !title.trim() || !price} className="w-full gradient-seller text-primary-foreground">
                  {saving ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedSection>

      {/* Search */}
      <AnimatedSection variant="fade-up" delay={50}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-10 h-11" />
        </div>
      </AnimatedSection>

      {/* Product list */}
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
                  {search ? "Try a different search term" : "Start listing products to reach buyers worldwide."}
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
                    <Badge className={`absolute top-3 right-3 ${statusColors[product.status]}`}>
                      {product.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display font-semibold text-foreground truncate">{product.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-display text-lg font-bold text-foreground">${product.price}</span>
                      {product.compare_at_price && (
                        <span className="text-sm text-muted-foreground line-through">${product.compare_at_price}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Stock: {product.stock_quantity}</p>
                    <div className="flex gap-1 mt-3">
                      <Button variant="outline" size="sm" onClick={() => openEdit(product)} className="flex-1 gap-1">
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
