import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Package, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  seller_id: string;
  tracking_number: string | null;
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
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setOrders(data as Order[]);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const filtered = orders.filter(o => {
    const matchesSearch = !search || o.id.includes(search) || o.tracking_number?.includes(search);
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
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or tracking number..." className="pl-10 h-11" />
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
          <div className="space-y-3">
            {filtered.map(order => (
              <Card key={order.id} className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-foreground">${order.total_amount}</span>
                      <Badge className={statusColors[order.status] || ""}>{order.status}</Badge>
                    </div>
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
