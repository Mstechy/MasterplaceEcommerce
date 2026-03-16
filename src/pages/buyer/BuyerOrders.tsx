import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Package, ArrowRight, Truck, Flag } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  product_title: string;
  product_image: string | null;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  seller_id: string;
  seller_name: string;
  tracking_number: string | null;
  items: OrderItem[];
}

type Tab = "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  delivered: "bg-accent/10 text-accent border-accent/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  disputed: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function BuyerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (!ordersData) { setLoading(false); return; }

      // Get seller profiles
      const sellerIds = [...new Set(ordersData.map(o => o.seller_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", sellerIds);
      const sellerMap: Record<string, string> = {};
      profiles?.forEach(p => { sellerMap[p.user_id] = p.full_name || "Unknown Seller"; });

      // Get order items with product info
      const orderIds = ordersData.map(o => o.id);
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("id, order_id, quantity, unit_price, product_id")
        .in("order_id", orderIds);

      // Get product details for items
      const productIds = [...new Set((itemsData || []).filter(i => i.product_id).map(i => i.product_id!))];
      let productMap: Record<string, { title: string; image: string | null }> = {};
      if (productIds.length > 0) {
        const { data: products } = await supabase.from("products").select("id, title").in("id", productIds);
        const { data: images } = await supabase.from("product_images").select("product_id, image_url, is_primary").in("product_id", productIds);
        products?.forEach(p => {
          const img = images?.find(i => i.product_id === p.id && i.is_primary) || images?.find(i => i.product_id === p.id);
          productMap[p.id] = { title: p.title, image: img?.image_url || null };
        });
      }

      const itemsByOrder: Record<string, OrderItem[]> = {};
      itemsData?.forEach(item => {
        if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
        const product = item.product_id ? productMap[item.product_id] : null;
        itemsByOrder[item.order_id].push({
          id: item.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          product_title: product?.title || "Unknown Product",
          product_image: product?.image || null,
        });
      });

      setOrders(ordersData.map(o => ({
        id: o.id,
        status: o.status,
        total_amount: o.total_amount,
        currency: o.currency,
        created_at: o.created_at,
        seller_id: o.seller_id,
        seller_name: sellerMap[o.seller_id] || "Unknown Seller",
        tracking_number: o.tracking_number,
        items: itemsByOrder[o.id] || [],
      })));
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const filtered = orders.filter(o => {
    const matchesSearch = !search || o.id.includes(search) || o.tracking_number?.includes(search) || o.seller_name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === "all" || o.status === tab;
    return matchesSearch && matchesTab;
  });

  const tabs: Tab[] = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Orders</h1>
            <p className="mt-1 text-muted-foreground">View and track your purchases ({orders.length} total)</p>
          </div>
          <Link to="/marketplace"><Button className="gap-2 gradient-buyer text-primary-foreground"><Search className="h-4 w-4" /> Continue Shopping</Button></Link>
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={50}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID, tracking number, or seller..." className="pl-10 h-11" />
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={80}>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all capitalize ${tab === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >{t === "all" ? "All Orders" : t}</button>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={100}>
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <Card className="border-border/60">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-5">
                  <Package className="h-9 w-9 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">No orders found</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  {orders.length === 0 ? "When you purchase products, your orders will appear here." : "No orders match your filters."}
                </p>
                <Link to="/marketplace" className="mt-6"><Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">Browse Marketplace <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <Card key={order.id} className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()} · Seller: {order.seller_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-foreground">${order.total_amount}</span>
                      <Badge className={statusColors[order.status] || ""}>{order.status}</Badge>
                    </div>
                  </div>

                  {order.items.length > 0 && (
                    <div className="border-t border-border/60 pt-3 space-y-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0">
                            {item.product_image ? (
                              <img src={item.product_image} alt={item.product_title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full"><Package className="h-4 w-4 text-muted-foreground" /></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.product_title}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.unit_price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-3 pt-3 border-t border-border/60">
                    {(order.status === "shipped" || order.tracking_number) && (
                      <Link to="/buyer/tracking">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Truck className="h-3 w-3" /> Track
                        </Button>
                      </Link>
                    )}
                    <Link to="/buyer/reports">
                      <Button variant="outline" size="sm" className="gap-1 text-destructive">
                        <Flag className="h-3 w-3" /> Report Issue
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AnimatedSection>
    </div>
  );
}
