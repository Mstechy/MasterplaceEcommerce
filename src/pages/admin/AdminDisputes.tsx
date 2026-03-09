import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Search, Shield, Clock } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Dispute {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  resolved_at: string | null;
}

type Tab = "all" | "open" | "investigating" | "resolved" | "dismissed";

export default function AdminDisputes() {
  const { toast } = useToast();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  const fetchDisputes = async () => {
    const { data } = await supabase.from("disputes").select("*").order("created_at", { ascending: false });
    if (data) setDisputes(data as Dispute[]);
    setLoading(false);
  };

  useEffect(() => { fetchDisputes(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const update: any = { status };
    if (status === "resolved" || status === "dismissed") update.resolved_at = new Date().toISOString();
    const { error } = await supabase.from("disputes").update(update).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Dispute marked as ${status}` });
    fetchDisputes();
  };

  const filtered = disputes.filter(d => {
    const matchesSearch = !search || d.id.includes(search) || d.reason.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === "all" || d.status === tab;
    return matchesSearch && matchesTab;
  });

  const tabs: Tab[] = ["all", "open", "investigating", "resolved", "dismissed"];
  const statusColors: Record<string, string> = {
    open: "bg-destructive/10 text-destructive",
    investigating: "bg-yellow-500/10 text-yellow-600",
    resolved: "bg-accent/10 text-accent",
    dismissed: "bg-muted text-muted-foreground",
  };

  const disputeStats = [
    { label: "Open", value: disputes.filter(d => d.status === "open").length, gradient: "gradient-primary" },
    { label: "Investigating", value: disputes.filter(d => d.status === "investigating").length, gradient: "gradient-seller" },
    { label: "Resolved", value: disputes.filter(d => d.status === "resolved").length, gradient: "gradient-buyer" },
    { label: "Total", value: disputes.length, gradient: "gradient-admin" },
  ];

  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Disputes</h1>
          <p className="mt-1 text-muted-foreground">Manage buyer complaints and fraud reports</p>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {disputeStats.map((stat, i) => (
          <AnimatedSection key={stat.label} variant="fade-up" delay={i * 60}>
            <div className="stat-card">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <p className="font-display text-2xl font-bold text-foreground mt-2">{stat.value}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection variant="fade-up" delay={100}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search disputes..." className="pl-10 h-11" />
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={120}>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all capitalize ${tab === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >{t === "all" ? "All" : t}</button>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={150}>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <Card className="border-border/60">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                  <Shield className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-display font-semibold text-foreground">No disputes found</p>
                <p className="mt-1 text-sm text-muted-foreground">When buyers report issues, disputes will appear here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(dispute => (
              <Card key={dispute.id} className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">{dispute.reason}</p>
                      {dispute.description && <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">{dispute.description}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{new Date(dispute.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[dispute.status] || ""}>{dispute.status}</Badge>
                      {(dispute.status === "open" || dispute.status === "investigating") && (
                        <Select onValueChange={(val) => updateStatus(dispute.id, val)}>
                          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Update" /></SelectTrigger>
                          <SelectContent>
                            {dispute.status === "open" && <SelectItem value="investigating">Investigate</SelectItem>}
                            <SelectItem value="resolved">Resolve</SelectItem>
                            <SelectItem value="dismissed">Dismiss</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={200}>
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-seller mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Dispute Resolution Policy</p>
            <p className="text-xs text-muted-foreground mt-1">Seller accounts are automatically frozen when a buyer submits verified payment proof.</p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
