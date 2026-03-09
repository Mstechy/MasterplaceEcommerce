import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Users, Search, Store, CheckCircle2, Snowflake, Ban, ShieldCheck, ShieldOff } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Seller {
  user_id: string;
  full_name: string | null;
  email: string;
  is_verified: boolean;
  is_banned: boolean;
  is_frozen: boolean;
  created_at: string;
  product_count?: number;
}

type Tab = "all" | "active" | "frozen" | "banned";

export default function AdminSellers() {
  const { toast } = useToast();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  const fetchSellers = async () => {
    // Get all users with seller role
    const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "seller");
    if (!roles || roles.length === 0) { setLoading(false); return; }
    const sellerIds = roles.map(r => r.user_id);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", sellerIds);

    if (profiles) {
      // Get product counts
      const { data: products } = await supabase
        .from("products")
        .select("seller_id")
        .in("seller_id", sellerIds);

      const countMap: Record<string, number> = {};
      products?.forEach(p => { countMap[p.seller_id] = (countMap[p.seller_id] || 0) + 1; });

      setSellers(profiles.map(p => ({ ...p, product_count: countMap[p.user_id] || 0 })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchSellers(); }, []);

  const updateSeller = async (userId: string, update: Partial<{ is_verified: boolean; is_frozen: boolean; is_banned: boolean }>) => {
    const { error } = await supabase.from("profiles").update(update).eq("user_id", userId);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Seller updated" });
    fetchSellers();
  };

  const filtered = sellers.filter(s => {
    const matchesSearch = !search || s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === "all" || (tab === "active" && !s.is_frozen && !s.is_banned) || (tab === "frozen" && s.is_frozen) || (tab === "banned" && s.is_banned);
    return matchesSearch && matchesTab;
  });

  const tabs: { label: string; value: Tab; count: number }[] = [
    { label: "All Sellers", value: "all", count: sellers.length },
    { label: "Active", value: "active", count: sellers.filter(s => !s.is_frozen && !s.is_banned).length },
    { label: "Frozen", value: "frozen", count: sellers.filter(s => s.is_frozen).length },
    { label: "Banned", value: "banned", count: sellers.filter(s => s.is_banned).length },
  ];

  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Manage Sellers</h1>
          <p className="mt-1 text-muted-foreground">View, verify, freeze, or ban seller accounts</p>
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={50}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="pl-10 h-11" />
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
          <CardHeader><CardTitle className="font-display">Sellers</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">Loading sellers...</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                  <Store className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-display font-semibold text-foreground">No sellers found</p>
                <p className="mt-1 text-sm text-muted-foreground">Sellers will appear here once they register on the platform.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seller</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(seller => (
                      <TableRow key={seller.user_id}>
                        <TableCell>
                          <div>
                            <span className="font-medium text-foreground">{seller.full_name || "—"}</span>
                            <p className="text-xs text-muted-foreground">{seller.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {seller.is_banned ? (
                              <Badge variant="destructive">Banned</Badge>
                            ) : seller.is_frozen ? (
                              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Frozen</Badge>
                            ) : (
                              <Badge className="bg-accent/10 text-accent border-accent/20">Active</Badge>
                            )}
                            {seller.is_verified && (
                              <Badge className="bg-accent/10 text-accent border-accent/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Verified</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{seller.product_count}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(seller.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-end">
                            {!seller.is_verified ? (
                              <Button size="sm" variant="outline" onClick={() => updateSeller(seller.user_id, { is_verified: true })} className="gap-1 text-accent">
                                <ShieldCheck className="h-3 w-3" /> Verify
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => updateSeller(seller.user_id, { is_verified: false })} className="gap-1">
                                <ShieldOff className="h-3 w-3" /> Unverify
                              </Button>
                            )}
                            {!seller.is_frozen ? (
                              <Button size="sm" variant="outline" onClick={() => updateSeller(seller.user_id, { is_frozen: true })} className="gap-1">
                                <Snowflake className="h-3 w-3" /> Freeze
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => updateSeller(seller.user_id, { is_frozen: false })} className="gap-1">
                                Unfreeze
                              </Button>
                            )}
                            {!seller.is_banned ? (
                              <Button size="sm" variant="outline" onClick={() => updateSeller(seller.user_id, { is_banned: true })} className="gap-1 text-destructive">
                                <Ban className="h-3 w-3" /> Ban
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => updateSeller(seller.user_id, { is_banned: false })} className="gap-1">
                                Unban
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
